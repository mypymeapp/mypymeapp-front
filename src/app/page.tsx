import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import PremiumFeatures from "@/components/sections/PremiumFeatures";

export default function HomePage() {
  return (
    <div className="bg-background">
      <Navbar />
      <main>
        <Hero />
        <PremiumFeatures />
      </main>
      <Footer />
    </div>
  );
}