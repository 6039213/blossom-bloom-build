
export interface FileContent {
  path: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: FileContent[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  files: FileContent[];
  chat: ChatMessage[];
  thumbnail?: string;
  status?: string;
  title?: string;
  code?: string; // Added code property
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  fileCount: number;
  title?: string;
  status?: string;
}

export interface Permission {
  action: 'delete_files' | 'overwrite_files' | 'install_packages';
  details: {
    files?: string[];
    packages?: string[];
    count?: number;
  };
}
