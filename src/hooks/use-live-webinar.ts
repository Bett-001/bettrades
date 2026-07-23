import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface LiveWebinar {
  id: string;
  title: string;
  youtube_url: string;
}

/**
 * Polls for a currently-live webinar. Returns the live session (or null) plus
 * a loading flag. Realtime is used when available; falls back to a short poll.
 */
export function useLiveWebinar() {
  const [live, setLive] = useState<LiveWebinar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchLive = async () => {
      const { data } = await supabase
        .from("webinars")
        .select("id,title,youtube_url")
        .eq("is_live", true)
        .order("published_at", { ascending: false })
        .limit(1);
      if (!active) return;
      setLive(data && data.length > 0 ? (data[0] as LiveWebinar) : null);
      setLoading(false);
    };

    fetchLive();

    // Realtime subscription — updates the banner the moment admin toggles live.
    const channel = supabase
      .channel("webinar-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "webinars" }, fetchLive)
      .subscribe();

    // Safety poll in case realtime is unavailable.
    const poll = setInterval(fetchLive, 60_000);

    return () => {
      active = false;
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, []);

  return { live, loading };
}
