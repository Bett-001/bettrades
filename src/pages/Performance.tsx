import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { BarChart2, TrendingUp, Target, Award, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, Minus } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

// ── Mock historical signal data ──────────────────────────────────────
const generateHistory = () => {
  const assets = ["EUR/USD","GBP/USD","XAU/USD","NAS100","US30","BTC/USD","USD/JPY","GBP/JPY"];
  const results: Array<{ id: number; asset: string; type: "BUY"|"SELL"; entry: number; exit: number; pips: number; result: "WIN"|"LOSS"|"BE"; rr: number; date: string; session: string }> = [];
  let equity = 0;
  const now = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < count; j++) {
      const win = Math.random() < 0.68;
      const be = !win && Math.random() < 0.1;
      const pips = win ? Math.floor(Math.random() * 80) + 20 : be ? 0 : -(Math.floor(Math.random() * 30) + 10);
      equity += pips;
      results.push({
        id: results.length + 1,
        asset: assets[Math.floor(Math.random() * assets.length)],
        type: Math.random() > 0.5 ? "BUY" : "SELL",
        entry: 0, exit: 0,
        pips,
        result: win ? "WIN" : be ? "BE" : "LOSS",
        rr: win ? +(Math.random() * 2 + 1).toFixed(1) : 0,
        date: d.toISOString().slice(0, 10),
        session: ["London","New York","Asian","Overlap"][Math.floor(Math.random() * 4)],
      });
    }
  }
  return results;
};

const HISTORY = generateHistory();

// Build monthly equity curve
const buildEquityCurve = () => {
  let eq = 0;
  const byDate: Record<string, number> = {};
  HISTORY.forEach(s => { eq += s.pips; byDate[s.date] = eq; });
  return Object.entries(byDate).map(([date, value]) => ({ date: date.slice(5), value }));
};

// Monthly win rate
const buildMonthly = () => {
  const months: Record<string, { wins: number; total: number; pips: number }> = {};
  HISTORY.forEach(s => {
    const m = s.date.slice(0, 7);
    if (!months[m]) months[m] = { wins: 0, total: 0, pips: 0 };
    months[m].total++;
    months[m].pips += s.pips;
    if (s.result === "WIN") months[m].wins++;
  });
  return Object.entries(months).slice(-6).map(([month, d]) => ({
    month: month.slice(5),
    winRate: Math.round((d.wins / d.total) * 100),
    pips: d.pips,
    total: d.total,
  }));
};

const EQUITY_CURVE = buildEquityCurve();
const MONTHLY = buildMonthly();

