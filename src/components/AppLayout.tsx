import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Bell, Sun, Moon } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  /** optional count for notification badge */
  notifCount?: number;
}

export default function AppLayout({ children, notifCount = 0 }: AppLayoutProps) {
  const { user, subscription, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) navigate("/auth");
    if (!isLoading && user && !subscription?.active) navigate("/payment");
  }, [user, subscription, isLoading, navigate]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />

      {/* ── Main ── */}
      <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 flex justify-end items-center gap-2 px-5 py-3 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center border border-border/60 hover:bg-foreground/5 transition-all">
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
          </button>
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-border/60 hover:bg-foreground/5 transition-all">
            <Bell className="w-4 h-4 text-muted-foreground" />
            {notifCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center bg-primary text-primary-foreground">{notifCount}</span>}
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 p-5 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
