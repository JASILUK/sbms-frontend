import AIHighlightSection from "../components/AIHighlightSection";
import FeaturesSection from "../components/FeaturesSection";
import FinalCTASection from "../components/FinalCTASection";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import PricingSection from "../components/PricingSection";
import ProblemSolutionSection from "../components/ProblemSolutionSection";
import TestimonialsSection from "../components/TestimonialsSection";
import TrustedSection from "../components/TrustedSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection/>
      <TrustedSection/>
      <ProblemSolutionSection/>
      
      {/* Features Section with ID */}
      <section id="features" className="scroll-mt-20">
        <FeaturesSection/>
      </section>
      
      {/* AI Section with ID */}
      <section id="ai" className="scroll-mt-20">
        <AIHighlightSection/>
      </section>
      
      {/* How It Works Section with ID */}
      <section id="how-it-works" className="scroll-mt-20">
        <HowItWorksSection/>
      </section>
      
      {/* Pricing Section with ID */}
      <section id="pricing" className="scroll-mt-20">
        <PricingSection/>
      </section>
      
      {/* Testimonials Section with ID */}
      <section id="testimonials" className="scroll-mt-20">
        <TestimonialsSection/>
      </section>
      
      <FinalCTASection/>
    </>
  );
}