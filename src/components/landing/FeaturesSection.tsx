import { TrendingUp, LineChart, MessageSquare, BookOpen, Bell, Shield } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time Signals",
    description: "Get instant buy/sell signals with entry, stop loss, and take profit levels for Forex, Indices, and Crypto."
  },
  {
    icon: LineChart,
    title: "TradingView Indicators",
    description: "Access our custom Pine Script indicators designed to identify high-probability setups."
  },
  {
    icon: BookOpen,
    title: "NinjaTrader Strategies",
    description: "Professional NT8 indicators and automated strategies for serious traders."
  },
  {
    icon: MessageSquare,
    title: "VVIP Telegram Access",
    description: "Join our exclusive community for live discussions, market analysis, and premium content."
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Never miss a trade. Get push notifications the moment a new signal is posted."
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Every signal includes clear risk parameters to protect your capital."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Win</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One platform, complete access to premium trading resources and live signals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
