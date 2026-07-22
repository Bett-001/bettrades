import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    const rawBody = await req.text();
    console.log("Raw body received:", rawBody.slice(0, 200));

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody.trim());
    } catch (e) {
      console.error("JSON parse error:", e, "Raw:", rawBody.slice(0, 100));
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const { token, ticket, symbol, type, entry, exit: exitPrice, lots, pnl, date, sl, tp } = body as Record<string, unknown>;

    console.log("Token received:", token, "length:", String(token ?? "").length);

    if (!token || !ticket || !symbol || !type || entry == null || exitPrice == null) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    console.log("Supabase URL:", supabaseUrl, "Key present:", !!serviceKey);

    const supabase = createClient(supabaseUrl, serviceKey);

    // Validate token → resolve user_id
    const { data: tokenRow, error: tokenErr } = await supabase
      .from("mt5_tokens")
      .select("user_id")
      .eq("token", String(token).trim())
      .single();

    console.log("Token lookup result:", JSON.stringify(tokenRow), "Error:", tokenErr?.message);

    if (tokenErr || !tokenRow) {
      return new Response(JSON.stringify({ error: "Invalid API token", detail: tokenErr?.message }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const user_id = tokenRow.user_id;

    // Detect session from UTC hour of entry time
    const dateObj = new Date(String(date).replace(" ", "T") + ":00Z");
    const h = isNaN(dateObj.getTime()) ? 0 : dateObj.getUTCHours();
    let session = "Asian";
    if (h >= 7 && h < 13) session = "London";
    else if (h >= 13 && h < 17) session = "Overlap";
    else if (h >= 17 && h < 22) session = "New York";

    // Calculate RR if SL is known
    let rr = 0;
    if (sl && sl > 0 && entry && exitPrice) {
      const risk = Math.abs(entry - sl);
      const reward = Math.abs(exitPrice - entry);
      if (risk > 0) rr = Math.round((reward / risk) * 100) / 100;
    }

    const datePart = String(date).slice(0, 10);

    // Insert trade — silently skip if this ticket was already logged
    const { error: insertErr } = await supabase.from("trades").upsert(
      {
        user_id,
        mt5_ticket: Number(ticket),
        source: "mt5",
        asset: String(symbol),
        type: String(type).toUpperCase(),
        entry: Number(entry),
        exit_price: Number(exitPrice),
        sl: Number(sl ?? 0),
        tp: Number(tp ?? 0),
        lots: Number(lots ?? 0),
        pnl: Number(pnl ?? 0),
        rr,
        date: datePart,
        session,
        timeframe: "H1",
        strategy: "",
        emotion: "Calm",
        notes: "Auto-synced from MT5",
      },
      { onConflict: "user_id,mt5_ticket", ignoreDuplicates: true }
    );

    if (insertErr) {
      console.error("Insert error:", insertErr.message);
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unhandled error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
