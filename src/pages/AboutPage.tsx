
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      <main className="flex-1 py-16">
        <div className="container max-w-screen-xl">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">About {APP_NAME}</h1>
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-xl text-muted-foreground mb-6">
                We're on a mission to make website creation accessible to everyone through the power of AI.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
              <p>
                {APP_NAME} was born from a simple idea: what if creating a website could be as easy as having a conversation?
                We've combined cutting-edge AI technology with intuitive design tools to make that vision a reality.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
              <p>
                Our mission is to democratize web development by making it accessible to everyone, 
                regardless of their technical background. We believe that great ideas deserve great websites, 
                and we're here to help make that happen.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
