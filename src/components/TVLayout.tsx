import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Layers, User, LogOut, Menu, X as XIcon, ExternalLink } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",             href: "/tv-dashboard" },
  { icon: Layers,          label: "Strategies & Indicators", href: "/indicators" },
  { icon: User,            label: "My Account",            href: "/tv-account" },
];

export default function TVLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = (user as any)?.name
    ? (user as any).name.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Trader";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const isActive = (href: string) => location.pathname === href;

  const Sidebar = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-violet-500/20">
        <Link to="/tv-dashboard" className="flex items-center gap-3" onClick={onNav}>
          <img src="/tv-banner.png" alt="TradingView" className="h-8 w-auto object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-none">TV Strategies</p>
            <p className="text-violet-400 text-[10px] font-semibold tracking-widest uppercase">by MQTRADE</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-black text-violet-400/50 uppercase tracking-[0.2em] px-2 mb-3">Menu</p>
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group
                ${active
                  ? "bg-violet-600/25 border border-violet-500/40 text-violet-300"
                  : "text-violet-200/60 hover:text-violet-200 hover:bg-violet-500/10"}`}
            >
              {active && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/20 to-violet-400/5" />}
              <div className={`relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                ${active ? "bg-violet-500/30" : "bg-violet-500/10 group-hover:bg-violet-500/20"}`}>
                <item.icon className="w-3.5 h-3.5" />
              </div>
              <span className="relative z-10 text-xs font-medium">{item.label}</span>
              {active && <div className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="text-[9px] font-black text-violet-400/50 uppercase tracking-[0.2em] px-2 mb-3">TradingView</p>
          <a
            href="https://www.tradingview.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-violet-200/60 hover:text-violet-200 hover:bg-violet-500/10 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium">Open TradingView</span>
          </a>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-violet-500/20">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center shadow-lg shrink-0">
            <span className="text-white font-black text-xs">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs truncate text-white">{displayName}</p>
            <p className="text-[10px] text-violet-400/70 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { signOut(); navigate("/"); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-violet-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-medium group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );

  const shell = "flex flex-col bg-[#0d0d1a] border border-violet-500/20 shadow-[0_8px_40px_rgba(139,92,246,0.15)]";

  return (
    <div className="min-h-screen bg-[#08080f] flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-60 shrink-0 p-3">
        <aside className={`w-full h-[calc(100vh-1.5rem)] sticky top-3 rounded-3xl overflow-hidden ${shell}`}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
          <Sidebar />
        </aside>
      </div>

      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl flex items-center justify-center bg-[#0d0d1a] border border-violet-500/30 text-violet-300 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className={`relative w-64 h-full rounded-none ${shell}`}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center text-violet-400 hover:text-white hover:bg-violet-500/10"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <Sidebar onNav={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
