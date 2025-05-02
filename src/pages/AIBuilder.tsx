import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Settings, Save, ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import ChatInterface from '@/components/ai-builder/ChatInterface';
import CodeEditor from '@/components/ai-builder/CodeEditor';
import CodePreview from '@/components/ai-builder/CodePreview';

import { anthropicProvider } from '@/lib/providers/anthropic';
import { uploadFile, extractCodeFilesFromResponse } from '@/utils/fileUtils';
import { useProjectStore } from '@/stores/projectStore';

export default function AIBuilder() {
  const navigate = useNavigate();
  
  // Global project state
  const { 
    projects, 
    currentProjectId, 
    getCurrentProject,
    createProject,
    setCurrentProject, 
    updateProject,
    addFiles,
    updateFile,
    addChatMessage,
    getPermission
  } = useProjectStore();
  
  // Local state
  const [activeTab, setActiveTab] = useState('chat');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [projectName, setProjectName] = useState('New Project');
  const [projectNameEditing, setProjectNameEditing] = useState(false);
  
  // Check if Claude API key is set
  useEffect(() => {
    const key = localStorage.getItem('VITE_CLAUDE_API_KEY');
    setApiKeySet(!!key);
    
    // Load existing project or create new one
    const project = getCurrentProject();
    if (project) {
      setProjectName(project.name);
    } else if (projects.length > 0) {
      // If there are projects but none selected, select the first one
      setCurrentProject(projects[0].id);
      setProjectName(projects[0].name);
    } else {
      // Create a new project
      const newId = createProject('New AI Project', 'Created with Blossom AI Builder');
      setCurrentProject(newId);
    }
  }, []);
  
  // Handle sending messages to Claude
  const handleSendMessage = async (content: string) => {
    if (!apiKeySet) {
      toast.error("Please set your Claude API key in API Settings");
      setError("No API key found. Please add your Claude API key in API Settings.");
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Get current project
      const project = getCurrentProject();
      if (!project) {
        throw new Error("No active project");
      }
      
      // Add user message to chat
      addChatMessage(project.id, {
        role: 'user',
        content
      });
      
      // Prepare system instructions for Claude
      const systemInstructions = `You are an expert web developer that can create complete, working React applications with TypeScript and Tailwind CSS.
When asked to create a web application or make changes:
1. Generate ALL necessary files to make the app fully functional
2. Format your response with code blocks for each file like: \`\`\`tsx src/components/ComponentName.tsx\n// code here\n\`\`\`
3. Make sure to include imports and full implementation in each file
4. Use TypeScript (.tsx) for all React components with proper types
5. Use Tailwind CSS for styling (no raw CSS unless absolutely necessary)
6. Create responsive, clean UI with best practices
7. Include test data and placeholder content as needed
8. Output a brief explanation of what you've built and a list of all files created

IMPORTANT: Always provide full, complete files that are ready to use, not snippets or partial implementations.`;
      
      // Generate response with Claude
      let fullResponse = '';
      
      await anthropicProvider.generateStream(
        content,
        (token) => {
          fullResponse += token;
        },
        {
          system: systemInstructions,
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      );
      
      // Extract code files from response
      const codeFiles = extractCodeFilesFromResponse(fullResponse);
      
      // Add AI response to chat
      addChatMessage(project.id, {
        role: 'assistant',
        content: fullResponse,
        files: codeFiles
      });
      
      // If this is a new project with no files yet, automatically apply the changes
      if (project.files.length === 0 && codeFiles.length > 0) {
        addFiles(project.id, codeFiles);
        toast.success(`Added ${codeFiles.length} files to your project`);
      }
      
    } catch (error) {
      console.error("Error processing message:", error);
      setError(`Failed to process your request: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error("Failed to generate content");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Fix the handleFileUpload function to have the correct return type
  const handleFileUpload = async (files: File[]): Promise<void> => {
    try {
      setIsProcessing(true);
      
      // Get current project
      const project = getCurrentProject();
      if (!project) {
        throw new Error("No active project");
      }
      
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const url = await uploadFile(file);
          return {
            name: file.name,
            url,
            type: file.type
          };
        })
      );
      
      // Create a message with the uploaded files
      const filesList = uploadedFiles.map(f => `- ${f.name}`).join('\n');
      const content = `Uploaded ${files.length} file(s):\n${filesList}`;
      
      // Add message to chat
      addChatMessage(project.id, {
        role: 'user',
        content
      });
      
      toast.success(`Uploaded ${files.length} file(s)`);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle applying code changes from a chat message
  const handleApplyChanges = async (messageId: string) => {
    try {
      // Get current project
      const project = getCurrentProject();
      if (!project) {
        throw new Error("No active project");
      }
      
      // Find the message
      const message = project.chat.find(m => m.id === messageId);
      if (!message || !message.files || message.files.length === 0) {
        throw new Error("No files to apply");
      }
      
      // Check if we need to get permission (if overwriting many files)
      const existingFilePaths = new Set(project.files.map(f => f.path));
      const newFiles = message.files.filter(f => !existingFilePaths.has(f.path));
      const overwrittenFiles = message.files.filter(f => existingFilePaths.has(f.path));
      
      // Request permission if overwriting files
      if (overwrittenFiles.length > 0) {
        const hasPermission = await getPermission(project.id, {
          action: 'overwrite_files',
          details: {
            files: overwrittenFiles.map(f => f.path),
            count: overwrittenFiles.length
          }
        });
        
        if (!hasPermission) {
          toast.error("Operation canceled");
          return;
        }
      }
      
      // Apply the changes
      addFiles(project.id, message.files);
      
      toast.success(`Applied changes: ${newFiles.length} new files, ${overwrittenFiles.length} updated files`);
      
      // Switch to editor tab to see the changes
      setActiveTab('editor');
    } catch (error) {
      console.error("Error applying changes:", error);
      toast.error("Failed to apply changes");
    }
  };
  
  // Handle updating a file
  const handleFileChange = (path: string, content: string) => {
    try {
      // Get current project
      const project = getCurrentProject();
      if (!project) {
        throw new Error("No active project");
      }
      
      updateFile(project.id, path, content);
      toast.success(`Updated file: ${path.split('/').pop()}`);
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("Failed to update file");
    }
  };
  
  // Save project name
  const handleSaveProjectName = () => {
    try {
      const project = getCurrentProject();
      if (!project) return;
      
      updateProject(project.id, { name: projectName });
      setProjectNameEditing(false);
      toast.success("Project name updated");
    } catch (error) {
      console.error("Error updating project name:", error);
      toast.error("Failed to update project name");
    }
  };
  
  // Current project and its data
  const currentProject = getCurrentProject();
  const projectFiles = currentProject?.files || [];
  const chatMessages = currentProject?.chat || [];
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 flex justify-between items-center">
          {projectNameEditing ? (
            <div className="flex items-center gap-2">
              <Input 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-64"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveProjectName}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setProjectName(currentProject?.name || 'New Project');
                  setProjectNameEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <h1 
              className="text-2xl font-bold cursor-pointer hover:text-primary"
              onClick={() => setProjectNameEditing(true)}
            >
              {projectName}
            </h1>
          )}
          
          <div className="flex items-center gap-2">
            <Link to="/dashboard/projects">
              <Button variant="outline" size="sm">
                All Projects
              </Button>
            </Link>
            <Link to="/settings/api">
              <Button 
                variant="outline" 
                size="sm"
                className={`flex items-center gap-1 ${!apiKeySet ? 'text-red-600 border-red-600' : ''}`}
              >
                <Settings className="h-4 w-4" />
                {apiKeySet ? 'API Settings' : 'Set API Key'}
              </Button>
            </Link>
          </div>
        </header>
        
        {!apiKeySet && (
          <div className="bg-red-50 p-3 border-b border-red-200">
            <div className="flex items-start gap-2 text-red-800">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">API Key Required</p>
                <p className="text-sm">
                  To use the AI Builder, you need to set your Claude API key. Go to{' '}
                  <Link to="/settings/api" className="font-medium underline">
                    API Settings
                  </Link>{' '}
                  to set your key.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="border-b px-4">
              <TabsList>
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="flex-1 p-0 m-0">
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onSendFiles={handleFileUpload}
                isProcessing={isProcessing}
                onApplyChanges={handleApplyChanges}
              />
            </TabsContent>
            
            <TabsContent value="editor" className="flex-1 p-4 m-0 overflow-hidden">
              {projectFiles.length > 0 ? (
                <CodeEditor
                  files={projectFiles}
                  onFileChange={handleFileChange}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📁</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No Files Yet</h2>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Your project doesn't have any files yet. Chat with the AI to generate some code!
                  </p>
                  <Button onClick={() => setActiveTab('chat')}>
                    Go to Chat
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 p-4 m-0 overflow-hidden">
              {projectFiles.length > 0 ? (
                <CodePreview files={projectFiles} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Nothing to Preview</h2>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Your project doesn't have any files yet. Chat with the AI to generate some code!
                  </p>
                  <Button onClick={() => setActiveTab('chat')}>
                    Go to Chat
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
