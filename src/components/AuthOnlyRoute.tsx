import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/** Requires only a logged-in account — no subscription check. */
const AuthOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default AuthOnlyRoute;
