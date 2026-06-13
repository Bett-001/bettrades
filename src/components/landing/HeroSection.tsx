import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap, Star, Users, BarChart2 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">

      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg.png')" }} />
      <div className="absolute inset-0 bg-background/80 dark:bg-background/85" />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.5) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-primary font-semibold">Live Signals Active · 3,500+ Members</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 animate-slide-up leading-[1.05]">
            Trade Smarter,{" "}
            <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Win More
            </span>
            <br />
            <span className="text-foreground">with MQTRADE PRO</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            Real-time signals. TradingView & NinjaTrader tools. VVIP Telegram.
            Mentorship. Everything a serious trader needs — in one subscription.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl" className="group text-base px-8 py-4 h-auto shadow-2xl shadow-primary/25">
                Start Trading Now — $50/mo
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="outline_gold" size="xl" className="text-base px-8 py-4 h-auto">
                See All Services
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {[
              { icon: TrendingUp, text: "85%+ Win Rate" },
              { icon: Users, text: "3,500+ Active Traders" },
              { icon: Shield, text: "Risk-Managed Signals" },
              { icon: Zap, text: "Instant Delivery" },
              { icon: Star, text: "VVIP Community" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="hidden lg:block">
          <div className="absolute top-1/3 left-8 glass-card px-5 py-4 animate-float shadow-xl border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xl font-black text-emerald-400">+127 pips</div>
                <div className="text-xs text-muted-foreground">EUR/USD today</div>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 right-8 glass-card px-5 py-4 animate-float shadow-xl border-primary/20" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xl font-black text-primary">3,500+</div>
                <div className="text-xs text-muted-foreground">Active members</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-1/3 left-16 glass-card px-5 py-4 animate-float shadow-xl border-primary/20" style={{ animationDelay: "2s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-black text-blue-400">85%</div>
                <div className="text-xs text-muted-foreground">Win rate MTD</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
