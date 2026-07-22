import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Layers } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-stretch overflow-hidden pt-16">

      {/* ── LEFT — text side ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center w-full md:w-[52%] px-8 md:px-16 lg:px-24 py-20 bg-background/95">

        {/* Live pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/25 mb-10 w-fit">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-primary font-semibold tracking-wide uppercase">Live Signals Active</span>
        </div>

        {/* Giant headline */}
        <h1 className="font-display font-black leading-[0.95] mb-8 text-left">
          <span className="block text-6xl md:text-7xl lg:text-8xl text-foreground">Where</span>
          <span
            className="block text-6xl md:text-7xl lg:text-8xl"
            style={{
              background: "var(--gradient-gold)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Serious
          </span>
          <span className="block text-6xl md:text-7xl lg:text-8xl text-foreground">Traders</span>
          <span className="block text-5xl md:text-6xl lg:text-7xl text-muted-foreground/60 italic font-black mt-1">
            Win.
          </span>
        </h1>

        {/* Divider */}
        <div className="w-16 h-1 bg-primary rounded-full mb-8" />

        {/* Description */}
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-10">
          MQTRADE PRO is a premium home for retail traders who want
          real-time signals, professional tools, and a winning community.{" "}
          <span className="text-foreground font-semibold">No fluff. Just results.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
          <Link to="/auth?mode=signup">
            <Button variant="hero" size="lg" className="group px-7 h-12 text-base shadow-xl shadow-primary/25">
              Unlock Your Trading Edge
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <a href="#services">
            <Button variant="outline" size="lg" className="px-7 h-12 text-base">
              See All Services
            </Button>
          </a>
        </div>

        {/* Trust bullets */}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {[
            "Real-time Forex, Gold, Indices & Crypto signals",
            "VVIP Telegram + TradingView indicators included",
            "Cancel anytime — no long-term commitment",
          ].map(t => (
            <span key={t} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              {t}
            </span>
          ))}
        </div>

      </div>

      {/* ── RIGHT — two visuals side by side ───────────────────────────────────── */}
      <div className="hidden md:flex absolute inset-y-0 right-0 w-[54%] items-center gap-4 px-6">

        {/* TV Banner card */}
        <Link to="/auth?mode=signup" className="relative h-[70%] w-[38%] flex-shrink-0 rounded-2xl overflow-hidden border border-violet-500/40 shadow-2xl shadow-violet-500/20 group">
          <img src="/tv-banner.png" alt="TradingView Indicators" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* Text */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-300 mb-0.5">Free Access</p>
            <p className="text-white font-display font-black text-sm leading-tight">TradingView Indicators</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold bg-violet-600 text-white px-2.5 py-1 rounded-lg">
              Create Account <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </Link>

        {/* Hero photo */}
        <div className="relative flex-1 h-[84%]">
          <div className="absolute w-full h-full rounded-[40%_60%_55%_45%/45%_55%_60%_40%] bg-primary/10 blur-2xl -z-10 translate-x-2 translate-y-2" />
          <div
            className="absolute inset-0 border-2 border-primary/30 z-10 pointer-events-none"
            style={{ clipPath: "polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)", transform: "translate(8px, 8px)" }}
          />
          <div className="relative w-full h-full overflow-hidden shadow-2xl" style={{ clipPath: "polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)" }}>
            <img src="/hero-bg.jpg.png" alt="MQTRADE PRO trader" className="w-full h-full object-cover object-center scale-105" />
            <div className="absolute"
              style={{ top: "10%", left: "20%", width: "55%", height: "50%", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
                mask: "radial-gradient(ellipse at center, black 25%, transparent 70%)", WebkitMask: "radial-gradient(ellipse at center, black 25%, transparent 70%)" }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div className="absolute top-[8%] left-[4%] w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50 z-20" />
          <div className="absolute bottom-[8%] right-[4%] w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50 z-20" />
        </div>
      </div>

      {/* Mobile background (small screens) */}
      <div className="absolute inset-0 md:hidden -z-10">
        <img src="/hero-bg.jpg.png" alt="" className="w-full h-full object-cover opacity-20" />
      </div>

    </section>
  );
};

export default HeroSection;
