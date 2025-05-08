
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { extractCodeBlocks } from '@/utils/codeGeneration';

// Define the WebsiteFile interface if it doesn't exist elsewhere
interface WebsiteFile {
  path: string;
  content: string;
  type: string;
}

export default function BoltAIWebBuilder() {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<WebsiteFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [responseText, setResponseText] = useState('');

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
  };

  const handleGenerateCode = async () => {
    try {
      setIsGenerating(true);
      setResponseText('');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock API response
      const mockApiResponse = `
        // FILE: src/components/Header.tsx
        import React from 'react';

        const Header = () => {
          return <header><h1>Welcome</h1></header>;
        };

        export default Header;

        // FILE: src/components/Main.tsx
        import React from 'react';

        const Main = () => {
          return <main><p>Main content</p></main>;
        };

        export default Main;
      `;

      setResponseText(mockApiResponse);

      // Parse the response and extract code blocks
      const extractedFiles = extractCodeBlocks(mockApiResponse);
    
      // Convert the extracted files to WebsiteFile[]
      const websiteFiles: WebsiteFile[] = Object.entries(extractedFiles).map(([path, content]) => ({
        path,
        content: content as string, // Ensure content is cast to string
        type: path.split('.').pop() || 'text'
      }));
    
      setFiles(websiteFiles);

      toast.success('Website code generated successfully!');
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('Failed to generate website code');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1>Bolt AI Web Builder</h1>
      <Textarea
        placeholder="Describe the website you want to generate..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <Button onClick={handleGenerateCode} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>

      <div>
        <h2>Files:</h2>
        <ul>
          {files.map(file => (
            <li key={file.path} onClick={() => handleFileSelect(file.path)}>
              {file.path}
            </li>
          ))}
        </ul>
      </div>

      {activeFile && (
        <div>
          <h2>{activeFile}</h2>
          <textarea
            value={files.find(file => file.path === activeFile)?.content || ''}
            readOnly
            style={{ width: '500px', height: '300px' }}
          />
        </div>
      )}
    </div>
  );
}
