import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthOnlyRoute from "./components/AuthOnlyRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Journal from "./pages/Journal";
import Admin from "./pages/Admin";
import EconomicCalendar from "./pages/EconomicCalendar";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Calculator from "./pages/Calculator";
import Performance from "./pages/Performance";
import Onboarding from "./pages/Onboarding";
import Referral from "./pages/Referral";
import Indicators from "./pages/Indicators";
import TVDashboard from "./pages/TVDashboard";
import TVAccount from "./pages/TVAccount";
import Mentorship from "./pages/Mentorship";
import PropFirm from "./pages/PropFirm";
import Webinars from "./pages/Webinars";
import Reports from "./pages/Reports";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />

            {/* Protected routes — must be logged in + subscription active */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><EconomicCalendar /></ProtectedRoute>} />
            <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />

            {/* Add-on product dashboards — logged-in only; each gates its own paid access */}
            <Route path="/mentorship" element={<AuthOnlyRoute><Mentorship /></AuthOnlyRoute>} />
            <Route path="/prop-firm" element={<AuthOnlyRoute><PropFirm /></AuthOnlyRoute>} />
            <Route path="/webinars" element={<AuthOnlyRoute><Webinars /></AuthOnlyRoute>} />
            <Route path="/reports" element={<AuthOnlyRoute><Reports /></AuthOnlyRoute>} />
            <Route path="/tv-dashboard" element={<AuthOnlyRoute><TVDashboard /></AuthOnlyRoute>} />
            <Route path="/tv-account" element={<AuthOnlyRoute><TVAccount /></AuthOnlyRoute>} />
            <Route path="/indicators" element={<AuthOnlyRoute><Indicators /></AuthOnlyRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
