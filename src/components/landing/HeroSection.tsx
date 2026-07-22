import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, TrendingUp, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen max-h-screen flex items-center overflow-hidden pt-16">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full h-full flex items-center gap-5 px-6 lg:px-10">

        {/* ── COL 1: TradingView Banner ── */}
        <Link to="/auth?mode=signup" className="hidden lg:flex flex-col flex-shrink-0 w-[22%] h-[78%] group">
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-violet-500/40 shadow-2xl shadow-violet-500/15 hover:border-violet-400/60 hover:shadow-violet-500/30 transition-all duration-500 bg-black flex flex-col">
            {/* Banner image — full width, natural size, not cropped */}
            <div className="flex-1 flex items-center justify-center p-3 pb-0">
              <img
                src="/tv-banner.png"
                alt="TradingView"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
            {/* No overlay on image — text below */}
            {/* Bottom content */}
            <div className="p-4 pt-2 flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-600/80 text-white text-[9px] font-black uppercase tracking-widest w-fit">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Free Access
              </span>
              <p className="text-white font-display font-bold text-sm leading-tight">TradingView Indicators</p>
              <p className="text-zinc-400 text-[10px] leading-relaxed">Exclusive invite-only scripts. Buy per indicator — no subscription needed.</p>
              <div className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors w-fit mt-1">
                Create Free Account <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </Link>

        {/* ── COL 2: Headline + CTAs ── */}
        <div className="flex-1 flex flex-col justify-center min-w-0 py-4">
        <div className="ml-auto w-full max-w-[420px] pr-2">

          {/* Live pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/25 mb-6 w-fit">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-primary font-semibold tracking-wide uppercase">Live Signals Active</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black leading-[0.92] mb-5 text-left">
            <span className="block text-5xl md:text-6xl text-foreground">Where</span>
            <span className="block text-5xl md:text-6xl" style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Serious
            </span>
            <span className="block text-5xl md:text-6xl text-foreground">Traders</span>
            <span className="block text-4xl md:text-5xl text-muted-foreground/60 italic font-black mt-1">Win.</span>
          </h1>

          <div className="w-12 h-1 bg-primary rounded-full mb-5" />

          <p className="text-base text-muted-foreground leading-relaxed max-w-sm mb-6">
            Real-time signals, professional tools, and a winning community — everything a serious trader needs.{" "}
            <span className="text-foreground font-semibold">No fluff. Just results.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="lg" className="group px-6 h-11 text-sm shadow-xl shadow-primary/25">
                Unlock Your Trading Edge
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="outline" size="lg" className="px-6 h-11 text-sm">
                See All Features
              </Button>
            </a>
          </div>

          {/* Trust bullets */}
          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            {[
              "Live Forex, Gold, Indices & Crypto signals",
              "MT5 auto-sync journal + TradingView indicators",
              "VVIP Telegram community · Cancel anytime",
            ].map(t => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-xs">{t}</span>
              </span>
            ))}
          </div>

          {/* Stats strip */}
          <div className="flex gap-6 mt-6 pt-5 border-t border-border/50">
            {[
              { icon: TrendingUp, val: "500+", label: "Active Traders" },
              { icon: Zap,        val: "98%",  label: "Signal Accuracy" },
              { icon: CheckCircle,val: "24/7", label: "Live Support" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-display font-black text-sm text-foreground">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* ── COL 3: Trader Photo ── */}
        <div className="hidden md:flex flex-shrink-0 w-[28%] h-[80%] relative items-center justify-center">
          {/* Glow */}
          <div className="absolute inset-0 rounded-[40%_60%_55%_45%/45%_55%_60%_40%] bg-primary/10 blur-2xl -z-10" />
          {/* Accent border */}
          <div className="absolute inset-0 border-2 border-primary/25 z-10 pointer-events-none"
            style={{ clipPath: "polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)", transform: "translate(6px, 6px)" }} />
          {/* Photo */}
          <div className="relative w-full h-full overflow-hidden shadow-2xl"
            style={{ clipPath: "polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)" }}>
            <img src="/hero-bg.jpg.png" alt="MQTRADE PRO trader" className="w-full h-full object-cover object-center scale-105" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          {/* Accent dots */}
          <div className="absolute top-[6%] left-[6%] w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50 z-20" />
          <div className="absolute bottom-[6%] right-[6%] w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50 z-20" />
        </div>

      </div>

      {/* Mobile background */}
      <div className="absolute inset-0 md:hidden -z-10">
        <img src="/hero-bg.jpg.png" alt="" className="w-full h-full object-cover opacity-15" />
      </div>

    </section>
  );
};

export default HeroSection;
