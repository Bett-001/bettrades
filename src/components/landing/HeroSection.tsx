import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap, Star, Users, BarChart2, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">

      {/* Background image — more visible */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg.png')" }}
      />
      {/* Lighter overlay so photo shows through */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/65" />

      {/* Subtle vignette edges */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, hsl(var(--background)/0.7) 100%)" }} />

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-primary font-semibold">Live Signals Active · 3,500+ Members</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 animate-slide-up leading-[1.05]">
            Trade Smarter,{" "}
            <span style={{
              background: "var(--gradient-gold)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Win More
            </span>
            <br />
            <span className="text-foreground">with MQTRADE PRO</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed"
            style={{ animationDelay: "0.1s" }}>
            Real-time signals. TradingView & NinjaTrader tools. VVIP Telegram.
            Everything a serious trader needs — in one subscription.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-slide-up"
            style={{ animationDelay: "0.2s" }}>
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl" className="group text-base px-8 py-4 h-auto shadow-2xl shadow-primary/25">
                Get Premium Signals Today
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="outline_gold" size="xl" className="text-base px-8 py-4 h-auto">
                See All Services
              </Button>
            </a>
          </div>

          {/* Quick trust bullets */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-14 animate-fade-in"
            style={{ animationDelay: "0.25s" }}>
            {["No long-term contract", "Cancel anytime", "Instant access after payment"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {t}
              </span>
            ))}
          </div>

          {/* Stat cards — clean horizontal row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.35s" }}>
            {[
              { icon: TrendingUp, value: "+127 pips", label: "EUR/USD today", color: "text-emerald-400", bg: "bg-emerald-500/15" },
              { icon: Users,      value: "3,500+",    label: "Active members", color: "text-primary",    bg: "bg-primary/15" },
              { icon: BarChart2,  value: "85%+",      label: "Win rate MTD",   color: "text-blue-400",   bg: "bg-blue-500/15" },
              { icon: Zap,        value: "24/7",      label: "Signal delivery", color: "text-amber-400", bg: "bg-amber-500/15" },
            ].map(({ icon: Icon, value, label, color, bg }) => (
              <div key={label}
                className="glass-card px-4 py-4 flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform duration-200">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className={`text-2xl font-black ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground leading-tight">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
