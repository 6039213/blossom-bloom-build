
import { useState, useRef, useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GEMINI_API_KEY } from '@/lib/constants';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Download,
  Copy,
  Code,
  Eye,
  Sparkles,
  Save,
  File,
  Folder,
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { simulateTyping } from '@/utils/typingAnimation';

// File system types
interface SimulatedFile {
  name: string;
  content: string;
  type: 'tsx' | 'css' | 'html' | 'json';
  isOpen?: boolean;
}

interface SimulatedFolder {
  name: string;
  isOpen?: boolean;
  children: (SimulatedFile | SimulatedFolder)[];
}

type FileSystemItem = SimulatedFile | SimulatedFolder;

// Helper function to determine if an item is a file
const isFile = (item: FileSystemItem): item is SimulatedFile => {
  return 'content' in item;
};

export default function BoltBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [typingContent, setTypingContent] = useState('');
  const [fullGeneratedCode, setFullGeneratedCode] = useState('');
  const [selectedFile, setSelectedFile] = useState<SimulatedFile | null>(null);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [typingInProgress, setTypingInProgress] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(10); // ms per character
  const [previewHtml, setPreviewHtml] = useState('');
  const { createProject } = useProjectStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const generateFileSystem = (promptText: string) => {
    // This is a simplified example - in a real app you'd generate this based on AI response
    const componentName = promptText.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '');
    
    const tsxContent = `import React from 'react';
import styles from './${componentName}.module.css';

export default function ${componentName}() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Hello from ${componentName}</h2>
      <p className={styles.description}>This is a generated component based on your prompt:</p>
      <p className={styles.prompt}>"${promptText}"</p>
      <button className={styles.button}>Click me</button>
    </div>
  );
}`;

    const cssContent = `.container {
  padding: 2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.description {
  color: #666;
  margin-bottom: 0.5rem;
}

.prompt {
  background-color: #eee;
  padding: 0.5rem;
  border-radius: 4px;
  font-style: italic;
  margin-bottom: 1rem;
}

.button {
  background-color: #f59e0b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #d97706;
}`;

    const htmlPreview = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${cssContent}
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      margin: 0;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="title">Hello from ${componentName}</h2>
    <p class="description">This is a generated component based on your prompt:</p>
    <p class="prompt">"${promptText}"</p>
    <button class="button">Click me</button>
  </div>