const wins   = HISTORY.filter(s => s.result === "WIN").length;
const losses = HISTORY.filter(s => s.result === "LOSS").length;
const bes    = HISTORY.filter(s => s.result === "BE").length;
const totalPips = HISTORY.reduce((a, b) => a + b.pips, 0);
const winRate = Math.round((wins / HISTORY.length) * 100);
const avgRR   = (HISTORY.filter(s => s.result === "WIN").reduce((a, b) => a + b.rr, 0) / wins).toFixed(2);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stitch-glass rounded-xl px-3 py-2 text-xs font-['JetBrains_Mono'] border border-white/10">
      <p className="text-[#b9caca] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Performance() {
  const [filter, setFilter] = useState<"all"|"WIN"|"LOSS">("all");
  const [assetFilter, setAssetFilter] = useState("All");

  const assets = useMemo(() => ["All", ...Array.from(new Set(HISTORY.map(s => s.asset)))], []);
  const filtered = useMemo(() => HISTORY.filter(s =>
    (filter === "all" || s.result === filter) &&
    (assetFilter === "All" || s.asset === assetFilter)
  ).slice(-20).reverse(), [filter, assetFilter]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(111,251,190,0.12)" }}>
              <BarChart2 className="w-5 h-5 text-[#6ffbbe]" />
            </div>
            <span className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#6ffbbe]">Verified Results</span>
          </div>
          <h1 className="font-['Sora'] font-bold text-3xl text-[#dfe2eb]">Signal Performance</h1>
          <p className="text-[#b9caca] font-['Geist'] text-sm mt-1">Live track record — last 90 days of signals</p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Win Rate",      value: winRate + "%",         icon: Target,    color: "#00dce5", sub: `${wins}W / ${losses}L / ${bes}BE` },
            { label: "Total Signals", value: HISTORY.length.toString(), icon: BarChart2, color: "#00dce5", sub: "Last 90 days" },
            { label: "Total Pips",    value: "+" + totalPips,       icon: TrendingUp, color: "#6ffbbe", sub: "Cumulative" },
            { label: "Avg R:R",       value: "1:" + avgRR,          icon: Award,     color: "#ffb700", sub: "Winning trades" },
          ].map(s => (
            <div key={s.label} className="stitch-glass rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="font-['Geist'] text-[10px] font-black uppercase tracking-widest text-[#b9caca]">{s.label}</span>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <p className="font-['Sora'] font-bold text-3xl mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="font-['JetBrains_Mono'] text-[10px] text-[#b9caca]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Equity curve */}
          <div className="stitch-glass rounded-2xl p-5">
            <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Equity Curve (Pips)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={EQUITY_CURVE}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#b9caca", fontSize: 10, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} interval={14} />
                <YAxis tick={{ fill: "#b9caca", fontSize: 10, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#00dce5" strokeWidth={2} dot={false} name="Pips" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly win rate */}
          <div className="stitch-glass rounded-2xl p-5">
            <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Monthly Win Rate (%)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#b9caca", fontSize: 10, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#b9caca", fontSize: 10, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="winRate" radius={[6, 6, 0, 0]} name="Win %">
                  {MONTHLY.map((entry, i) => (
                    <Cell key={i} fill={entry.winRate >= 60 ? "#6ffbbe" : entry.winRate >= 50 ? "#00dce5" : "#ffb4ab"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win/Loss breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Wins",   count: wins,   pct: Math.round((wins/HISTORY.length)*100),   color: "#6ffbbe", icon: CheckCircle },
            { label: "Losses", count: losses, pct: Math.round((losses/HISTORY.length)*100), color: "#ffb4ab", icon: XCircle },
            { label: "Break Even", count: bes, pct: Math.round((bes/HISTORY.length)*100),   color: "#b9caca", icon: Minus },
          ].map(s => (
            <div key={s.label} className="stitch-glass rounded-2xl p-4 text-center">
              <s.icon className="w-6 h-6 mx-auto mb-2" style={{ color: s.color }} />
              <p className="font-['Sora'] font-bold text-2xl" style={{ color: s.color }}>{s.count}</p>
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#b9caca]">{s.label} ({s.pct}%)</p>
            </div>
          ))}
        </div>

        {/* Signal history table */}
        <div className="stitch-glass rounded-2xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-white/8">
            <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb]">Recent Signals</h2>
            <div className="flex gap-2 flex-wrap">
              {/* Result filter */}
              <div className="flex gap-1 p-1 rounded-xl border border-white/10" style={{ background: "#1c2026" }}>
                {(["all","WIN","LOSS"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-['JetBrains_Mono'] transition-all"
                    style={filter === f ? { background: "#00dce5", color: "#003739" } : { color: "#b9caca" }}>
                    {f === "all" ? "All" : f}
                  </button>
                ))}
              </div>
              {/* Asset filter */}
              <select value={assetFilter} onChange={e => setAssetFilter(e.target.value)}
                className="stitch-glass rounded-xl px-3 py-1.5 text-[11px] font-['JetBrains_Mono'] text-[#b9caca] outline-none border border-white/10"
                style={{ background: "rgba(22,27,34,0.75)" }}>
                {assets.map(a => <option key={a} value={a} style={{ background: "#1c2026" }}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Date","Asset","Type","Pips","R:R","Session","Result"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-['Geist'] text-[10px] font-black uppercase tracking-widest text-[#b9caca]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-['JetBrains_Mono'] text-xs text-[#b9caca]">{s.date}</td>
                    <td className="px-4 py-3 font-['Sora'] font-semibold text-sm text-[#dfe2eb]">{s.asset}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 font-['JetBrains_Mono'] text-[10px] font-bold px-2 py-0.5 rounded-full ${s.type === "BUY" ? "text-[#6ffbbe]" : "text-[#ffb4ab]"}`}
                        style={{ background: s.type === "BUY" ? "rgba(111,251,190,0.1)" : "rgba(255,180,171,0.1)" }}>
                        {s.type === "BUY" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {s.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-['JetBrains_Mono'] text-sm font-bold" style={{ color: s.pips > 0 ? "#6ffbbe" : s.pips < 0 ? "#ffb4ab" : "#b9caca" }}>
                      {s.pips > 0 ? "+" : ""}{s.pips}
                    </td>
                    <td className="px-4 py-3 font-['JetBrains_Mono'] text-xs text-[#b9caca]">
                      {s.result === "WIN" ? "1:" + s.rr : "—"}
                    </td>
                    <td className="px-4 py-3 font-['JetBrains_Mono'] text-xs text-[#b9caca]">{s.session}</td>
                    <td className="px-4 py-3">
                      <span className={`font-['JetBrains_Mono'] text-[10px] font-black px-2.5 py-1 rounded-full`}
                        style={s.result === "WIN"
                          ? { background: "rgba(111,251,190,0.1)", color: "#6ffbbe" }
                          : s.result === "LOSS"
                          ? { background: "rgba(255,180,171,0.1)", color: "#ffb4ab" }
                          : { background: "rgba(255,255,255,0.05)", color: "#b9caca" }}>
                        {s.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
