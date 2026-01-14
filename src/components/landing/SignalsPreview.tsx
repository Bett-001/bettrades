import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const mockSignals = [
  {
    id: 1,
    asset: "EUR/USD",
    type: "BUY",
    entry: "1.0850",
    sl: "1.0820",
    tp: ["1.0880", "1.0910", "1.0940"],
    status: "active",
    timeframe: "H4"
  },
  {
    id: 2,
    asset: "NAS100",
    type: "SELL",
    entry: "18,450",
    sl: "18,520",
    tp: ["18,380", "18,300"],
    status: "tp_hit",
    timeframe: "H1"
  },
  {
    id: 3,
    asset: "XAU/USD",
    type: "BUY",
    entry: "2,035",
    sl: "2,020",
    tp: ["2,050", "2,065", "2,080"],
    status: "active",
    timeframe: "H4"
  }
];

const SignalsPreview = () => {
  return (
    <section id="signals" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Live Trading{" "}
            <span className="gradient-text">Signals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real signals, real results. Here's a preview of what our members receive.
          </p>
        </div>

        {/* Signals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {mockSignals.map((signal) => (
            <div key={signal.id} className="signal-card">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    signal.type === "BUY" ? "bg-success/20" : "bg-destructive/20"
                  }`}>
                    {signal.type === "BUY" ? (
                      <ArrowUpRight className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="font-display font-semibold">{signal.asset}</div>
                    <div className="text-xs text-muted-foreground">{signal.timeframe}</div>
                  </div>
                </div>
                <span className={`status-badge ${
                  signal.status === "active" ? "status-active" : "status-tp"
                }`}>
                  {signal.status === "active" ? "Active" : "TP Hit"}
                </span>
              </div>

              {/* Signal Type */}
              <div className={`inline-block px-3 py-1 rounded text-sm font-bold mb-4 ${
                signal.type === "BUY" 
                  ? "bg-success/20 text-success" 
                  : "bg-destructive/20 text-destructive"
              }`}>
                {signal.type}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entry</span>
                  <span className="font-medium">{signal.entry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stop Loss</span>
                  <span className="font-medium text-destructive">{signal.sl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Take Profit</span>
                  <span className="font-medium text-success">{signal.tp.join(" / ")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blur Overlay for non-members */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Want full access to all signals? <span className="text-primary font-medium">Activate your account</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignalsPreview;
