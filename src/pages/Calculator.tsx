import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { Calculator, DollarSign, TrendingUp, Percent, RefreshCw } from "lucide-react";

// ── Instrument pip size lookup ────────────────────────────────────────
const PIP_SIZE: Record<string, number> = {
  "EUR/USD": 0.0001, "GBP/USD": 0.0001, "AUD/USD": 0.0001, "NZD/USD": 0.0001,
  "USD/CAD": 0.0001, "USD/CHF": 0.0001, "USD/JPY": 0.01,  "EUR/JPY": 0.01,
  "GBP/JPY": 0.01,   "AUD/JPY": 0.01,   "XAU/USD": 0.01,  "XAG/USD": 0.001,
  "NAS100": 0.01,    "US30": 1,          "US500": 0.01,     "BTC/USD": 0.01,
  "ETH/USD": 0.01,   "OIL": 0.001,
};
const PIP_VALUE_USD: Record<string, number> = {
  "EUR/USD": 10, "GBP/USD": 10, "AUD/USD": 10, "NZD/USD": 10,
  "USD/CAD": 10, "USD/CHF": 10, "USD/JPY": 7.5,"EUR/JPY": 7.5,
  "GBP/JPY": 7.5,"AUD/JPY": 7.5,"XAU/USD": 1,  "XAG/USD": 50,
  "NAS100": 20,  "US30": 1,     "US500": 50,    "BTC/USD": 1,
  "ETH/USD": 1,  "OIL": 10,
};
const INSTRUMENTS = Object.keys(PIP_SIZE);

type Tab = "position" | "risk" | "pip" | "pivot";

