import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

const features = [
  "All trading signals (Forex, Indices, Crypto)",
  "TradingView indicators & strategies",
  "NinjaTrader NT8 tools",
  "VVIP Telegram channel access",
  "Push notifications for new signals",
  "Strategy library & educational content",
  "Lifetime access (one-time payment)"
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Simple{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One payment. Lifetime access. No hidden fees.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 gradient-gold" />
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Best Value</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold">$10</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <p className="text-muted-foreground mt-2">Lifetime access to everything</p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="lg" className="w-full">
                Activate Now
              </Button>
            </Link>

            {/* Trust Note */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Secure payment • Instant access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
