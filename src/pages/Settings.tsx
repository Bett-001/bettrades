import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard, Signal, LineChart, MessageSquare,
  Settings as SettingsIcon, LogOut, Bell, User, Shield, CreditCard,
  Sliders, ChevronRight, Check, Users, Trophy, BookOpen, Video, BarChart2, Calendar,
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Signal, label: "Signals", href: "/dashboard" },
  { icon: LineChart, label: "Strategies", href: "/dashboard" },
  { icon: MessageSquare, label: "Telegram", href: "https://t.me/TonnyFxacademy" },
  { icon: BookOpen, label: "Trading Journal", href: "/journal" },
  { icon: SettingsIcon, label: "Settings", href: "/settings", active: true },
];

const extraProducts = [
  { icon: Users, label: "1-on-1 Mentorship", badge: "$150 / session", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Trophy, label: "Prop Firm Prep", badge: "$79 / month", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: BookOpen, label: "Trading Journal", badge: "Included", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Video, label: "Live Webinars", badge: "Included", color: "text-sky-400", bg: "bg-sky-500/10" },
  { icon: BarChart2, label: "Market Analysis Reports", badge: "Included", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Calendar, label: "Economic Calendar", badge: "Coming Soon", color: "text-rose-400", bg: "bg-rose-500/10" },
];

