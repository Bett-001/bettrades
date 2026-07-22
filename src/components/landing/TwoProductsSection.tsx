import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, Layers, Check, Zap, TrendingUp } from "lucide-react";

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
  "Browse exclusive TradingView strategies",
  "Preview images & full descriptions",
  "One-time purchase per indicator",
  "Get TradingView invite-only script link",
  "Works on any TradingView plan",
  "New strategies added regularly",
];

export default function TwoProductsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
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
            {/* Top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-amber-400 to-primary" />

            <div className="p-8 flex flex-col flex-1">
              {/* Icon + badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <BarChart2 className="w-7 h-7 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/15 text-primary border border-primary/30 uppercase tracking-widest">
                  SUBSCRIPTION
                </span>
              </div>

              {/* Title & price */}
              <h3 className="font-display text-2xl font-black text-foreground mb-1">MQTRADE PRO</h3>
              <p className="text-muted-foreground text-sm mb-4">Full professional trading platform with live signals, tools & community.</p>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display text-4xl font-black text-primary">$50</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>

              {/* Features */}
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

              {/* CTA */}
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
          <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-card via-card to-amber-500/5 flex flex-col overflow-hidden shadow-2xl shadow-amber-500/10">
            {/* Top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

            <div className="p-8 flex flex-col flex-1">
              {/* Icon + badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                  <Layers className="w-7 h-7 text-amber-400" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
                  FREE ACCOUNT
                </span>
              </div>

              {/* Title & price */}
              <h3 className="font-display text-2xl font-black text-foreground mb-1">TradingView Strategies</h3>
              <p className="text-muted-foreground text-sm mb-4">Exclusive invite-only TradingView indicators & strategies. No subscription needed.</p>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display text-4xl font-black text-amber-400">Free</span>
                <span className="text-muted-foreground text-sm">to create account</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {tvFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-amber-400" />
                    </div>
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/auth?mode=signup">
                <button className="w-full py-4 rounded-2xl bg-amber-500 text-black font-display font-bold text-base flex items-center justify-center gap-2 hover:bg-amber-400 transition-all hover:scale-[1.02] shadow-xl shadow-amber-500/25 group">
                  <TrendingUp className="w-5 h-5" />
                  Browse Indicators Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-3">Create account free · Pay per indicator</p>
            </div>
          </div>

        </div>

        {/* Or divider */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          Already have an account?{" "}
          <Link to="/auth" className="text-primary hover:underline font-semibold">Sign in</Link>
        </p>

      </div>
    </section>
  );
}