</body>
</html>
    `;

    const newFileSystem: FileSystemItem[] = [
      {
        name: 'src',
        isOpen: true,
        children: [
          {
            name: 'components',
            isOpen: true,
            children: [
              {
                name: componentName,
                isOpen: true,
                children: [
                  {
                    name: `${componentName}.tsx`,
                    content: tsxContent,
                    type: 'tsx',
                    isOpen: true
                  },
                  {
                    name: `${componentName}.module.css`,
                    content: cssContent,
                    type: 'css'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    
    setFileSystem(newFileSystem);
    setSelectedFile({
      name: `${componentName}.tsx`,
      content: tsxContent,
      type: 'tsx',
      isOpen: true
    });
    setFullGeneratedCode(tsxContent);
    setTypingContent('');
    setCharIndex(0);
    setPreviewHtml(htmlPreview);
    
    return tsxContent;
  };

  // Effect to handle the typing animation
  useEffect(() => {
    if (!selectedFile || !typingInProgress) return;
    
    if (charIndex < selectedFile.content.length) {
      const timer = setTimeout(() => {
        setTypingContent(prev => prev + selectedFile.content.charAt(charIndex));
        setCharIndex(prevIndex => prevIndex + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    } else {
      setTypingInProgress(false);
    }
  }, [selectedFile, charIndex, typingInProgress, typingSpeed]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsGenerating(true);
    setTypingContent('');
    
    try {
      // In a real implementation, this would call your AI endpoint
      const generatedCode = generateFileSystem(prompt);
      
      // Start the typing animation
      setTypingInProgress(true);
      toast.success("Code generated successfully!");
      setActiveTab('editor');
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileClick = (file: SimulatedFile) => {
    setSelectedFile(file);
    setTypingContent('');
    setCharIndex(0);
    setTypingInProgress(true);
  };

  const handleFolderClick = (folder: SimulatedFolder, path: FileSystemItem[] = []) => {
    const updatedFileSystem = [...fileSystem];
    
    const toggleFolder = (items: FileSystemItem[], targetName: string): boolean => {
      for (const item of items) {
        if (!isFile(item) && item.name === targetName) {
          item.isOpen = !item.isOpen;
          return true;
        }
        
        if (!isFile(item) && item.children) {
          if (toggleFolder(item.children, targetName)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    toggleFolder(updatedFileSystem, folder.name);
    setFileSystem(updatedFileSystem);
  };

  const renderFileSystem = (items: FileSystemItem[], level = 0): JSX.Element[] => {
    return items.map((item, index) => {
      const paddingLeft = `${level * 12 + 8}px`;
      
      if (isFile(item)) {
        return (
          <div 
            key={item.name + index}
            className={`flex items-center py-1 px-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
              selectedFile?.name === item.name ? 'bg-blossom-100 dark:bg-blossom-900/20 text-blossom-700 dark:text-blossom-300' : ''
            }`}
            style={{ paddingLeft }}
            onClick={() => handleFileClick(item)}
          >
            <File className="h-4 w-4 mr-2 text-gray-500" />
            <span>{item.name}</span>
          </div>
        );
      } else {
        return (
          <div key={item.name + index}>
            <div 
              className="flex items-center py-1 px-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ paddingLeft }}
              onClick={() => handleFolderClick(item)}
            >
              <Folder className="h-4 w-4 mr-2 text-gray-500" />
              <span>{item.name}</span>
            </div>
            {item.isOpen && item.children && renderFileSystem(item.children, level + 1)}
          </div>
        );
      }
    });
  };

  const handleSaveProject = async () => {
    if (!user) {
      toast.error("You must be logged in to save a project");
      navigate('/auth');
      return;
    }

    if (!selectedFile) {
      toast.error("No project to save");
      return;
    }

    try {
      const projectData = {
        title: prompt.split(' ').slice(0, 5).join(' ') + '...',
        description: prompt,
        code: JSON.stringify(fileSystem),
        status: 'draft' as const
      };

      const newProject = await createProject(projectData);
      
      toast.success("Project saved successfully");
      navigate(`/dashboard/projects/${newProject.id}`);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  const handleCopyCode = () => {
    if (!selectedFile) return;
    
    navigator.clipboard.writeText(selectedFile.content);
    toast.success("Code copied to clipboard");
  };

  const handleDownloadCode = () => {
    if (!selectedFile) return;
    
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully");
  };
  
  // Function to get syntax highlighting class based on file type
  const getSyntaxHighlightClass = (type: string) => {
    switch (type) {
      case 'tsx':
        return 'language-typescript';
      case 'css':
        return 'language-css';
      case 'html':
        return 'language-html';
      case 'json':
        return 'language-json';
      default:
        return 'language-typescript';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Bolt Builder</h1>
            <div className="flex space-x-2">
              {selectedFile && (
                <>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCode}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </>
              )}
              {selectedFile && (
                <Button 
                  variant="default"
                  size="sm"
                  onClick={handleSaveProject}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Prompt Input Area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-b border-border">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-blossom-500" />
                Describe what you want to build
              </h2>
              <div className="flex flex-col space-y-3">
                <Textarea
                  placeholder="Describe the component or page you want to create... (e.g., 'Create a responsive product card with image, title, price, and add to cart button')"
                  value={prompt}
                  onChange={handlePromptChange}
                  disabled={isGenerating}
                  className="min-h-24 resize-none border-blossom-200 focus:border-blossom-500 transition-all duration-200"
                />
                <div>
                  <Button
                    className="bg-blossom-500 hover:bg-blossom-600 text-white"
                    disabled={isGenerating || !prompt.trim()}
                    onClick={handleGenerate}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area - three column layout */}
          <div className="flex-1 grid grid-cols-12 gap-1 overflow-hidden p-1">
            {/* File Explorer */}
            <div className="col-span-2 bg-white dark:bg-gray-900 border border-border rounded-lg overflow-hidden">
              <div className="p-2 border-b border-border font-medium text-sm">Files</div>
              <div className="overflow-auto h-full">
                {fileSystem.length > 0 ? (
                  <div className="py-1">{renderFileSystem(fileSystem)}</div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No files generated yet.
                  </div>
                )}
              </div>
            </div>
            
            {/* Code Editor */}
            <div className="col-span-6 bg-white dark:bg-gray-900 border border-border rounded-lg overflow-hidden flex flex-col">
              <div className="p-2 border-b border-border font-medium text-sm flex justify-between items-center">
                <div className="flex items-center">
                  <Code className="h-4 w-4 mr-1" />
                  {selectedFile?.name || 'Editor'}
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="h-7 p-0.5">
                    <TabsTrigger value="editor" className="text-xs h-6 px-2">
                      <Code className="h-3 w-3 mr-1" /> Code
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs h-6 px-2">
                      <Eye className="h-3 w-3 mr-1" /> Preview
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex-1 overflow-auto">
                <Tabs value={activeTab} className="h-full">
                  <TabsContent value="editor" className="m-0 p-0 h-full">
                    {selectedFile ? (
                      <pre className={`h-full m-0 p-4 font-mono text-sm overflow-auto ${getSyntaxHighlightClass(selectedFile.type)}`}>
                        <code>{typingContent || selectedFile.content}</code>
                      </pre>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No file selected
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="preview" className="m-0 p-0 h-full">
                    {previewHtml ? (
                      <iframe 
                        srcDoc={previewHtml}
                        title="Preview" 
                        className="w-full h-full border-0"
                        sandbox="allow-scripts"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No preview available
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Live Preview */}
            <div className="col-span-4 bg-white dark:bg-gray-900 border border-border rounded-lg overflow-hidden flex flex-col">
              <div className="p-2 border-b border-border font-medium text-sm flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Live Preview
              </div>
              <div className="flex-1 overflow-auto p-4">
                {previewHtml ? (
                  <iframe 
                    srcDoc={previewHtml}
                    title="Live Preview" 
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Generate a component to see a preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
