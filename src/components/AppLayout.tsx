import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard, TrendingUp, LineChart, Send, BookOpen,
  Calendar, Settings, LogOut, Menu, X, Calculator, BarChart2,
  Gift, Bell, Sun, Moon, Camera, Upload, Check,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/dashboard" },
  { icon: TrendingUp,      label: "Signals",           href: "/dashboard" },
  { icon: LineChart,       label: "Strategies",        href: "/dashboard" },
  { icon: Send,            label: "Telegram",          href: "https://t.me/TonnyFxacademy" },
  { icon: BookOpen,        label: "Trading Journal",   href: "/journal" },
  { icon: Calculator,      label: "Calculator",        href: "/calculator" },
  { icon: BarChart2,       label: "Performance",       href: "/performance" },
  { icon: Calendar,        label: "Economic Calendar", href: "/calendar" },
  { icon: Gift,            label: "Referral Program",  href: "/referral" },
  { icon: Settings,        label: "Settings",          href: "/settings" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  /** optional count for notification badge */
  notifCount?: number;
}

export default function AppLayout({ children, notifCount = 0 }: AppLayoutProps) {
  const { user, subscription, isLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed]               = useState(true);
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [avatarUrl, setAvatarUrl]               = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarPreview, setAvatarPreview]       = useState<string | null>(null);
  const [avatarFile, setAvatarFile]             = useState<File | null>(null);
  const [uploading, setUploading]               = useState(false);
  const [uploadDone, setUploadDone]             = useState(false);
  const fileRef                                 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) navigate("/auth");
    if (!isLoading && user && !subscription?.active) navigate("/payment");
  }, [user, subscription, isLoading, navigate]);

  useEffect(() => {
    if (user) setAvatarUrl((user as any).user_metadata?.avatar_url ?? null);
  }, [user]);

  const displayName = user?.name
    ? user.name.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Trader";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
    setUploadDone(false);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return;
    setUploading(true);
    const ext = avatarFile.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
      setAvatarUrl(data.publicUrl);
      setUploadDone(true);
      setTimeout(() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); setUploadDone(false); }, 1400);
    }
    setUploading(false);
  };

  const Avatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const sz = size === "lg" ? "w-28 h-28 text-3xl" : size === "sm" ? "w-7 h-7 text-[10px]" : "w-10 h-10 text-xs";
    const radius = size === "lg" ? "rounded-3xl" : "rounded-full";
    return (
      <div className={`${sz} ${radius} overflow-hidden flex-shrink-0`}>
        {avatarUrl
          ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center font-black" style={{ background: "linear-gradient(135deg,#00dce5,#006c71)", color: "#003739" }}>{initials}</div>
        }
      </div>
    );
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
      <div className="w-8 h-8 border-2 border-[#00dce5]/30 border-t-[#00dce5] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex relative overflow-x-hidden" style={{ background: "#0d1117", color: "#dfe2eb" }}>

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(0,220,229,0.05)" }} />
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(111,251,190,0.04)" }} />
      </div>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden sticky top-0 w-full z-50 flex justify-between items-center px-5 py-3 border-b border-white/5"
        style={{ background: "rgba(16,20,26,0.92)", backdropFilter: "blur(20px)" }}>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-full hover:bg-white/5 text-[#00dce5]">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-['Sora'] font-bold text-[#00dce5] tracking-tight">MQTRADE PRO</span>
        <button onClick={() => setShowProfileModal(true)} className="p-1">
          <Avatar size="sm" />
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="relative w-64 h-full flex flex-col py-6 px-3 border-r border-white/10 overflow-y-auto" style={{ background: "#262a31" }}>
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="flex items-center gap-3">
                <Avatar />
                <div>
                  <p className="font-bold text-sm text-[#dfe2eb]">{displayName}</p>
                  <p className="text-[10px] text-[#6ffbbe] font-['JetBrains_Mono']">Pro Member</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-[#b9caca]"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              {navItems.map(item => {
                const active = location.pathname === item.href;
                return (
                  <Link key={item.label} to={item.href} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-l-2 text-[13px] font-['JetBrains_Mono'] transition-all ${active ? "border-[#00dce5] bg-[#31353c] text-[#00dce5]" : "border-transparent text-[#b9caca] hover:text-[#dfe2eb] hover:bg-white/5"}`}>
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <button onClick={() => { signOut(); navigate("/"); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#b9caca] hover:text-red-400 hover:bg-red-500/8 transition-all text-[13px] font-['JetBrains_Mono'] mt-2">
              <LogOut className="w-4 h-4" /><span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* ── Desktop collapsing sidebar ── */}
      <nav
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className="hidden md:flex flex-col fixed left-4 z-40 py-5 px-3 rounded-2xl border border-white/5 shadow-2xl transition-all duration-300 overflow-hidden overflow-y-auto scrollbar-hide"
        style={{ background: "#262a31", top: "1.5rem", bottom: "1.5rem", width: collapsed ? "4.5rem" : "16rem" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(0,220,229,0.3),transparent)" }} />

        {/* Profile */}
        <button onClick={() => setShowProfileModal(true)} className="mb-6 px-1 flex items-center overflow-hidden group/prof" style={{ minHeight: "3rem" }}>
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#00dce5]/30 group-hover/prof:ring-[#00dce5]/60 transition-all">
            {avatarUrl ? <img src={avatarUrl} alt="av" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-xs font-black" style={{ background: "linear-gradient(135deg,#00dce5,#006c71)", color: "#003739" }}>{initials}</div>}
          </div>
          <div className={`ml-3 text-left transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
            <p className="font-bold text-sm text-[#dfe2eb]">{displayName}</p>
            <p className="text-[10px] text-[#6ffbbe] font-['JetBrains_Mono']">Pro Member</p>
          </div>
        </button>

        {/* Nav */}
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.label} to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-xl border-l-2 transition-all duration-200 ${active ? "border-[#00dce5] bg-[#31353c] text-[#00dce5]" : "border-transparent text-[#b9caca] hover:text-[#dfe2eb] hover:bg-white/5"}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 text-[13px] font-['JetBrains_Mono'] whitespace-nowrap transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Subscription pill */}
        {!collapsed && (
          <div className="mx-1 my-3 px-3 py-2 rounded-xl border border-[#00dce5]/20" style={{ background: "rgba(0,220,229,0.05)" }}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-pulse" />
              <span className="text-[10px] font-['JetBrains_Mono'] text-[#6ffbbe]">Active Pro</span>
            </div>
          </div>
        )}

        {/* Sign out */}
        <button onClick={() => { signOut(); navigate("/"); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#b9caca] hover:text-red-400 hover:bg-red-500/8 transition-all">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className={`text-[13px] font-['JetBrains_Mono'] whitespace-nowrap transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
            Sign Out
          </span>
        </button>
      </nav>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 min-h-screen flex flex-col md:ml-[5.5rem]">

        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 flex justify-between items-center px-5 py-3 border-b border-white/5"
          style={{ background: "rgba(13,17,23,0.92)", backdropFilter: "blur(16px)" }}>
          <div />
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/5 transition-all">
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#b9caca]" />}
            </button>
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/5 transition-all">
              <Bell className="w-4 h-4 text-[#b9caca]" />
              {notifCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: "#00dce5", color: "#003739" }}>{notifCount}</span>}
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-5 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[88%] max-w-sm z-40 flex justify-around items-center py-2.5 px-4 rounded-full border border-white/10"
        style={{ background: "rgba(38,42,49,0.95)", backdropFilter: "blur(20px)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
        {[
          { icon: LayoutDashboard, href: "/dashboard" },
          { icon: BarChart2,       href: "/performance" },
          { icon: Calculator,      href: "/calculator" },
          { icon: Bell,            href: "/dashboard" },
          { icon: Settings,        href: "/settings" },
        ].map(({ icon: Icon, href }, i) => {
          const active = location.pathname === href;
          return (
            <Link key={i} to={href} className="p-3 rounded-full transition-all"
              style={active ? { background: "#00f5ff", color: "#003739", boxShadow: "0 0 16px rgba(0,245,255,0.4)" } : { color: "#b9caca" }}>
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>

      {/* ── Profile Modal ── */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); }} />
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: "#1c2026" }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(0,220,229,0.5),transparent)" }} />
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h2 className="font-['Sora'] font-semibold text-base text-[#dfe2eb]">Profile Picture</h2>
                <p className="text-[11px] text-[#b9caca] font-['JetBrains_Mono']">Update your avatar</p>
              </div>
              <button onClick={() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 hover:bg-red-500/10 hover:text-red-400 transition-all text-[#b9caca]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-5">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-[#00dce5]/20">
                  {avatarPreview ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                    : avatarUrl ? <img src={avatarUrl} alt="current" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl font-black" style={{ background: "linear-gradient(135deg,#00dce5,#006c71)", color: "#003739" }}>{initials}</div>
                  }
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center border-2 border-[#1c2026]"
                  style={{ background: "#00dce5", color: "#003739" }}>
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#00dce5]/50 hover:bg-[#00dce5]/5 transition-all">
                <Upload className="w-4 h-4 text-[#b9caca]" />
                <span className="text-sm text-[#b9caca] font-['Geist']">{avatarPreview ? "Change photo" : "Choose a photo"}</span>
              </button>
              <div className="flex gap-3 w-full">
                <button onClick={() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-[#b9caca] hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={uploadAvatar} disabled={!avatarFile || uploading || uploadDone}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: "#00dce5", color: "#003739" }}>
                  {uploadDone ? <><Check className="w-4 h-4" /> Saved!</>
                    : uploading ? <><div className="w-4 h-4 border-2 border-[#003739]/30 border-t-[#003739] rounded-full animate-spin" /> Saving…</>
                    : <><Upload className="w-4 h-4" /> Save Photo</>}
                </button>
              </div>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        </div>
      )}
    </div>
  );
}
