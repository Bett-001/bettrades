import { useState, useEffect } from "react";
import ProductLayout from "@/components/ProductLayout";
import { supabase } from "@/lib/supabase";
import { MQTRADE_YOUTUBE, youTubeEmbed, youTubeThumb } from "@/lib/constants";
import { Video, Radio, Youtube, Bell, BellRing, Play, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Webinar {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  is_live: boolean;
  published_at: string;
}

export default function Webinars() {
  const [items, setItems] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("webinars")
      .select("*")
      .order("published_at", { ascending: false });
    if (data) setItems(data as Webinar[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("webinars-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "webinars" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Browser notification opt-in (fires while the app is open and a session goes live)
  const enableNotify = async () => {
    if (!("Notification" in window)) {
      toast.error("Your browser doesn't support notifications");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotify(true);
      toast.success("You'll be notified when we go live");
    } else {
      toast.error("Notifications blocked — enable them in your browser settings");
    }
  };

  const live = items.find(w => w.is_live) ?? null;
  const recorded = items.filter(w => !w.is_live);

  // Fire a browser notification when a live session appears
  useEffect(() => {
    if (notify && live && "Notification" in window && Notification.permission === "granted") {
      new Notification("🔴 MQTRADE PRO is LIVE", { body: live.title });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.id]);

  return (
    <ProductLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">Live &amp; On-Demand</p>
            <h1 className="font-display text-3xl font-black">Webinars</h1>
            <p className="text-muted-foreground mt-1">Live trading sessions, market breakdowns and educational replays.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={enableNotify}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                notify
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                  : "bg-secondary border-border hover:bg-foreground/5"
              }`}
            >
              {notify ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              {notify ? "Alerts on" : "Notify me live"}
            </button>
            <a
              href={MQTRADE_YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors"
            >
              <Youtube className="w-4 h-4" /> Subscribe
            </a>
          </div>
        </div>

        {/* Live now */}
        {live && (
          <div className="rounded-2xl border-2 border-red-500/40 overflow-hidden shadow-xl shadow-red-500/10">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-wide">Live Now</span>
              <span className="text-sm font-normal truncate">· {live.title}</span>
            </div>
            <div className="aspect-video bg-black">
              {youTubeEmbed(live.youtube_url) ? (
                <iframe
                  src={youTubeEmbed(live.youtube_url) + "?autoplay=0"}
                  title={live.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a href={live.youtube_url} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center text-white gap-2">
                  <Play className="w-6 h-6" /> Watch on YouTube
                </a>
              )}
            </div>
            {live.description && <p className="p-4 text-sm text-muted-foreground">{live.description}</p>}
          </div>
        )}

        {/* Recorded videos */}
        <div>
          <p className="font-display font-bold text-lg mb-4">
            {live ? "Past Sessions" : "Replays & Sessions"}
          </p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-56 rounded-2xl bg-secondary/50 animate-pulse" />)}
            </div>
          ) : recorded.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Video className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-1">No webinars posted yet.</p>
              <p className="text-sm text-muted-foreground">Subscribe on YouTube so you don't miss the next live session.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recorded.map(w => {
                const embed = youTubeEmbed(w.youtube_url);
                const thumb = youTubeThumb(w.youtube_url);
                return (
                  <div key={w.id} className="glass-card overflow-hidden flex flex-col group">
                    <a href={w.youtube_url} target="_blank" rel="noopener noreferrer" className="block aspect-video bg-black relative overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Video className="w-10 h-10 text-muted-foreground/40" /></div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    </a>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-semibold text-sm mb-1 line-clamp-2">{w.title}</p>
                      {w.description && <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{w.description}</p>}
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-3">
                        <Calendar className="w-3 h-3" />
                        {new Date(w.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProductLayout>
  );
}
