
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import FeaturesSection from '@/components/FeaturesSection';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      <main className="flex-1">
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
