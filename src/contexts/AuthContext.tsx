import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SBUser } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Subscription {
  active: boolean;
  plan: string;
  nextBilling: string;
  method?: string;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ hasSubscription: boolean }>;
  register: (email: string, password: string) => Promise<{ hasSubscription: boolean }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  activateSubscription: (method: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toUser = (u: SBUser): User => ({
  id: u.id,
  email: u.email!,
  name: (u.user_metadata?.name as string) || u.email!.split("@")[0].replace(/[._-]/g, " "),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSub = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      setSubscription({
        active: data.active,
        plan: data.plan,
        nextBilling: data.next_billing,
        method: data.method,
      });
      return data.active as boolean;
    }
    setSubscription(null);
    return false;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(toUser(session.user));
        fetchSub(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription: listener } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser(toUser(session.user));
        fetchSub(session.user.id);
      } else {
        setUser(null);
        setSubscription(null);
      }
    });

    return () => listener.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ hasSubscription: boolean }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Login failed");
    setUser(toUser(data.user));
    const hasSub = await fetchSub(data.user.id);
    return { hasSubscription: hasSub };
  };

  const register = async (email: string, password: string): Promise<{ hasSubscription: boolean }> => {
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Registration failed");
    setUser(toUser(data.user));
    setSubscription(null);
    return { hasSubscription: false };
  };

  const signInWithGoogle = async (): Promise<void> => {
    // OAuth performs a full-page redirect; on return the onAuthStateChange
    // listener above picks up the session and Auth.tsx routes the user.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth` },
    });
    if (error) throw new Error(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSubscription(null);
  };

  const activateSubscription = async (method: string): Promise<void> => {
    if (!user) return;
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    const row = {
      user_id: user.id,
      active: true,
      plan: "monthly",
      next_billing: next.toISOString(),
      method,
    };
    await supabase.from("subscriptions").upsert(row, { onConflict: "user_id" });
    setSubscription({ active: true, plan: "monthly", nextBilling: next.toISOString(), method });
  };

  return (
    <AuthContext.Provider value={{ user, subscription, isLoading, login, register, signInWithGoogle, signOut, activateSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
