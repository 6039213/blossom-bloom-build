
import { useState } from "react";
import { toast } from "sonner";
import { useProjectStore } from "@/stores/projectStore";
import AIPromptInput from "@/components/dashboard/AIPromptInput";
import WebContainerPreview from "@/components/dashboard/WebContainerPreview";
import { GEMINI_API_KEY } from "@/lib/constants";
import MainNavbar from "@/components/layout/MainNavbar";
import Footer from "@/components/layout/Footer";

export default function AIBuilder() {
  const { setPreviewHtml } = useProjectStore();
  const [loading, setLoading] = useState(false);

  const sendPrompt = async (prompt: string) => {
    setLoading(true);
    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured");
      }
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              role: "user", 
              parts: [{ text: prompt }]
            }],
            generationConfig: { 
              maxOutputTokens: 4096, 
              temperature: 0.7 
            }
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const html = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!html) {
        throw new Error("Empty response from API");
      }
      
      setPreviewHtml(html);
    } catch (err: any) {
      toast.error(`Error: ${err.message || String(err)}`);
      console.error("Error generating content:", err);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      
      <main className="flex-1 flex flex-col">
        <div className="container max-w-screen-xl mx-auto px-4 py-6 flex flex-col h-full">
          <h1 className="text-3xl font-bold mb-6">AI Website Builder</h1>
          
          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
            <div className="border-b p-4 bg-card">
              <AIPromptInput onSend={sendPrompt} disabled={loading} />
            </div>
            
            <div className="flex-1 min-h-[60vh]">
              <WebContainerPreview />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
