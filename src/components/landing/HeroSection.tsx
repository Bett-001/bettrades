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
        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-10">
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

        {/* Two-path strip */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
          {/* MQTRADE PRO option */}
          <Link to="/auth?mode=signup&plan=elite" className="flex-1">
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all group cursor-pointer">
              <img src="/logo2.png.png" alt="MQTRADE PRO" className="w-9 h-9 object-contain rounded-xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-black text-foreground uppercase tracking-wider">MQTRADE PRO</p>
                <p className="text-[10px] text-primary font-semibold">$50/month · Full platform</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* TradingView option */}
          <Link to="/auth?mode=signup" className="flex-1">
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/50 transition-all group cursor-pointer overflow-hidden">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                <img src="/tv-banner.png" alt="TradingView" className="w-full h-full object-cover object-left" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-foreground uppercase tracking-wider">TV Indicators</p>
                <p className="text-[10px] text-violet-400 font-semibold">Free account · Buy per script</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-violet-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── RIGHT — photo side ───────────────────────────────────── */}
      <div className="hidden md:flex absolute inset-y-0 right-0 w-[54%] items-center justify-center pr-10">

        {/* Decorative glow rings behind the frame */}
        <div className="absolute w-[90%] h-[88%] rounded-[40%_60%_55%_45%/45%_55%_60%_40%] bg-primary/10 blur-2xl -z-10 translate-x-4 translate-y-4" />
        <div className="absolute w-[85%] h-[83%] rounded-[60%_40%_45%_55%/55%_45%_40%_60%] border border-primary/20 -z-10" />

        {/* Outer accent border (offset, gold) */}
        <div
          className="absolute w-[82%] h-[84%] border-2 border-primary/30 z-10 pointer-events-none"
          style={{
            clipPath: "polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)",
            transform: "translate(12px, 12px)",
          }}
        />

        {/* Image frame — cool cut-corner polygon */}
        <div
          className="relative w-[82%] h-[84%] overflow-hidden shadow-2xl"
          style={{
            clipPath: "polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)",
          }}
        >
          <img
            src="/hero-bg.jpg.png"
            alt="MQTRADE PRO trader"
            className="w-full h-full object-cover object-center scale-105"
          />

          {/* Face blur */}
          <div
            className="absolute inset-0"
            style={{
              background: "transparent",
              backdropFilter: "blur(0px)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "10%",
              left: "20%",
              width: "55%",
              height: "50%",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              mask: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
              WebkitMask: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
            }}
          />

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/60 to-transparent" />
        </div>

        {/* Corner accent dot — top-left */}
        <div className="absolute top-[8%] left-[9%] w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50 z-20" />
        {/* Corner accent dot — bottom-right */}
        <div className="absolute bottom-[8%] right-[9%] w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50 z-20" />
      </div>

      {/* Mobile background (small screens) */}
      <div className="absolute inset-0 md:hidden -z-10">
        <img src="/hero-bg.jpg.png" alt="" className="w-full h-full object-cover opacity-20" />
      </div>

    </section>
  );
};

export default HeroSection;
