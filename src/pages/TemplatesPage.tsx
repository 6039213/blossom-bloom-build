
import { useNavigate } from 'react-router-dom';
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/projectStore';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { templates, openProject, setPreviewHtml } = useProjectStore();
  
  const handleTemplateClick = (slug: string) => {
    openProject(slug);
    navigate('/dashboard/ai-builder');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      <main className="flex-1 py-16">
        <div className="container max-w-screen-xl">
          <h1 className="text-4xl font-bold mb-8">Website Templates</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card 
                key={template.slug}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleTemplateClick(template.slug)}
              >
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded mb-4 flex items-center justify-center text-muted-foreground">
                    {/* This would be a preview image in a real app */}
                    <span>{template.name}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Start with a professional {template.name.toLowerCase()} template
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateClick(template.slug);
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
