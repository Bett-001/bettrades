import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="hero-glow top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
      <div className="hero-glow bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Premium Trading Signals</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Trade Smarter with{" "}
            <span className="gradient-text">BETTRADES</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Get real-time trading signals, proven strategies, and exclusive access to our VVIP community. 
            Start winning trades today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl" className="group">
                Activate Now – $10
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline_gold" size="xl">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>85%+ Win Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Secure & Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="hidden lg:block">
          <div className="absolute top-1/3 left-10 glass-card p-4 animate-float">
            <div className="text-2xl font-bold text-success">+127 pips</div>
            <div className="text-sm text-muted-foreground">Today's Profit</div>
          </div>
          <div className="absolute bottom-1/3 right-10 glass-card p-4 animate-float" style={{ animationDelay: '1s' }}>
            <div className="text-2xl font-bold text-primary">3,500+</div>
            <div className="text-sm text-muted-foreground">Active Traders</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
