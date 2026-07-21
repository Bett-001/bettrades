import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Signal, LineChart as LineChartIcon, MessageSquare,
  BookOpen, Calculator, BarChart2, Calendar, Gift, Settings as SettingsIcon,
  LogOut, Users, Trophy, Video, Menu, X as XIcon,
} from "lucide-react";

/** Canonical navigation — shared by every authenticated page. */
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",         href: "/dashboard" },
  { icon: Signal,          label: "Signals",           href: "/dashboard" },
  { icon: LineChartIcon,   label: "Strategies",        href: "/dashboard" },
  { icon: MessageSquare,   label: "Telegram",          href: "https://t.me/TonnyFxacademy", external: true },
  { icon: BookOpen,        label: "Trading Journal",   href: "/journal" },
  { icon: Calculator,      label: "Calculator",        href: "/calculator" },
  { icon: BarChart2,       label: "Performance",       href: "/performance" },
  { icon: Calendar,        label: "Economic Calendar", href: "/calendar" },
  { icon: Gift,            label: "Referral",          href: "/referral" },
  { icon: SettingsIcon,    label: "Settings",          href: "/settings" },
];

const extraProducts = [
  { icon: Users,    label: "1-on-1 Mentorship",       badge: "$150 / session", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Trophy,   label: "Prop Firm Prep",          badge: "$79 / month",    color: "text-amber-400",  bg: "bg-amber-500/10" },
  { icon: Video,    label: "Live Webinars",           badge: "Included",       color: "text-sky-400",    bg: "bg-sky-500/10" },
  { icon: BarChart2,label: "Market Analysis Reports",  badge: "Included",       color: "text-blue-400",   bg: "bg-blue-500/10" },
];

/**
 * The single source of truth for the app sidebar.
 * Renders a floating desktop rail + a mobile drawer with its own trigger.
 * Active state is derived from the current route — no props required.
 */
export default function Sidebar() {
  const { user, subscription, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.name
    ? user.name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Trader";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const avatarUrl = user?.avatarUrl ?? null;
  const nextBilling = subscription?.nextBilling
    ? new Date(subscription.nextBilling).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const isActive = (item: { href: string; external?: boolean }) =>
    !item.external && location.pathname === item.href;

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-5">
      <div>
        <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] px-2 mb-2">Navigation</p>
        <ul className="space-y-0.5">
          {navItems.map(item => {
            const active = isActive(item);
            const inner = (
              <>
                {active && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 shadow-sm shadow-primary/10" />}
                {!active && <div className="absolute inset-0 rounded-xl bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-200" />}
                <div className={`relative z-10 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${active ? "bg-primary/20 shadow-md shadow-primary/20" : "bg-foreground/5 group-hover:bg-foreground/10"}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span className="relative z-10 font-medium text-xs flex-1">{item.label}</span>
                {active && <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </>
            );
            const cls = `group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`;
            return (
              <li key={item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onNavigate}>{inner}</a>
                ) : (
                  <Link to={item.href} className={cls} onClick={onNavigate}>{inner}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] px-2 mb-2">Products &amp; Services</p>
        <ul className="space-y-0.5">
          {extraProducts.map(p => (
            <li key={p.label}>
              <button className="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-all relative">
                <div className="absolute inset-0 rounded-xl bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-200" />
                <div className={`relative z-10 w-7 h-7 rounded-lg ${p.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  <p.icon className={`w-3.5 h-3.5 ${p.color}`} />
                </div>
                <span className="relative z-10 font-medium text-xs flex-1 text-left truncate">{p.label}</span>
                <span className={`relative z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${p.badge === "Included" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25" : "bg-primary/10 text-primary border-primary/25"}`}>{p.badge}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );

  const Footer = () => (
    <div className="px-3 pb-4 pt-3 border-t border-border/50">
      <div className="flex items-center gap-2 px-2 mb-3">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Active Pro</span>
        {nextBilling && <span className="text-[9px] text-muted-foreground ml-auto">Renews {nextBilling}</span>}
      </div>
      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-foreground/5 border border-border/50 mb-2">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-primary/40 flex items-center justify-center shadow-lg shadow-primary/30">
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-primary-foreground font-black text-xs">{initials}</span>}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-xs truncate text-foreground">{displayName}</p>
          <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
      <button onClick={() => { signOut(); navigate("/"); }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/8 transition-all text-xs font-medium group">
        <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        Sign Out
      </button>
    </div>
  );

  const Logo = () => (
    <div className="px-5 py-4 border-b border-border/50">
      <Link to="/" className="flex items-center gap-2.5">
        <img src="/logo2.png.png" alt="MQTRADE PRO" className="h-9 w-auto drop-shadow-sm" />
        <div>
          <span className="font-display font-bold text-sm text-foreground tracking-wide leading-none block">MQTRADE</span>
          <span className="text-[10px] font-semibold text-primary tracking-widest">PRO</span>
        </div>
      </Link>
    </div>
  );

  const shell = "rounded-3xl flex flex-col overflow-hidden bg-card/80 dark:bg-card/50 backdrop-blur-2xl border border-border/60 dark:border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]";

  return (
    <>
      {/* ── Desktop floating rail ── */}
      <div className="relative z-20 p-3 flex-shrink-0 hidden md:block">
        <aside className={`w-60 h-[calc(100vh-1.5rem)] sticky top-3 relative ${shell}`}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-20 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
          <Logo />
          <NavList />
          <Footer />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </aside>
      </div>

      {/* ── Mobile trigger ── */}
      <button onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl flex items-center justify-center bg-card/80 backdrop-blur-xl border border-border/60 text-foreground shadow-lg">
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className={`relative w-64 h-full ${shell} rounded-none`}>
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5">
              <XIcon className="w-5 h-5" />
            </button>
            <Logo />
            <NavList onNavigate={() => setMobileOpen(false)} />
            <Footer />
          </aside>
        </div>
      )}
    </>
  );
}
