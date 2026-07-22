import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, Check, Zap, TrendingUp } from "lucide-react";

const mqtradeFeatures = [
  "Live Forex, Gold & Indices signals",
  "MT5 auto-sync trading journal",
  "Economic calendar & performance tracker",
  "Risk calculator & prop firm prep",
  "AI trading assistant",
  "VVIP private Telegram channel",
  "Live weekly webinars",
];

const tvFeatures = [
  "Free account — no subscription needed",
  "Browse exclusive invite-only strategies",
  "Preview images & full descriptions",
  "One-time purchase per indicator",
  "Instant TradingView invite link on approval",
  "Works on any TradingView plan",
];

export default function TwoProductsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/4 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-semibold uppercase tracking-widest">Two Ways to Win</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 text-foreground">
            Pick Your Trading Edge
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Two separate products. One platform. Choose the path that fits you — or use both.
          </p>
        </div>

        {/* Two cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-stretch">

          {/* ── Card 1: MQTRADE PRO ── */}
          <div className="relative rounded-3xl border border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 flex flex-col overflow-hidden shadow-2xl shadow-primary/10">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-amber-400 to-primary" />

            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <BarChart2 className="w-7 h-7 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/15 text-primary border border-primary/30 uppercase tracking-widest">
                  Subscription
                </span>
              </div>

              <h3 className="font-display text-2xl font-black text-foreground mb-1">MQTRADE PRO</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Full professional trading platform with live signals, tools &amp; community.
              </p>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display text-4xl font-black text-primary">$50</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {mqtradeFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth?mode=signup&plan=elite">
                <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-xl shadow-primary/25 group">
                  Get MQTRADE PRO
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-3">Cancel anytime · Instant access</p>
            </div>
          </div>

          {/* ── Card 2: TradingView Indicators ── */}
          <div className="relative rounded-3xl border border-violet-500/30 flex flex-col overflow-hidden shadow-2xl shadow-violet-500/15"
            style={{ background: "linear-gradient(160deg, #0d0d14 0%, #0f0a1e 60%, #120d20 100%)" }}>

            {/* Top glow bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-purple-400 to-violet-600" />

            {/* TV Banner image */}
            <div className="relative w-full h-44 overflow-hidden">
              <img
                src="/tv-banner.png"
                alt="TradingView"
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient overlay so text below reads cleanly */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d14]" />
              {/* Purple glow overlay */}
              <div className="absolute inset-0 bg-violet-900/20" />
            </div>

            <div className="px-8 pb-8 flex flex-col flex-1 -mt-2">

              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <div />
                <span className="px-3 py-1 rounded-full text-xs font-black bg-violet-500/15 text-violet-300 border border-violet-500/30 uppercase tracking-widest">
                  Free Account
                </span>
              </div>

              {/* Title & tagline */}
              <h3 className="font-display text-2xl font-black text-white mb-1">TradingView Strategies</h3>
              <p className="text-violet-300 text-xs font-semibold tracking-widest uppercase mb-3">
                Look first / Then leap.
              </p>
              <p className="text-zinc-400 text-sm mb-5">
                Exclusive invite-only scripts built for edge. Browse, buy &amp; get your private TradingView access link — no monthly subscription required.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display text-4xl font-black text-white">Free</span>
                <span className="text-zinc-500 text-sm">to join · pay per indicator</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {tvFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-violet-400" />
                    </div>
                    <span className="text-sm text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/auth?mode=signup">
                <button className="w-full py-4 rounded-2xl font-display font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xl group"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "#fff", boxShadow: "0 0 32px rgba(139,92,246,0.35)" }}>
                  <TrendingUp className="w-5 h-5" />
                  Browse Indicators Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <p className="text-center text-xs text-zinc-600 mt-3">Create account free · Pay per indicator</p>
            </div>
          </div>

        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          Already have an account?{" "}
          <Link to="/auth" className="text-primary hover:underline font-semibold">Sign in</Link>
        </p>

      </div>
    </section>
  );
}
