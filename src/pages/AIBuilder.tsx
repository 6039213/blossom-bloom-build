
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Save, ExternalLink, Sparkles, Columns, Code, Monitor, ImagePlus, 
  Download, Copy, Check, X, FileCode, ChevronRight, ChevronDown, Folder, FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import MonacoEditor from '@/components/dashboard/MonacoEditor';
import AIResponseDisplay from '@/components/dashboard/AIResponseDisplay';
import AIPromptInput from '@/components/dashboard/AIPromptInput';

import { anthropicProvider } from '@/lib/providers/anthropic';
import { uploadFile, extractCodeFilesFromResponse } from '@/utils/fileUtils';
import { useProjectStore } from '@/stores/projectStore';
import { getTemplateImage } from '@/utils/sampleImages';

export default function AIBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
  const [editorTab, setEditorTab] = useState('preview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('New Project');
  const [projectNameEditing, setProjectNameEditing] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  interface FileTreeItem {
    name: string;
    path: string;
    isFolder: boolean;
    children: FileTreeItem[];
  }
  
  // Load existing project or create new one
  useEffect(() => {
    const project = getCurrentProject();
    if (project) {
      setProjectName(project.name);
      if (project.files.length > 0) {
        setActiveFile(project.files[0].path);
        setOpenFiles([project.files[0].path]);
      }
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
        
        // Set active file to the first file
        if (codeFiles.length > 0) {
          setActiveFile(codeFiles[0].path);
          setOpenFiles([codeFiles[0].path]);
        }
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
      
      // Update active file and open files
      if (message.files.length > 0) {
        setActiveFile(message.files[0].path);
        setOpenFiles([message.files[0].path]);
      }
      
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
  
  // Build file tree from files
  useEffect(() => {
    const project = getCurrentProject();
    if (!project) return;
    
    const buildFileTree = () => {
      const tree: FileTreeItem[] = [];
      
      // Sort files to process directories first
      const sortedFiles = [...project.files].sort((a, b) => a.path.localeCompare(b.path));
      
      sortedFiles.forEach(file => {
        const pathParts = file.path.split('/');
        let currentLevel = tree;
        
        // Process each path segment
        pathParts.forEach((part, index) => {
          // Check if we're at the file name (last part)
          const isFileName = index === pathParts.length - 1;
          
          // Find existing folder/file at current level
          const existingItem = currentLevel.find(item => item.name === part);
          
          if (existingItem) {
            // If item exists and we're not at the file name, go deeper
            if (!isFileName) {
              currentLevel = existingItem.children;
            }
          } else {
            // Create new folder or file
            const newItem: FileTreeItem = {
              name: part,
              path: pathParts.slice(0, index + 1).join('/'),
              isFolder: !isFileName,
              children: []
            };
            
            currentLevel.push(newItem);
            
            // If it's a folder, update currentLevel to go deeper
            if (!isFileName) {
              currentLevel = newItem.children;
            }
          }
        });
      });
      
      return tree;
    };
    
    setFileTree(buildFileTree());
  }, [getCurrentProject]);
  
  // Toggle folder expansion
  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const updated = new Set(prev);
      if (updated.has(path)) {
        updated.delete(path);
      } else {
        updated.add(path);
      }
      return updated;
    });
  };
  
  // Handle tab operations
  const handleTabChange = (filePath: string) => {
    setActiveFile(filePath);
  };
  
  const handleTabClose = (filePath: string) => {
    setOpenFiles(prev => prev.filter(path => path !== filePath));
    
    // If we're closing the active file, set the next open file as active
    if (activeFile === filePath) {
      const newOpenFiles = openFiles.filter(path => path !== filePath);
      if (newOpenFiles.length > 0) {
        setActiveFile(newOpenFiles[0]);
      } else {
        setActiveFile(null);
      }
    }
  };
  
  const handleFileClick = (filePath: string) => {
    setActiveFile(filePath);
    
    // Add to open files if not already open
    if (!openFiles.includes(filePath)) {
      setOpenFiles(prev => [...prev, filePath]);
    }
  };
  
  // Render file tree recursively
  const renderFileTree = (items: FileTreeItem[], level = 0) => {
    return items.map(item => (
      <div key={item.path} className="select-none">
        {item.isFolder ? (
          <div>
            <button
              onClick={() => toggleFolder(item.path)}
              className={`flex items-center gap-1 py-1 px-2 hover:bg-muted rounded-sm w-full text-left text-sm ${
                level > 0 ? `ml-${level * 2}` : ''
              }`}
              style={{ paddingLeft: `${(level * 8) + 8}px` }}
            >
              {expandedFolders.has(item.path) ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              )}
              {expandedFolders.has(item.path) ? (
                <FolderOpen className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              )}
              <span className="truncate">{item.name}</span>
            </button>
            {expandedFolders.has(item.path) && renderFileTree(item.children, level + 1)}
          </div>
        ) : (
          <button
            onClick={() => handleFileClick(item.path)}
            className={`flex items-center gap-1.5 py-1 px-2 hover:bg-muted rounded-sm w-full text-left text-sm ${
              activeFile === item.path ? 'bg-muted font-medium text-primary' : ''
            }`}
            style={{ paddingLeft: `${(level * 8) + 8}px` }}
          >
            <FileCode className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </button>
        )}
      </div>
    ));
  };
  
  // Current project and its data
  const currentProject = getCurrentProject();
  const projectFiles = currentProject?.files || [];
  const chatMessages = currentProject?.chat || [];
  
  // Prepare editor files 
  const editorFiles: Record<string, string> = {};
  projectFiles.forEach(file => {
    editorFiles[file.path] = file.content;
  });
  
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
          </div>
        </header>
        
        {error && (
          <div className="bg-red-50 p-3 border-b border-red-200">
            <div className="flex items-start gap-2 text-red-800">
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Chat (30%) */}
          <div className="w-[30%] h-full flex flex-col border-r border-border">
            <div className="p-3 border-b">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-purple-500" /> AI Assistant
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <AIResponseDisplay messages={chatMessages} isLoading={isProcessing} />
            </div>
            
            <div className="p-3 border-t">
              <AIPromptInput 
                onSubmit={handleSendMessage} 
                isProcessing={isProcessing} 
                showSaveButton={projectFiles.length > 0}
                onSaveCode={() => toast.success("Project saved")}
                onFileUpload={async (file) => {
                  const url = await uploadFile(file);
                  return url;
                }}
              />
            </div>
          </div>
          
          {/* Right Panel - Editor/Preview (70%) */}
          <div className="w-[70%] h-full flex flex-col">
            <div className="flex items-center border-b p-2 bg-muted/30">
              <Tabs value={editorTab} onValueChange={setEditorTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="editor" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <Monitor className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                
                <div className="ml-auto flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-8">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open in new tab</span>
                  </Button>
                </div>
              </Tabs>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="editor" className="h-full m-0 data-[state=active]:flex">
                {projectFiles.length > 0 ? (
                  <div className="flex h-full">
                    {/* File Explorer */}
                    <div className="w-56 border-r overflow-y-auto">
                      <div className="p-2 border-b">
                        <h3 className="font-medium text-sm">Project Files</h3>
                      </div>
                      <div className="p-1">
                        {renderFileTree(fileTree)}
                      </div>
                    </div>
                    
                    {/* Monaco Editor */}
                    <div className="flex-1">
                      <MonacoEditor 
                        files={editorFiles}
                        activeFile={activeFile}
                        onContentChange={handleFileChange}
                        openFiles={openFiles}
                        onTabChange={handleTabChange}
                        onTabClose={handleTabClose}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full p-6 text-center">
                    <div className="max-w-md">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">No Files Yet</h2>
                      <p className="text-muted-foreground mb-6">
                        Ask the AI assistant to generate code for your project.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="preview" className="h-full m-0">
                {projectFiles.length > 0 ? (
                  <div className="h-full bg-muted/30 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-lg overflow-hidden border border-border flex-1 h-full">
                      <div className="bg-muted/50 border-b p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mx-1"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mx-1"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500 mx-1"></div>
                        </div>
                        <div className="text-xs text-center bg-white/50 px-2 py-1 rounded-md">
                          {projectName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="h-[calc(100%-40px)]">
                        <iframe 
                          src="about:blank"
                          className="w-full h-full border-none"
                          title="Preview"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full p-6 text-center">
                    <div className="max-w-md">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Monitor className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">Nothing to Preview Yet</h2>
                      <p className="text-muted-foreground mb-6">
                        Ask the AI assistant to generate code for your project.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
