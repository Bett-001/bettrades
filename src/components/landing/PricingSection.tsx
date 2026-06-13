import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Zap, ArrowRight } from "lucide-react";

type BillingCycle = "monthly" | "yearly";

interface Plan {
  id: string;
  name: string;
  price: Record<BillingCycle, number>;
  per: string;
  desc: string;
  popular: boolean;
  cta: string;
  href: string;
  features: { text: string; included: boolean }[];
}

const plans: Plan[] = [
  {
    id: "trial",
    name: "FREE TRIAL",
    price: { monthly: 0, yearly: 0 },
    per: "5 days",
    desc: "Try any plan free for 5 days. Credit card required — cancel anytime before the trial ends.",
    popular: false,
    cta: "Start Free Trial",
    href: "/auth?mode=signup&plan=trial",
    features: [
      { text: "Full access to your chosen plan's features", included: true },
      { text: "No charge for 5 days", included: true },
      { text: "Cancel before trial ends to pay nothing", included: true },
      { text: "Automatically billed after trial period", included: true },
      { text: "VVIP Telegram channel", included: false },
      { text: "NinjaTrader NT8 strategies", included: false },
      { text: "Live weekly webinars", included: false },
      { text: "MT5 auto-sync journal", included: false },
    ],
  },
  {
    id: "elite",
    name: "ELITE",
    price: { monthly: 50, yearly: 40 },
    per: "month",
    desc: "For seasoned traders and professionals who want every advantage.",
    popular: true,
    cta: "Get Elite",
    href: "/auth?mode=signup&plan=elite",
    features: [
      { text: "All Pro features included", included: true },
      { text: "VVIP private Telegram channel", included: true },
      { text: "Connect up to 3 MT5 accounts", included: true },
      { text: "Full TradingView indicator suite", included: true },
      { text: "NinjaTrader NT8 strategy suite", included: true },
      { text: "AI chat on all accounts", included: true },
      { text: "Live weekly webinars (recorded)", included: true },
      { text: "Custom strategy templates", included: true },
      { text: "Prop firm prep program", included: true },
      { text: "1 mentorship session / month", included: true },
      { text: "Early access to new features", included: true },
      { text: "Priority support", included: true },
    ],
  },
  {
    id: "pro",
    name: "PRO",
    price: { monthly: 30, yearly: 24 },
    per: "month",
    desc: "For individual traders and enthusiasts ready to level up.",
    popular: false,
    cta: "Get Started",
    href: "/auth?mode=signup&plan=pro",
    features: [
      { text: "All live signals — Forex, Gold, Indices, Crypto", included: true },
      { text: "Unlimited EA / Indicator creation", included: true },
      { text: "Connect 1 MT5 account", included: true },
      { text: "MT5 auto-sync trading journal", included: true },
      { text: "TradingView indicators (3 scripts)", included: true },
      { text: "Full economic calendar", included: true },
      { text: "Daily market analysis reports", included: true },
      { text: "Risk management on every signal", included: true },
      { text: "Access AI chat on account", included: true },
      { text: "Access performance tracker & reports", included: true },
      { text: "Push & email signal alerts", included: true },
      { text: "Cancel anytime — no lock-in", included: true },
    ],
  },
];

const PricingSection = () => {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section id="pricing" className="py-28 relative overflow-hidden bg-background">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/6 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-semibold uppercase tracking-widest">Pricing Plans</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black mb-4">
            Simple,{" "}
            <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Choose the plan that fits your trading goals. Upgrade or cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-border bg-card/60 backdrop-blur">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                billing === "monthly"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="text-[10px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => {
            const price = plan.price[billing];
            const isFree = price === 0;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 ${
                  isPopular
                    ? "border-primary/50 shadow-2xl shadow-primary/20 scale-[1.03] md:-mt-4"
                    : "border-border/60 bg-card/40 hover:border-border hover:shadow-lg"
                }`}
                style={isPopular ? {
                  background: "linear-gradient(160deg, hsl(var(--card)/0.95) 0%, hsl(var(--primary)/0.08) 100%)",
                } : undefined}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                      POPULAR
                    </div>
                  </div>
                )}

                {/* Top accent bar */}
                {isPopular && (
                  <div className="h-1 w-full bg-primary" />
                )}

                <div className="p-7 flex flex-col flex-1">

                  {/* Plan name */}
                  <p className={`text-sm font-black uppercase tracking-widest mb-4 ${
                    isPopular ? "text-primary" : "text-primary"
                  }`}>{plan.name}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-display text-5xl font-black text-foreground">
                      ${price}
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">
                      /{plan.per}
                    </span>
                  </div>

                  {/* Yearly savings callout */}
                  {billing === "yearly" && !isFree && (
                    <p className="text-[11px] text-emerald-500 font-semibold mb-3">
                      Save ${(plan.price.monthly - price) * 12}/year
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {plan.desc}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          f.included
                            ? "bg-primary/15 border border-primary/30"
                            : "bg-muted border border-border"
                        }`}>
                          {f.included
                            ? <Check className="w-3 h-3 text-primary" />
                            : <X className="w-3 h-3 text-muted-foreground/50" />
                          }
                        </div>
                        <span className={`text-sm leading-snug ${
                          f.included ? "text-foreground" : "text-muted-foreground/50 line-through"
                        }`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to={plan.href}>
                    <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${
                      isPopular
                        ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 hover:scale-[1.02]"
                        : "border-2 border-primary/60 text-primary hover:bg-primary/10 hover:border-primary hover:scale-[1.02]"
                    }`}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>

                  {isFree && (
                    <p className="text-center text-[11px] text-muted-foreground mt-3">
                      Credit card required · Cancel anytime
                    </p>
                  )}
                  {!isFree && (
                    <p className="text-center text-[11px] text-muted-foreground mt-3">
                      {billing === "yearly" ? "Billed annually" : "Billed monthly"} · Cancel anytime
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-4">
          <span>🔒 Secure payment</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>⚡ Instant access</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>💳 No hidden fees</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>↩ Cancel anytime</span>
        </p>

      </div>
    </section>
  );
};

export default PricingSection;
