
import KrknHero from "@/components/home/KrknHero";
import DropSection from "@/components/home/DropSection";
import WearItSection from "@/components/home/WearItSection";
import TheDetailsSection from "@/components/home/TheDetailsSection";
import KrknInMotionSection from "@/components/home/KrknInMotionSection";
import EditorialClosingSection from "@/components/home/EditorialClosingSection";

export default function HomePage() {
  return (
    <main>
      <KrknHero />
      <DropSection />
      <WearItSection />
      <TheDetailsSection />
      <KrknInMotionSection />
      <EditorialClosingSection />
    </main>
  );
}
