import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

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
              Get Premium Signals Today
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

      {/* ── RIGHT — photo side ───────────────────────────────────── */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-[52%]">
        <img
          src="/hero-bg.jpg.png"
          alt="MQTRADE PRO trader"
          className="w-full h-full object-cover object-center"
        />
        {/* Left-side fade so text blends into photo */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent" />
      </div>

      {/* Mobile background (small screens) */}
      <div className="absolute inset-0 md:hidden -z-10">
        <img src="/hero-bg.jpg.png" alt="" className="w-full h-full object-cover opacity-20" />
      </div>

    </section>
  );
};

export default HeroSection;
