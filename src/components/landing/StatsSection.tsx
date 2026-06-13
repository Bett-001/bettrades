import { TrendingUp, Users, Signal, BarChart2 } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "85%+",   label: "Win Rate MTD",       color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Users,      value: "3,500+", label: "Active Traders",     color: "text-primary",     bg: "bg-primary/10",     border: "border-primary/20" },
  { icon: Signal,     value: "2,800+", label: "Signals Delivered",  color: "text-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
  { icon: BarChart2,  value: "12,400", label: "Pips This Month",    color: "text-violet-500",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
];

const StatsSection = () => (
  <section className="py-10 relative z-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, value, label, color, bg, border }) => (
          <div key={label} className={`glass-card px-6 py-5 flex items-center gap-4 border ${border} hover:scale-[1.02] transition-transform duration-300`}>
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <div className={`font-display text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground font-medium">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
