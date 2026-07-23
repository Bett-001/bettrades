import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Clock, CheckCircle, X, ArrowRight } from "lucide-react";
import { PRODUCTS, type ProductKey } from "@/lib/constants";

interface ProductGateProps {
  product: ProductKey;
  /** Marketing bullets shown on the locked screen. */
  highlights: string[];
  tagline: string;
  accent?: string; // tailwind text color e.g. "text-violet-400"
  children: React.ReactNode;
}

type Status = "loading" | "none" | "pending" | "granted";

/**
 * Gates a paid product dashboard behind a per-product access record.
 * Access is independent of the main MQTRADE PRO subscription — a user must
 * request access here and be granted it by an admin.
 */
export default function ProductGate({ product, highlights, tagline, accent = "text-primary", children }: ProductGateProps) {
  const { user } = useAuth();
  const meta = PRODUCTS[product];
  const [status, setStatus] = useState<Status>("loading");
  const [showForm, setShowForm] = useState(false);

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("product_access")
      .select("status")
      .eq("user_id", user.id)
      .eq("product", product)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setStatus("none");
        else if (data.status === "granted") setStatus("granted");
        else if (data.status === "pending") setStatus("pending");
        else setStatus("none"); // revoked → allow re-request
      });
  }, [user, product]);

  const submit = async () => {
    if (!user) return;
    if (!fullName.trim() || !contact.trim()) {
      toast.error("Please enter your name and a contact");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_access").upsert(
      {
        user_id: user.id,
        product,
        status: "pending",
        full_name: fullName.trim(),
        contact: contact.trim(),
        note: note.trim() || null,
      },
      { onConflict: "user_id,product" },
    );
    if (error) { toast.error(error.message); setSubmitting(false); return; }
    setStatus("pending");
    setShowForm(false);
    setSubmitting(false);
    toast.success("Request sent! We'll be in touch to confirm your access.");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "granted") return <>{children}</>;

  // Locked / pending paywall
  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center`}>
              {status === "pending" ? <Clock className={`w-5 h-5 text-amber-400`} /> : <Lock className={`w-5 h-5 ${accent}`} />}
            </div>
            <div>
              <h1 className="font-display text-2xl font-black">{meta.name}</h1>
              <p className="text-sm text-muted-foreground">{tagline}</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-black">${meta.price}</span>
            <span className="text-muted-foreground text-sm">/ {meta.priceUnit}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {status === "pending" ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <p className="font-semibold text-lg mb-1">Request received</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your access request for <span className="text-foreground font-medium">{meta.name}</span> is being reviewed.
                We'll confirm and unlock your dashboard shortly.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">What you get</p>
              <ul className="space-y-3 mb-8">
                {highlights.map(h => (
                  <li key={h} className="flex items-start gap-3">
                    <CheckCircle className={`w-4 h-4 ${accent} shrink-0 mt-0.5`} />
                    <span className="text-sm">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 mb-6 flex items-start gap-3">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This is a separate program — access is <span className="text-foreground font-medium">not</span> included with your MQTRADE PRO subscription.
                  Request access below and we'll set you up.
                </p>
              </div>

              <Button variant="hero" size="lg" className="w-full group" onClick={() => setShowForm(true)}>
                Request Access — {meta.priceLabel}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Request modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display font-bold text-lg mb-1">Request Access</h2>
            <p className="text-sm text-muted-foreground mb-5">
              <span className="text-foreground font-semibold">{meta.name}</span> · {meta.priceLabel}
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pg-name">Full Name</Label>
                <Input id="pg-name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pg-contact">Phone or Telegram</Label>
                <Input id="pg-contact" value={contact} onChange={e => setContact(e.target.value)} placeholder="+2547… or @username" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pg-note">Anything we should know? (optional)</Label>
                <textarea id="pg-note" value={note} onChange={e => setNote(e.target.value)} rows={3}
                  placeholder="Your goals, experience, preferred schedule…"
                  className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm resize-none" />
              </div>
            </div>

            <Button variant="hero" className="w-full mt-6" onClick={submit} disabled={submitting}>
              {submitting
                ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                : "Submit Request"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
