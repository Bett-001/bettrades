import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Send, BarChart2, BookOpen, Bell, ChevronRight, ExternalLink, Download, Globe } from "lucide-react";

const STEPS = [
  { id: 1, title: "Welcome to MQTRADE PRO",   icon: BarChart2 },
  { id: 2, title: "Join VVIP Telegram",        icon: Send },
  { id: 3, title: "Connect MT5 (Optional)",    icon: Download },
  { id: 4, title: "Set Your Preferences",      icon: Bell },
  { id: 5, title: "You're Ready to Trade!",    icon: Check },
];

const MARKETS   = ["Forex", "Indices", "Gold/Silver", "Crypto"];
const SESSIONS  = ["London", "New York", "Asian", "All Sessions"];
const RISKS     = ["Conservative (0.5-1%)", "Moderate (1-2%)", "Aggressive (2-3%)"];
const TIMEFRAMES = ["M15", "H1", "H4", "D1"];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [markets, setMarkets]       = useState<string[]>(["Forex", "Gold/Silver"]);
  const [session, setSession]       = useState("London");
  const [risk, setRisk]             = useState("Moderate (1-2%)");
  const [timeframe, setTimeframe]   = useState("H4");
  const [saving, setSaving]         = useState(false);

  const toggleMarket = (m: string) =>
    setMarkets(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const finish = async () => {
    setSaving(true);
    if (user) {
      await supabase.auth.updateUser({
        data: { onboarded: true, preferred_markets: markets, preferred_session: session, risk_level: risk, preferred_timeframe: timeframe }
      });
    }
    setSaving(false);
    navigate("/dashboard");
  };

  const skip = async () => {
    if (user) await supabase.auth.updateUser({ data: { onboarded: true } });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#0d1117", color: "#dfe2eb" }}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(0,220,229,0.06)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(111,251,190,0.04)" }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress stepper */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-['JetBrains_Mono'] transition-all ${
                step > s.id ? "text-[#003739]" : step === s.id ? "ring-2 ring-[#00dce5] text-[#00dce5]" : "text-[#b9caca]"
              }`} style={step > s.id ? { background: "#00dce5" } : step === s.id ? { background: "rgba(0,220,229,0.12)" } : { background: "rgba(255,255,255,0.05)" }}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-1 w-8 md:w-12 transition-all" style={{ background: step > s.id ? "#00dce5" : "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="stitch-glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(0,220,229,0.5),transparent)" }} />

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(0,220,229,0.12)" }}>
                <BarChart2 className="w-8 h-8 text-[#00dce5]" />
              </div>
              <h1 className="font-['Sora'] font-bold text-2xl text-[#dfe2eb] mb-3">Welcome to MQTRADE PRO 🎉</h1>
              <p className="text-[#b9caca] font-['Geist'] mb-6 leading-relaxed">
                Let's get you set up in just a few steps. It takes less than 2 minutes and unlocks everything you need to start trading smarter.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                {[
                  "Real-time trading signals","VVIP Telegram access",
                  "MT5 auto-sync journal","Risk management tools",
                  "Economic calendar","Professional calculators",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6ffbbe] flex-shrink-0" />
                    <span className="font-['Geist'] text-sm text-[#b9caca]">{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3.5 rounded-full font-['Geist'] font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: "#00dce5", color: "#003739", boxShadow: "0 0 24px rgba(0,245,255,0.2)" }}>
                Let's Get Started <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2 — Telegram */}
          {step === 2 && (
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: "rgba(34,158,217,0.12)" }}>
                <Send className="w-7 h-7 text-[#229ED9]" />
              </div>
              <h2 className="font-['Sora'] font-bold text-xl text-[#dfe2eb] mb-2">Join VVIP Telegram Channel</h2>
              <p className="text-[#b9caca] font-['Geist'] text-sm mb-6 leading-relaxed">
                Your VVIP Telegram channel is where all signals, market analysis and live discussions happen. This is the heartbeat of MQTRADE PRO.
              </p>
              <div className="stitch-glass rounded-2xl p-4 mb-4 border border-[#229ED9]/20">
                {["Instant signal notifications","Market analysis & commentary","Live trade discussions","Member-only setups"].map(f => (
                  <div key={f} className="flex items-center gap-2 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#229ED9]" />
                    <span className="font-['Geist'] text-sm text-[#b9caca]">{f}</span>
                  </div>
                ))}
              </div>
              <a href="https://t.me/TonnyFxacademy" target="_blank" rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl font-['Geist'] font-bold text-sm flex items-center justify-center gap-2 mb-3 transition-all hover:opacity-90"
                style={{ background: "#229ED9", color: "#fff" }}>
                <ExternalLink className="w-4 h-4" /> Open VVIP Telegram
              </a>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-[#b9caca] text-sm font-['Geist'] hover:bg-white/5 transition-all">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-xl font-['Geist'] font-bold text-sm transition-all" style={{ background: "#00dce5", color: "#003739" }}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — MT5 */}
          {step === 3 && (
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: "rgba(111,251,190,0.1)" }}>
                <Download className="w-7 h-7 text-[#6ffbbe]" />
              </div>
              <h2 className="font-['Sora'] font-bold text-xl text-[#dfe2eb] mb-2">Connect MetaTrader 5 (Optional)</h2>
              <p className="text-[#b9caca] font-['Geist'] text-sm mb-5 leading-relaxed">
                Auto-sync your MT5 trades to your Trading Journal using our Expert Advisor. Trades appear in real-time — no manual logging needed.
              </p>
              <div className="space-y-3 mb-5">
                {[
                  { n: "1", t: "Go to Trading Journal", s: "Click 'Connect MT5' to generate your API token" },
                  { n: "2", t: "Download the EA",        s: "Download BetTradesSync.mq5 from your journal page" },
                  { n: "3", t: "Install & attach",       s: "Add the EA to any chart in MT5 with your token" },
                ].map(item => (
                  <div key={item.n} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5" style={{ background: "#00dce5", color: "#003739" }}>{item.n}</span>
                    <div>
                      <p className="font-['Geist'] text-sm font-semibold text-[#dfe2eb]">{item.t}</p>
                      <p className="font-['Geist'] text-xs text-[#b9caca]">{item.s}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-[#b9caca] text-sm font-['Geist'] hover:bg-white/5 transition-all">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 py-2.5 rounded-xl font-['Geist'] font-bold text-sm" style={{ background: "#00dce5", color: "#003739" }}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 4 — Preferences */}
          {step === 4 && (
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center" style={{ background: "rgba(255,183,0,0.1)" }}>
                <Globe className="w-7 h-7 text-[#ffb700]" />
              </div>
              <h2 className="font-['Sora'] font-bold text-xl text-[#dfe2eb] mb-2">Set Your Preferences</h2>
              <p className="text-[#b9caca] font-['Geist'] text-sm mb-5">We'll personalise your dashboard and signal feed based on your trading style.</p>

              {/* Markets */}
              <div className="mb-4">
                <p className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-2">Preferred Markets</p>
                <div className="flex flex-wrap gap-2">
                  {MARKETS.map(m => (
                    <button key={m} onClick={() => toggleMarket(m)}
                      className="px-3 py-1.5 rounded-xl text-xs font-['JetBrains_Mono'] border transition-all"
                      style={markets.includes(m) ? { background: "rgba(0,220,229,0.15)", borderColor: "#00dce5", color: "#00dce5" } : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#b9caca" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session */}
              <div className="mb-4">
                <p className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-2">Trading Session</p>
                <div className="flex flex-wrap gap-2">
                  {SESSIONS.map(s => (
                    <button key={s} onClick={() => setSession(s)}
                      className="px-3 py-1.5 rounded-xl text-xs font-['JetBrains_Mono'] border transition-all"
                      style={session === s ? { background: "rgba(0,220,229,0.15)", borderColor: "#00dce5", color: "#00dce5" } : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#b9caca" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk */}
              <div className="mb-4">
                <p className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-2">Risk Tolerance</p>
                <div className="flex flex-wrap gap-2">
                  {RISKS.map(r => (
                    <button key={r} onClick={() => setRisk(r)}
                      className="px-3 py-1.5 rounded-xl text-xs font-['JetBrains_Mono'] border transition-all"
                      style={risk === r ? { background: "rgba(0,220,229,0.15)", borderColor: "#00dce5", color: "#00dce5" } : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#b9caca" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-[#b9caca] text-sm font-['Geist'] hover:bg-white/5 transition-all">Back</button>
                <button onClick={() => setStep(5)} className="flex-1 py-2.5 rounded-xl font-['Geist'] font-bold text-sm" style={{ background: "#00dce5", color: "#003739" }}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 5 — Done */}
          {step === 5 && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(111,251,190,0.12)", boxShadow: "0 0 40px rgba(111,251,190,0.2)" }}>
                <Check className="w-10 h-10 text-[#6ffbbe]" />
              </div>
              <h2 className="font-['Sora'] font-bold text-2xl text-[#dfe2eb] mb-3">You're All Set! 🚀</h2>
              <p className="text-[#b9caca] font-['Geist'] text-sm mb-6 leading-relaxed">
                Your MQTRADE PRO account is fully configured. Head to your dashboard to see live signals and start trading.
              </p>
              <div className="stitch-glass rounded-2xl p-4 mb-6 text-left">
                <p className="font-['Geist'] text-[10px] font-black uppercase tracking-widest text-[#b9caca] mb-3">Your Setup</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-['JetBrains_Mono']">
                    <span className="text-[#b9caca]">Markets</span>
                    <span className="text-[#00dce5]">{markets.join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-xs font-['JetBrains_Mono']">
                    <span className="text-[#b9caca]">Session</span>
                    <span className="text-[#00dce5]">{session}</span>
                  </div>
                  <div className="flex justify-between text-xs font-['JetBrains_Mono']">
                    <span className="text-[#b9caca]">Risk</span>
                    <span className="text-[#00dce5]">{risk}</span>
                  </div>
                </div>
              </div>
              <button onClick={finish} disabled={saving}
                className="w-full py-3.5 rounded-full font-['Geist'] font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "#00dce5", color: "#003739", boxShadow: "0 0 24px rgba(0,245,255,0.25)" }}>
                {saving ? <><div className="w-4 h-4 border-2 border-[#003739]/30 border-t-[#003739] rounded-full animate-spin" />Saving…</> : <>Go to Dashboard <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}
        </div>

        <button onClick={skip} className="w-full mt-4 text-center font-['JetBrains_Mono'] text-xs text-[#b9caca] hover:text-[#dfe2eb] transition-colors">
          Skip setup → Go to Dashboard
        </button>
      </div>
    </div>
  );
}
