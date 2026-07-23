import ProductLayout from "@/components/ProductLayout";
import ProductGate from "@/components/ProductGate";
import { MQTRADE_TELEGRAM } from "@/lib/constants";
import { Trophy, ShieldCheck, TrendingUp, BookOpen, Target, CheckCircle, MessageSquare } from "lucide-react";

export default function PropFirm() {
  return (
    <ProductLayout>
      <ProductGate
        product="prop_firm"
        accent="text-amber-400"
        tagline="Pass your funded challenge with a proven system"
        highlights={[
          "Step-by-step program to pass FTMO, MyForexFunds & other challenges",
          "Strict risk-management rules engineered for evaluation phases",
          "Daily drawdown & lot-sizing framework to stay within limits",
          "Challenge-ready trade plan and checklist",
          "Support until you get funded",
        ]}
      >
        <PropFirmDashboard />
      </ProductGate>
    </ProductLayout>
  );
}

function PropFirmDashboard() {
  const modules = [
    { icon: ShieldCheck, title: "Risk Rules That Pass",   desc: "The exact daily-loss and max-drawdown rules that keep you inside every prop firm's limits." },
    { icon: Target,      title: "The Challenge Plan",     desc: "A day-by-day roadmap to hit the profit target without blowing the account." },
    { icon: TrendingUp,  title: "A+ Setups Only",         desc: "The high-probability setups to focus on during evaluation — and what to skip." },
    { icon: BookOpen,    title: "Psychology & Discipline", desc: "How to trade calm under evaluation pressure and avoid revenge trading." },
  ];

  const firms = ["FTMO", "MyForexFunds", "The5ers", "FundedNext", "E8", "Apex"];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Prop Firm Prep</p>
        <h1 className="font-display text-3xl font-black">Prop Firm Challenge Prep</h1>
        <p className="text-muted-foreground mt-1">Everything you need to pass your funded challenge and keep the account.</p>
      </div>

      {/* Progress banner */}
      <div className="glass-card p-6 border-amber-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="font-display font-bold text-lg">Your Path to Funded</p>
            <p className="text-sm text-muted-foreground">Work through the modules, then take the challenge with our rules.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {firms.map(f => (
            <span key={f} className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{f}</span>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="grid sm:grid-cols-2 gap-4">
        {modules.map((m, i) => (
          <div key={m.title} className="glass-card p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <m.icon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest">Module {i + 1}</span>
              </div>
              <p className="font-semibold text-sm mb-1">{m.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rules checklist */}
      <div className="glass-card p-6">
        <p className="font-display font-bold mb-4">Golden Rules Checklist</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Risk max 0.5–1% per trade",
            "Never exceed daily loss limit",
            "Stop trading after 2 losses in a day",
            "Only A+ setups during evaluation",
            "No trading through high-impact news",
            "Bank profit — don't get greedy near target",
          ].map(r => (
            <div key={r} className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-sm">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="glass-card p-6 text-center">
        <p className="font-semibold mb-1">Questions about your challenge?</p>
        <p className="text-sm text-muted-foreground mb-4">Reach out any time and we'll help you stay on track.</p>
        <a
          href={MQTRADE_TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-colors"
        >
          <MessageSquare className="w-4 h-4" /> Open Telegram
        </a>
      </div>
    </div>
  );
}
