import HongqiHeader from '@/components/HongqiHeader';
import HeroSection from '@/components/HeroSection';
import OverviewSection from '@/components/OverviewSection';
import FeaturesSection from '@/components/FeaturesSection';
import InteriorSection from '@/components/InteriorSection';
import GallerySection from '@/components/GallerySection';
import ConfiguratorSection from '@/components/ConfiguratorSection';
import SpecsSection from '@/components/SpecsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BuySection from '@/components/BuySection';
import TestDriveSection from '@/components/TestDriveSection';
import ModelsSection from '@/components/ModelsSection';
import HongqiFooter from '@/components/HongqiFooter';

export default function Index() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <HongqiHeader />
      <main>
        <HeroSection />
        <OverviewSection />
        <FeaturesSection />
        <InteriorSection />
        <GallerySection />
        <ConfiguratorSection />
        <SpecsSection />
        <TestimonialsSection />
        <BuySection />
        <TestDriveSection />
        <ModelsSection />
      </main>
      <HongqiFooter />
    </div>
  );
}