type Tab = "profile" | "notifications" | "trading" | "subscription" | "security";

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
      checked ? "bg-primary" : "bg-secondary"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const Settings = () => {
  const { user, subscription, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const displayName = user?.name
    ? user.name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Trader";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const nextBilling = subscription?.nextBilling
    ? new Date(subscription.nextBilling).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  // Profile state
  const [displayNameEdit, setDisplayNameEdit] = useState(displayName);

  // Notification toggles
  const [notifs, setNotifs] = useState({
    emailSignals: true,
    pushSignals: true,
    telegramBot: true,
    weeklyReport: true,
    marketNews: false,
    slTpAlerts: true,
  });

  // Trading preferences
  const [markets, setMarkets] = useState({ forex: true, indices: true, crypto: false, commodities: true });
  const [risk, setRisk] = useState<"low" | "medium" | "high">("medium");
  const [timeframe, setTimeframe] = useState("H4");
  const [currency, setCurrency] = useState("USD");

  // Security
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  const handleSignOut = () => { signOut(); navigate("/"); };

  const save = (msg: string) => toast.success(msg);

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "trading", label: "Trading Preferences", icon: Sliders },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background flex gap-0">

      <Sidebar />

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border p-4">
          <h1 className="font-display text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
        </header>

        <div className="p-6 flex gap-6">
          {/* Tab nav */}
          <aside className="w-52 shrink-0">
            <ul className="space-y-1">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Tab content */}
          <div className="flex-1 max-w-2xl">

            {/* PROFILE */}
            {activeTab === "profile" && (
              <div className="glass-card p-6 space-y-6">
                <h2 className="font-display text-lg font-semibold">Profile Information</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">{initials}</span>
                  </div>
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-primary mt-1">Active Subscriber</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input value={displayNameEdit} onChange={e => setDisplayNameEdit(e.target.value)} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={user?.email ?? ""} disabled className="bg-secondary border-border opacity-60" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Currency</Label>
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
                    >
                      {["USD", "EUR", "GBP", "KES", "AUD", "CAD"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button variant="hero" onClick={() => save("Profile updated successfully")}>Save Changes</Button>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="glass-card p-6 space-y-6">
                <h2 className="font-display text-lg font-semibold">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: "emailSignals", label: "Email Signal Alerts", desc: "Receive new signals directly to your email" },
                    { key: "pushSignals", label: "Push Notifications", desc: "Browser push alerts for new signals" },
                    { key: "telegramBot", label: "Telegram Bot Alerts", desc: "Get signals via our dedicated Telegram bot" },
                    { key: "slTpAlerts", label: "SL / TP Hit Alerts", desc: "Notify when stop loss or take profit is reached" },
                    { key: "weeklyReport", label: "Weekly Performance Report", desc: "Summary of signals and win rate every Monday" },
                    { key: "marketNews", label: "Market News & Events", desc: "Economic calendar and high-impact news alerts" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle
                        checked={notifs[item.key as keyof typeof notifs]}
                        onChange={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof notifs] }))}
                      />
                    </div>
                  ))}
                </div>
                <Button variant="hero" onClick={() => save("Notification preferences saved")}>Save Changes</Button>
              </div>
            )}

            {/* TRADING PREFERENCES */}
            {activeTab === "trading" && (
              <div className="glass-card p-6 space-y-6">
                <h2 className="font-display text-lg font-semibold">Trading Preferences</h2>

                <div className="space-y-3">
                  <Label>Preferred Markets</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(markets) as Array<keyof typeof markets>).map(m => (
                      <button
                        key={m}
                        onClick={() => setMarkets(prev => ({ ...prev, [m]: !prev[m] }))}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          markets[m]
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        {markets[m] && <Check className="w-3.5 h-3.5" />}
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Risk Tolerance</Label>
                  <div className="flex gap-3">
                    {(["low", "medium", "high"] as const).map(r => (
                      <button
                        key={r}
                        onClick={() => setRisk(r)}
                        className={`flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                          risk === r
                            ? r === "low" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : r === "medium" ? "border-amber-500 bg-amber-500/10 text-amber-400"
                            : "border-red-500 bg-red-500/10 text-red-400"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {risk === "low" ? "Conservative setups with tighter risk â€” 0.5â€“1% per trade."
                      : risk === "medium" ? "Balanced risk/reward â€” 1â€“2% per trade."
                      : "Aggressive setups with higher potential returns â€” 2â€“3% per trade."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Timeframe</Label>
                  <div className="flex flex-wrap gap-2">
                    {["M15", "M30", "H1", "H4", "D1"].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-4 py-1.5 rounded-lg border text-sm font-mono transition-all ${
                          timeframe === tf
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <Button variant="hero" onClick={() => save("Trading preferences saved")}>Save Changes</Button>
              </div>
            )}

            {/* SUBSCRIPTION */}
            {activeTab === "subscription" && (
              <div className="space-y-4">
                <div className="glass-card p-6 space-y-4">
                  <h2 className="font-display text-lg font-semibold">Current Plan</h2>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div>
                      <p className="font-semibold text-primary">Pro Monthly</p>
                      <p className="text-sm text-muted-foreground">Full access to all signals and features</p>
                    </div>
                    <span className="font-display text-2xl font-bold">$50<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Status</span>
                      <span className="text-emerald-400 font-medium">Active</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Payment Method</span>
                      <span className="text-foreground capitalize">{subscription?.method ?? "Card"}</span>
                    </div>
                    {nextBilling && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Next Billing Date</span>
                        <span className="text-foreground">{nextBilling}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="glass-card p-6 space-y-3">
                  <h3 className="font-medium text-sm">Update Payment Method</h3>
                  <Button variant="outline" className="w-full justify-start gap-2 border-border" onClick={() => navigate("/payment")}>
                    <CreditCard className="w-4 h-4" />
                    Change Card or Switch to M-Pesa
                  </Button>
                </div>
                <div className="glass-card p-6 border-red-500/20">
                  <h3 className="font-medium text-sm text-red-400 mb-2">Cancel Subscription</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    You will lose access at the end of your current billing period. This action cannot be undone.
                  </p>
                  <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                    onClick={() => toast.error("Contact support to cancel your subscription.")}>
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <div className="space-y-4">
                <div className="glass-card p-6 space-y-4">
                  <h2 className="font-display text-lg font-semibold">Change Password</h2>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="bg-secondary border-border" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="bg-secondary border-border" placeholder="At least 8 characters" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="bg-secondary border-border" placeholder="Repeat new password" />
                    </div>
                  </div>
                  <Button variant="hero" onClick={() => {
                    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return; }
                    if (newPw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
                    save("Password updated successfully");
                    setCurrentPw(""); setNewPw(""); setConfirmPw("");
                  }}>
                    Update Password
                  </Button>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <Toggle checked={twoFA} onChange={() => { setTwoFA(!twoFA); save(twoFA ? "2FA disabled" : "2FA enabled"); }} />
                  </div>
                </div>
                <div className="glass-card p-6">
                  <h3 className="font-medium mb-1">Active Sessions</h3>
                  <p className="text-xs text-muted-foreground mb-3">Devices currently signed in to your account</p>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary text-sm">
                    <div>
                      <p className="font-medium">This device</p>
                      <p className="text-xs text-muted-foreground">Windows Â· Chrome Â· Just now</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium">Current</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