const TabBtn = ({ id, active, label, icon: Icon, onClick }: { id: Tab; active: Tab; label: string; icon: React.ElementType; onClick: (t: Tab) => void }) => (
  <button onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-['JetBrains_Mono'] font-medium transition-all ${active === id ? "text-[#003739]" : "text-[#b9caca] hover:text-[#dfe2eb] hover:bg-white/5"}`}
    style={active === id ? { background: "#00dce5" } : {}}>
    <Icon className="w-4 h-4" />{label}
  </button>
);

const InputField = ({ label, value, onChange, placeholder, step = "any", prefix, suffix, readOnly = false }:
  { label: string; value: string | number; onChange?: (v: string) => void; placeholder?: string; step?: string; prefix?: string; suffix?: string; readOnly?: boolean }) => (
  <div>
    <label className="block font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-1.5">{label}</label>
    <div className="flex items-center stitch-glass rounded-xl overflow-hidden border border-white/10">
      {prefix && <span className="px-3 font-['JetBrains_Mono'] text-[#b9caca] text-sm border-r border-white/10">{prefix}</span>}
      <input
        type="number" step={step} value={value} readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-3 py-3 text-[#dfe2eb] font-['JetBrains_Mono'] text-sm outline-none placeholder:text-[#b9caca]/40"
      />
      {suffix && <span className="px-3 font-['JetBrains_Mono'] text-[#b9caca] text-sm border-l border-white/10">{suffix}</span>}
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div>
    <label className="block font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-1.5">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full stitch-glass rounded-xl px-3 py-3 text-[#dfe2eb] font-['JetBrains_Mono'] text-sm outline-none border border-white/10"
      style={{ background: "rgba(22,27,34,0.75)" }}>
      {options.map(o => <option key={o} value={o} style={{ background: "#1c2026" }}>{o}</option>)}
    </select>
  </div>
);

const ResultCard = ({ label, value, sub, accent = "#00dce5" }: { label: string; value: string; sub?: string; accent?: string }) => (
  <div className="stitch-glass rounded-xl p-4 flex flex-col">
    <p className="font-['Geist'] text-[10px] font-black uppercase tracking-widest text-[#b9caca] mb-1">{label}</p>
    <p className="font-['Sora'] font-bold text-2xl" style={{ color: accent }}>{value}</p>
    {sub && <p className="font-['JetBrains_Mono'] text-[10px] text-[#b9caca] mt-1">{sub}</p>}
  </div>
);

export default function CalculatorPage() {
  const [tab, setTab] = useState<Tab>("position");

  // Position Size Calculator
  const [ps_balance, setPsBalance]     = useState("10000");
  const [ps_risk, setPsRisk]           = useState("1");
  const [ps_entry, setPsEntry]         = useState("");
  const [ps_sl, setPsSl]               = useState("");
  const [ps_tp, setPsTp]               = useState("");
  const [ps_instrument, setPsInstr]    = useState("EUR/USD");

  // Risk/Reward Calculator
  const [rr_entry, setRrEntry]         = useState("");
  const [rr_sl, setRrSl]              = useState("");
  const [rr_tp, setRrTp]              = useState("");
  const [rr_lots, setRrLots]          = useState("0.1");
  const [rr_instrument, setRrInstr]   = useState("EUR/USD");

  // Pip Value Calculator
  const [pv_lots, setPvLots]          = useState("0.1");
  const [pv_pips, setPvPips]          = useState("20");
  const [pv_instrument, setPvInstr]   = useState("EUR/USD");

  // Pivot Points
  const [pp_high, setPpHigh]          = useState("");
  const [pp_low, setPpLow]            = useState("");
  const [pp_close, setPpClose]        = useState("");

  // ── Position size calcs ──────────────────────────────────────────────
  const posCalc = useMemo(() => {
    const bal = parseFloat(ps_balance) || 0;
    const riskPct = parseFloat(ps_risk) || 0;
    const entry = parseFloat(ps_entry) || 0;
    const sl = parseFloat(ps_sl) || 0;
    const tp = parseFloat(ps_tp) || 0;
    if (!bal || !riskPct || !entry || !sl) return null;
    const riskAmount = (bal * riskPct) / 100;
    const pipSize = PIP_SIZE[ps_instrument] || 0.0001;
    const pipValUSD = PIP_VALUE_USD[ps_instrument] || 10;
    const slPips = Math.abs(entry - sl) / pipSize;
    if (!slPips) return null;
    const lots = riskAmount / (slPips * pipValUSD);
    const tpPips = tp ? Math.abs(tp - entry) / pipSize : 0;
    const rr = tpPips && slPips ? tpPips / slPips : 0;
    return {
      lots: lots.toFixed(2),
      riskAmount: riskAmount.toFixed(2),
      slPips: slPips.toFixed(1),
      tpPips: tpPips ? tpPips.toFixed(1) : "—",
      rr: rr ? rr.toFixed(2) : "—",
      potentialProfit: tp ? (tpPips * pipValUSD * lots).toFixed(2) : "—",
    };
  }, [ps_balance, ps_risk, ps_entry, ps_sl, ps_tp, ps_instrument]);

  // ── RR calcs ─────────────────────────────────────────────────────────
  const rrCalc = useMemo(() => {
    const entry = parseFloat(rr_entry) || 0;
    const sl = parseFloat(rr_sl) || 0;
    const tp = parseFloat(rr_tp) || 0;
    const lots = parseFloat(rr_lots) || 0;
    if (!entry || !sl || !tp) return null;
    const pipSize = PIP_SIZE[rr_instrument] || 0.0001;
    const pipVal = PIP_VALUE_USD[rr_instrument] || 10;
    const slPips = Math.abs(entry - sl) / pipSize;
    const tpPips = Math.abs(tp - entry) / pipSize;
    const rr = tpPips / slPips;
    const loss = slPips * pipVal * lots;
    const profit = tpPips * pipVal * lots;
    return {
      rr: rr.toFixed(2),
      slPips: slPips.toFixed(1),
      tpPips: tpPips.toFixed(1),
      loss: loss.toFixed(2),
      profit: profit.toFixed(2),
      rating: rr >= 3 ? "Excellent" : rr >= 2 ? "Good" : rr >= 1 ? "Acceptable" : "Poor",
      ratingColor: rr >= 3 ? "#6ffbbe" : rr >= 2 ? "#00dce5" : rr >= 1 ? "#ffb700" : "#ffb4ab",
    };
  }, [rr_entry, rr_sl, rr_tp, rr_lots, rr_instrument]);

  // ── Pip value calcs ──────────────────────────────────────────────────
  const pvCalc = useMemo(() => {
    const lots = parseFloat(pv_lots) || 0;
    const pips = parseFloat(pv_pips) || 0;
    const pipVal = PIP_VALUE_USD[pv_instrument] || 10;
    const totalValue = lots * pips * pipVal;
    const perPip = lots * pipVal;
    return { perPip: perPip.toFixed(2), total: totalValue.toFixed(2) };
  }, [pv_lots, pv_pips, pv_instrument]);

  // ── Pivot points ─────────────────────────────────────────────────────
  const ppCalc = useMemo(() => {
    const H = parseFloat(pp_high) || 0;
    const L = parseFloat(pp_low) || 0;
    const C = parseFloat(pp_close) || 0;
    if (!H || !L || !C) return null;
    const P = (H + L + C) / 3;
    return {
      P:  P.toFixed(4),
      R1: (2 * P - L).toFixed(4),
      R2: (P + (H - L)).toFixed(4),
      R3: (H + 2 * (P - L)).toFixed(4),
      S1: (2 * P - H).toFixed(4),
      S2: (P - (H - L)).toFixed(4),
      S3: (L - 2 * (H - P)).toFixed(4),
    };
  }, [pp_high, pp_low, pp_close]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,220,229,0.12)" }}>
              <Calculator className="w-5 h-5 text-[#00dce5]" />
            </div>
            <span className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#00dce5]">Trading Tools</span>
          </div>
          <h1 className="font-['Sora'] font-bold text-3xl text-[#dfe2eb]">Trading Calculator</h1>
          <p className="text-[#b9caca] font-['Geist'] text-sm mt-1">Position sizing, risk management, pip values and pivot points</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl border border-white/10" style={{ background: "#1c2026" }}>
          <TabBtn id="position" active={tab} label="Position Size" icon={DollarSign} onClick={setTab} />
          <TabBtn id="risk" active={tab} label="Risk / Reward" icon={TrendingUp} onClick={setTab} />
          <TabBtn id="pip" active={tab} label="Pip Value" icon={Percent} onClick={setTab} />
          <TabBtn id="pivot" active={tab} label="Pivot Points" icon={RefreshCw} onClick={setTab} />
        </div>

        {/* ── Position Size ── */}
        {tab === "position" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="stitch-glass rounded-2xl p-6 space-y-4">
              <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Inputs</h2>
              <SelectField label="Instrument" value={ps_instrument} onChange={setPsInstr} options={INSTRUMENTS} />
              <InputField label="Account Balance" value={ps_balance} onChange={setPsBalance} prefix="$" placeholder="10000" />
              <InputField label="Risk %" value={ps_risk} onChange={setPsRisk} suffix="%" placeholder="1" step="0.1" />
              <InputField label="Entry Price" value={ps_entry} onChange={setPsEntry} placeholder="1.0850" />
              <InputField label="Stop Loss Price" value={ps_sl} onChange={setPsSl} placeholder="1.0820" />
              <InputField label="Take Profit Price (optional)" value={ps_tp} onChange={setPsTp} placeholder="1.0910" />
            </div>
            <div className="space-y-4">
              <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Results</h2>
              {posCalc ? (
                <>
                  <ResultCard label="Recommended Lot Size" value={posCalc.lots + " lots"} sub="Standard lots" accent="#00dce5" />
                  <ResultCard label="Risk Amount" value={"$" + posCalc.riskAmount} sub={ps_risk + "% of account"} accent="#ffb4ab" />
                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard label="SL in Pips" value={posCalc.slPips} accent="#ffb4ab" />
                    <ResultCard label="TP in Pips" value={posCalc.tpPips} accent="#6ffbbe" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard label="Risk:Reward" value={"1:" + posCalc.rr} accent="#00dce5" />
                    <ResultCard label="Potential Profit" value={posCalc.potentialProfit !== "—" ? "$" + posCalc.potentialProfit : "—"} accent="#6ffbbe" />
                  </div>
                </>
              ) : (
                <div className="stitch-glass rounded-2xl p-8 text-center">
                  <Calculator className="w-10 h-10 text-[#b9caca]/30 mx-auto mb-3" />
                  <p className="text-[#b9caca] text-sm font-['Geist']">Enter your trade details to calculate position size</p>
                </div>
              )}
              <div className="stitch-glass rounded-xl p-4">
                <p className="font-['Geist'] text-[10px] font-black uppercase tracking-widest text-[#b9caca] mb-2">Risk Rule of Thumb</p>
                <div className="space-y-1">
                  {[["Conservative","0.5-1%","text-[#6ffbbe]"],["Moderate","1-2%","text-[#00dce5]"],["Aggressive","2-3%","text-[#ffb700]"],["Dangerous","3%+","text-[#ffb4ab]"]].map(([l,v,c]) => (
                    <div key={l} className="flex justify-between items-center">
                      <span className="text-[#b9caca] text-xs font-['JetBrains_Mono']">{l}</span>
                      <span className={`text-xs font-['JetBrains_Mono'] font-bold ${c}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Risk / Reward ── */}
        {tab === "risk" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="stitch-glass rounded-2xl p-6 space-y-4">
              <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Inputs</h2>
              <SelectField label="Instrument" value={rr_instrument} onChange={setRrInstr} options={INSTRUMENTS} />
              <InputField label="Entry Price" value={rr_entry} onChange={setRrEntry} placeholder="1.0850" />
              <InputField label="Stop Loss Price" value={rr_sl} onChange={setRrSl} placeholder="1.0820" />
              <InputField label="Take Profit Price" value={rr_tp} onChange={setRrTp} placeholder="1.0940" />
              <InputField label="Lot Size" value={rr_lots} onChange={setRrLots} placeholder="0.1" step="0.01" />
            </div>
            <div className="space-y-4">
              <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Results</h2>
              {rrCalc ? (
                <>
                  <div className="stitch-glass rounded-2xl p-5 text-center">
                    <p className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-2">Risk:Reward Ratio</p>
                    <p className="font-['Sora'] font-black text-5xl mb-2" style={{ color: rrCalc.ratingColor }}>1:{rrCalc.rr}</p>
                    <span className="font-['JetBrains_Mono'] text-sm font-bold px-3 py-1 rounded-full" style={{ background: rrCalc.ratingColor + "20", color: rrCalc.ratingColor }}>
                      {rrCalc.rating}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard label="SL Distance" value={rrCalc.slPips + " pips"} accent="#ffb4ab" />
                    <ResultCard label="TP Distance" value={rrCalc.tpPips + " pips"} accent="#6ffbbe" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard label="Max Loss" value={"$" + rrCalc.loss} accent="#ffb4ab" />
                    <ResultCard label="Potential Profit" value={"$" + rrCalc.profit} accent="#6ffbbe" />
                  </div>
                </>
              ) : (
                <div className="stitch-glass rounded-2xl p-8 text-center">
                  <TrendingUp className="w-10 h-10 text-[#b9caca]/30 mx-auto mb-3" />
                  <p className="text-[#b9caca] text-sm font-['Geist']">Enter entry, SL, and TP to calculate R:R</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Pip Value ── */}
        {tab === "pip" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="stitch-glass rounded-2xl p-6 space-y-4">
              <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Inputs</h2>
              <SelectField label="Instrument" value={pv_instrument} onChange={setPvInstr} options={INSTRUMENTS} />
              <InputField label="Lot Size" value={pv_lots} onChange={setPvLots} placeholder="0.1" step="0.01" />
              <InputField label="Number of Pips" value={pv_pips} onChange={setPvPips} placeholder="20" />
            </div>
            <div className="space-y-4">
              <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Results</h2>
              <ResultCard label="Value Per Pip" value={"$" + pvCalc.perPip} sub="USD at current rate" accent="#00dce5" />
              <ResultCard label="Total Pip Value" value={"$" + pvCalc.total} sub={pv_pips + " pips × " + pv_lots + " lots"} accent="#6ffbbe" />
              <div className="stitch-glass rounded-xl p-4">
                <p className="font-['Geist'] text-[10px] font-black uppercase tracking-widest text-[#b9caca] mb-3">Standard Pip Values (1 lot)</p>
                <div className="space-y-1.5">
                  {["EUR/USD","GBP/USD","USD/JPY","XAU/USD","NAS100"].map(inst => (
                    <div key={inst} className="flex justify-between items-center">
                      <span className="text-[#b9caca] text-xs font-['JetBrains_Mono']">{inst}</span>
                      <span className="text-[#00dce5] text-xs font-['JetBrains_Mono'] font-bold">${PIP_VALUE_USD[inst]}/pip</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Pivot Points ── */}
        {tab === "pivot" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="stitch-glass rounded-2xl p-6 space-y-4">
              <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Previous Candle (Daily/Weekly)</h2>
              <InputField label="High" value={pp_high} onChange={setPpHigh} placeholder="2050.00" />
              <InputField label="Low" value={pp_low} onChange={setPpLow} placeholder="2020.00" />
              <InputField label="Close" value={pp_close} onChange={setPpClose} placeholder="2035.00" />
            </div>
            <div>
              <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb] mb-4">Pivot Levels</h2>
              {ppCalc ? (
                <div className="space-y-2">
                  {[
                    { label: "R3 — Strong Resistance", value: ppCalc.R3, color: "#ffb4ab" },
                    { label: "R2 — Resistance 2",      value: ppCalc.R2, color: "#ffb4ab" },
                    { label: "R1 — Resistance 1",      value: ppCalc.R1, color: "#ffb4ab" },
                    { label: "PP — Pivot Point",       value: ppCalc.P,  color: "#00dce5" },
                    { label: "S1 — Support 1",         value: ppCalc.S1, color: "#6ffbbe" },
                    { label: "S2 — Support 2",         value: ppCalc.S2, color: "#6ffbbe" },
                    { label: "S3 — Strong Support",    value: ppCalc.S3, color: "#6ffbbe" },
                  ].map(row => (
                    <div key={row.label} className={`flex justify-between items-center px-4 py-2.5 rounded-xl border ${row.label.includes("PP") ? "border-[#00dce5]/30" : "border-white/8"}`}
                      style={{ background: row.label.includes("PP") ? "rgba(0,220,229,0.08)" : "rgba(22,27,34,0.6)" }}>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#b9caca]">{row.label}</span>
                      <span className="font-['JetBrains_Mono'] text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="stitch-glass rounded-2xl p-8 text-center">
                  <RefreshCw className="w-10 h-10 text-[#b9caca]/30 mx-auto mb-3" />
                  <p className="text-[#b9caca] text-sm font-['Geist']">Enter previous candle H/L/C to calculate pivots</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
