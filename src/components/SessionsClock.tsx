import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface Session {
  name: string;
  timezone: string;
  openHour: number;  // UTC
  closeHour: number; // UTC
  color: string;
  glow: string;
  pairs: string[];
}

const SESSIONS: Session[] = [
  { name: "Sydney",   timezone: "AEST",  openHour: 22, closeHour: 7,  color: "#6ffbbe", glow: "rgba(111,251,190,0.15)", pairs: ["AUD/USD","NZD/USD","AUD/JPY"] },
  { name: "Tokyo",    timezone: "JST",   openHour: 0,  closeHour: 9,  color: "#00dce5", glow: "rgba(0,220,229,0.15)",    pairs: ["USD/JPY","EUR/JPY","GBP/JPY"] },
  { name: "London",   timezone: "BST",   openHour: 7,  closeHour: 16, color: "#a78bfa", glow: "rgba(167,139,250,0.15)",  pairs: ["EUR/USD","GBP/USD","EUR/GBP"] },
  { name: "New York", timezone: "EDT",   openHour: 12, closeHour: 21, color: "#ffb700", glow: "rgba(255,183,0,0.15)",    pairs: ["EUR/USD","USD/CAD","USD/CHF"] },
];

function isSessionOpen(session: Session, utcHour: number): boolean {
  const { openHour, closeHour } = session;
  if (openHour < closeHour) return utcHour >= openHour && utcHour < closeHour;
  // Wraps midnight (Sydney)
  return utcHour >= openHour || utcHour < closeHour;
}

function minutesToOpen(session: Session, utcHour: number, utcMin: number): string {
  const totalCurrentMins = utcHour * 60 + utcMin;
  const openMins = session.openHour * 60;
  let diff = openMins - totalCurrentMins;
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function minutesToClose(session: Session, utcHour: number, utcMin: number): string {
  const totalCurrentMins = utcHour * 60 + utcMin;
  const closeMins = session.closeHour * 60;
  let diff = closeMins - totalCurrentMins;
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function SessionsClock({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const utcHour = now.getUTCHours();
  const utcMin  = now.getUTCMinutes();

  const openSessions = SESSIONS.filter(s => isSessionOpen(s, utcHour));
  const isOverlap = openSessions.length >= 2;

  if (compact) {
    return (
      <div className="stitch-glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[#00dce5]" />
          <span className="font-['Geist'] text-[10px] font-black uppercase tracking-widest text-[#b9caca]">Market Sessions</span>
          {isOverlap && <span className="ml-auto font-['JetBrains_Mono'] text-[9px] font-bold px-2 py-0.5 rounded-full text-[#ffb700]" style={{ background: "rgba(255,183,0,0.12)" }}>OVERLAP</span>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SESSIONS.map(s => {
            const open = isSessionOpen(s, utcHour);
            return (
              <div key={s.name} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${open ? "border-opacity-30" : "border-white/5"}`}
                style={open ? { borderColor: s.color + "40", background: s.glow } : { background: "rgba(22,27,34,0.4)" }}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${open ? "animate-pulse" : "opacity-30"}`} style={{ background: open ? s.color : "#b9caca" }} />
                <div className="min-w-0">
                  <p className="font-['JetBrains_Mono'] text-xs font-bold" style={{ color: open ? s.color : "#b9caca" }}>{s.name}</p>
                  <p className="font-['JetBrains_Mono'] text-[9px] text-[#b9caca]">
                    {open ? `Closes in ${minutesToClose(s, utcHour, utcMin)}` : `Opens in ${minutesToOpen(s, utcHour, utcMin)}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div className="space-y-4">
      {/* UTC Clock */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00dce5]" />
          <span className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca]">Live Market Sessions</span>
        </div>
        <div className="font-['JetBrains_Mono'] text-sm text-[#00dce5]">
          {now.toUTCString().slice(17, 25)} UTC
        </div>
      </div>

      {isOverlap && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#ffb700]/30" style={{ background: "rgba(255,183,0,0.08)" }}>
          <span className="w-2 h-2 rounded-full bg-[#ffb700] animate-pulse" />
          <span className="font-['JetBrains_Mono'] text-xs text-[#ffb700] font-bold">SESSION OVERLAP — Highest volatility period</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {SESSIONS.map(s => {
          const open = isSessionOpen(s, utcHour);
          const openPct = (() => {
            const totalCurrentMins = utcHour * 60 + utcMin;
            const openMins = s.openHour * 60;
            let sesLen = (s.closeHour - s.openHour + 24) * 60 % (24 * 60) || (s.closeHour - s.openHour) * 60;
            if (sesLen <= 0) sesLen += 24 * 60;
            let elapsed = totalCurrentMins - openMins;
            if (elapsed < 0) elapsed += 24 * 60;
            return Math.min(100, Math.max(0, (elapsed / sesLen) * 100));
          })();

          return (
            <div key={s.name} className={`stitch-glass rounded-2xl p-4 border transition-all ${open ? "" : "opacity-60"}`}
              style={open ? { borderColor: s.color + "30", boxShadow: `0 4px 24px ${s.glow}` } : {}}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${open ? "animate-pulse" : "opacity-40"}`} style={{ background: open ? s.color : "#b9caca" }} />
                    <h3 className="font-['Sora'] font-bold text-base" style={{ color: open ? s.color : "#dfe2eb" }}>{s.name}</h3>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9caca]">{s.timezone}</span>
                  </div>
                  <p className="font-['JetBrains_Mono'] text-[11px] text-[#b9caca]">
                    {String(s.openHour).padStart(2,"0")}:00 – {String(s.closeHour).padStart(2,"0")}:00 UTC
                  </p>
                </div>
                <span className={`font-['JetBrains_Mono'] text-[10px] font-black uppercase px-2.5 py-1 rounded-full`}
                  style={open ? { background: s.color + "20", color: s.color } : { background: "rgba(255,255,255,0.05)", color: "#b9caca" }}>
                  {open ? "OPEN" : "CLOSED"}
                </span>
              </div>

              {/* Progress bar (only when open) */}
              {open && (
                <div className="mb-3">
                  <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9caca] mb-1">
                    <span>Session progress</span>
                    <span>Closes in {minutesToClose(s, utcHour, utcMin)}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${openPct}%`, background: s.color }} />
                  </div>
                </div>
              )}

              {!open && (
                <p className="font-['JetBrains_Mono'] text-xs text-[#b9caca] mb-3">
                  Opens in <span style={{ color: s.color }}>{minutesToOpen(s, utcHour, utcMin)}</span>
                </p>
              )}

              {/* Active pairs */}
              <div className="flex gap-1.5 flex-wrap">
                {s.pairs.map(p => (
                  <span key={p} className="font-['JetBrains_Mono'] text-[9px] px-2 py-0.5 rounded-full"
                    style={open ? { background: s.color + "15", color: s.color } : { background: "rgba(255,255,255,0.05)", color: "#b9caca" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
