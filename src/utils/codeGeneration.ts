
/**
 * Determine the type of file based on its extension
 */
export const getFileType = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'css':
      return 'css';
    case 'scss':
      return 'scss';
    case 'html':
      return 'html';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'svg':
      return 'svg';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'image';
    default:
      return 'text';
  }
};

/**
 * Extract the filename from a path
 */
export const getFileName = (filePath: string): string => {
  return filePath.split('/').pop() || filePath;
};

/**
 * Check if a file is a React component
 */
export const isReactComponent = (filePath: string): boolean => {
  const fileName = getFileName(filePath);
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Check if it's a JSX/TSX file and follows component naming convention
  if ((extension === 'jsx' || extension === 'tsx')) {
    const name = fileName.split('.')[0];
    // Component names typically start with uppercase
    return name.charAt(0) === name.charAt(0).toUpperCase();
  }
  
  return false;
};

/**
 * Group files by their type/category
 */
export const groupFilesByType = (files: Array<{ path: string; type: string }>) => {
  const groups: Record<string, Array<{ path: string; type: string }>> = {
    components: [],
    styles: [],
    utils: [],
    other: []
  };
  
  files.forEach(file => {
    if (file.path.includes('/components/') || isReactComponent(file.path)) {
      groups.components.push(file);
    } else if (file.type === 'css' || file.type === 'scss') {
      groups.styles.push(file);
    } else if (file.path.includes('/utils/') || file.path.includes('/helpers/')) {
      groups.utils.push(file);
    } else {
      groups.other.push(file);
    }
  });
  
  return groups;
};
