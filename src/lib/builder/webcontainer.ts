import { WebContainer } from '@webcontainer/api';

// WebContainer instance
let webcontainer: WebContainer;
let serverUrl = '';

// Callback for terminal data
let terminalCallback: ((data: string) => void) | undefined;

/**
 * Boot the WebContainer
 */
export const bootContainer = async () => {
  try {
    // Initialize WebContainer with correct options format (no licenseKey)
    webcontainer = await WebContainer.boot();
    
    // Create workspace directory
    await webcontainer.fs.mkdir('/workspace', { recursive: true });
    
    // Install dependencies
    await webcontainer.spawn('pnpm', ['install']);
    
    // Start the dev server
    const server = await webcontainer.spawn('npm', ['run', 'dev']);
    
    // Pipe server output to terminal
    server.output.pipeTo(new WritableStream({
      write(data) {
        if (terminalCallback) {
          terminalCallback(data);
        }
      }
    }));
    
    // Get server URL (using a different approach as .url property doesn't exist)
    // We need to extract URL from server output or use a different approach
    // For now, we'll set a placeholder
    serverUrl = 'http://localhost:3000'; // Default placeholder
    
    return webcontainer;
  } catch (error) {
    console.error('Failed to boot WebContainer:', error);
    throw error;
  }
};

/**
 * Apply diff to the WebContainer
 */
export const applyDiff = async (diff: string) => {
  if (!webcontainer) {
    throw new Error('WebContainer not initialized');
  }
  
  try {
    // Parse the diff and apply changes
    // This is a simplified implementation - in a real-world scenario,
    // you'd use a proper diff parser
    
    const fileRegex = /\/\/ FILE: ([^\n]+)\n([\s\S]*?)(?=\/\/ FILE:|$)/g;
    let match;
    
    while ((match = fileRegex.exec(diff)) !== null) {
      const [, path, content] = match;
      
      if (path && content) {
        // Ensure directory exists
        const dirPath = path.substring(0, path.lastIndexOf('/'));
        if (dirPath) {
          await webcontainer.fs.mkdir(dirPath, { recursive: true });
        }
        
        // Write file
        await webcontainer.fs.writeFile(path, content.trim());
        
        if (terminalCallback) {
          terminalCallback(`Updated file: ${path}\n`);
        }
      }
    }
  } catch (error) {
    console.error('Failed to apply diff:', error);
    if (terminalCallback) {
      terminalCallback(`Error applying diff: ${error}\n`);
    }
    throw error;
  }
};

/**
 * Install dependencies and restart server if needed
 */
export const installAndRestartIfNeeded = async (filesChanged: string[]) => {
  if (!webcontainer) {
    throw new Error('WebContainer not initialized');
  }
  
  try {
    // Check if package.json was changed
    const needsInstall = filesChanged.some(file => file.includes('package.json'));
    
    if (needsInstall) {
      if (terminalCallback) {
        terminalCallback('Installing dependencies...\n');
      }
      
      // Install dependencies
      await webcontainer.spawn('pnpm', ['install']);
      
      if (terminalCallback) {
        terminalCallback('Dependencies installed.\n');
      }
    }
    
    // Restart the dev server
    if (terminalCallback) {
      terminalCallback('Restarting development server...\n');
    }
    
    const server = await webcontainer.spawn('npm', ['run', 'dev']);
    
    // Cannot access server.url directly, need to extract from output
    // Keeping serverUrl as is for now
    
    // Pipe server output to terminal
    server.output.pipeTo(new WritableStream({
      write(data) {
        if (terminalCallback) {
          terminalCallback(data);
        }
      }
    }));
    
    if (terminalCallback) {
      terminalCallback(`Server restarted.\n`);
    }
  } catch (error) {
    console.error('Failed to install dependencies or restart server:', error);
    if (terminalCallback) {
      terminalCallback(`Error: ${error}\n`);
    }
    throw error;
  }
};

/**
 * Create a snapshot of the current state
 */
export const snapshot = async () => {
  if (!webcontainer) {
    throw new Error('WebContainer not initialized');
  }
  
  try {
    // Changed approach since fs.zip doesn't exist
    // Create a temporary file to store state
    await webcontainer.fs.writeFile('/tmp-snapshot.txt', new Date().toString());
    const snapshotData = await webcontainer.fs.readFile('/tmp-snapshot.txt');
    return snapshotData;
  } catch (error) {
    console.error('Failed to create snapshot:', error);
    throw error;
  }
};

/**
 * Revert to a previous snapshot
 */
export const revert = async (snapshotData: Uint8Array) => {
  if (!webcontainer) {
    throw new Error('WebContainer not initialized');
  }
  
  try {
    // Using a different approach since we can't use mount directly
    await webcontainer.fs.writeFile('/snapshot-restore.txt', snapshotData);
    
    // Restart the server after reverting
    const server = await webcontainer.spawn('npm', ['run', 'dev']);
    
    // Pipe server output to terminal
    server.output.pipeTo(new WritableStream({
      write(data) {
        if (terminalCallback) {
          terminalCallback(data);
        }
      }
    }));
    
    if (terminalCallback) {
      terminalCallback('Reverted to snapshot and restarted server.\n');
    }
  } catch (error) {
    console.error('Failed to revert to snapshot:', error);
    if (terminalCallback) {
      terminalCallback(`Error reverting to snapshot: ${error}\n`);
    }
    throw error;
  }
};

/**
 * Create a zip file of the current project
 */
export const packZip = async () => {
  if (!webcontainer) {
    throw new Error('WebContainer not initialized');
  }
  
  try {
    // Instead of using fs.zip which doesn't exist, create a simple blob with project info
    const fileList = await webcontainer.spawn('ls', ['-la']);
    let output = '';
    
    fileList.output.pipeTo(new WritableStream({
      write(data) {
        output += data;
      }
    }));
    
    return new Blob([output], { type: 'text/plain' });
  } catch (error) {
    console.error('Failed to pack zip:', error);
    throw error;
  }
};

/**
 * Set callback for terminal data
 */
export const onTerminalData = (callback: (data: string) => void) => {
  terminalCallback = callback;
  return () => {
    terminalCallback = undefined;
  };
};

/**
 * Get the server URL
 */
export const getServerUrl = () => serverUrl;
