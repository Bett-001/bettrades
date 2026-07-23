import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Radio } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useLiveWebinar } from "@/hooks/use-live-webinar";

interface ProductLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for the add-on product dashboards (Mentorship, Prop Firm, Webinars,
 * Reports). Same MQTRADE shell as AppLayout but only requires the user to be
 * logged in — access to each paid product is gated separately (ProductGate),
 * NOT by the main subscription.
 */
export default function ProductLayout({ children }: ProductLayoutProps) {
  const { user, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { live } = useLiveWebinar();

  useEffect(() => {
    if (!isLoading && !user) navigate("/auth");
  }, [user, isLoading, navigate]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* Global LIVE banner — appears the moment admin goes live */}
        {live && (
          <Link
            to="/webinars"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-colors"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="uppercase tracking-wide">Live now</span>
            <span className="font-normal hidden sm:inline">· {live.title} — join the webinar</span>
            <span className="ml-1 underline">Watch →</span>
          </Link>
        )}

        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 flex justify-end items-center gap-2 px-5 py-3 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center border border-border/60 hover:bg-foreground/5 transition-all">
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>

        <div className="flex-1 p-5 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
