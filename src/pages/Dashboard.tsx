import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  LayoutDashboard, 
  Signal, 
  LineChart, 
  MessageSquare, 
  Settings,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Bell
} from "lucide-react";

const mockSignals = [
  {
    id: 1,
    asset: "EUR/USD",
    type: "BUY",
    entry: "1.0850",
    sl: "1.0820",
    tp: ["1.0880", "1.0910", "1.0940"],
    status: "active",
    timeframe: "H4",
    timestamp: "2h ago"
  },
  {
    id: 2,
    asset: "NAS100",
    type: "SELL",
    entry: "18,450",
    sl: "18,520",
    tp: ["18,380", "18,300"],
    status: "tp_hit",
    timeframe: "H1",
    timestamp: "5h ago"
  },
  {
    id: 3,
    asset: "XAU/USD",
    type: "BUY",
    entry: "2,035",
    sl: "2,020",
    tp: ["2,050", "2,065", "2,080"],
    status: "active",
    timeframe: "H4",
    timestamp: "8h ago"
  },
  {
    id: 4,
    asset: "GBP/JPY",
    type: "SELL",
    entry: "188.50",
    sl: "189.00",
    tp: ["187.80", "187.20"],
    status: "sl_hit",
    timeframe: "M30",
    timestamp: "1d ago"
  }
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Signal, label: "Signals" },
  { icon: LineChart, label: "Strategies" },
  { icon: MessageSquare, label: "Telegram" },
  { icon: Settings, label: "Settings" },
];

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredSignals = mockSignals.filter(signal => {
    if (activeFilter === "all") return true;
    return signal.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">BETTRADES</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    item.active 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">JD</span>
            </div>
            <div>
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">Active Member</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, trader</p>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <p className="text-muted-foreground text-sm mb-1">Active Signals</p>
              <p className="font-display text-2xl font-bold">12</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-muted-foreground text-sm mb-1">This Week's Win Rate</p>
              <p className="font-display text-2xl font-bold text-success">87%</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-muted-foreground text-sm mb-1">Total Pips</p>
              <p className="font-display text-2xl font-bold text-primary">+428</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-muted-foreground text-sm mb-1">Total Signals</p>
              <p className="font-display text-2xl font-bold">156</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            <a 
              href="#" 
              className="glass-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <LineChart className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">TradingView</p>
                <p className="text-sm text-muted-foreground">View Indicators</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
            <a 
              href="#" 
              className="glass-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">NinjaTrader</p>
                <p className="text-sm text-muted-foreground">NT8 Strategies</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
            <a 
              href="#" 
              className="glass-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">VVIP Telegram</p>
                <p className="text-sm text-muted-foreground">Join Channel</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>

          {/* Signals Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Latest Signals</h2>
              <div className="flex gap-2">
                {["all", "active", "tp_hit", "sl_hit"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter === "all" ? "All" : filter === "active" ? "Active" : filter === "tp_hit" ? "TP Hit" : "SL Hit"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredSignals.map((signal) => (
                <div key={signal.id} className="signal-card">
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
                        <div className="text-xs text-muted-foreground">{signal.timeframe} • {signal.timestamp}</div>
                      </div>
                    </div>
                    <span className={`status-badge ${
                      signal.status === "active" 
                        ? "status-active" 
                        : signal.status === "tp_hit" 
                          ? "status-tp" 
                          : "status-sl"
                    }`}>
                      {signal.status === "active" ? "Active" : signal.status === "tp_hit" ? "TP Hit" : "SL Hit"}
                    </span>
                  </div>

                  <div className={`inline-block px-3 py-1 rounded text-sm font-bold mb-4 ${
                    signal.type === "BUY" 
                      ? "bg-success/20 text-success" 
                      : "bg-destructive/20 text-destructive"
                  }`}>
                    {signal.type}
                  </div>

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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
