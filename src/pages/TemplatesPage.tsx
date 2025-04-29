
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      <main className="flex-1 py-16">
        <div className="container max-w-screen-xl">
          <h1 className="text-4xl font-bold mb-8">Website Templates</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Template cards will go here */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Our template library is currently under development. Check back soon!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
