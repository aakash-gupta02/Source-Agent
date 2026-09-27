import { Header } from "@/components/landing/header";
import { GradientGridHero } from "@/components/landing/gradient-grid-hero";
import { TrustedMarquee } from "@/components/landing/trusted-marquee";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { ForceLightTheme } from "@/components/force-light-theme";
import GradientHero from "@/components/landing/gradient-hero";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <ForceLightTheme />
      <Header />
      {/* <GradientGridHero /> */}
      <GradientHero />
      <TrustedMarquee />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
