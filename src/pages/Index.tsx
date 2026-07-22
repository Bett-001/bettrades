import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TwoProductsSection from "@/components/landing/TwoProductsSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SignalsPreview from "@/components/landing/SignalsPreview";
import ComparisonSection from "@/components/landing/ComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TwoProductsSection />
      <StatsSection />
      <FeaturesSection />
      <SignalsPreview />
      <ComparisonSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
