
// File extension mapping to enforce TypeScript React files
export const EXTENSION_MAP = { 
  ".jsx": ".tsx", 
  ".js": ".tsx" 
};

// Function to ensure file has the correct extension
export const ensureCorrectExtension = (filePath: string): string => {
  const ext = filePath.substring(filePath.lastIndexOf('.'));
  
  if (EXTENSION_MAP[ext as keyof typeof EXTENSION_MAP]) {
    return filePath.replace(ext, EXTENSION_MAP[ext as keyof typeof EXTENSION_MAP]);
  }
  
  return filePath;
};

// Function to process tokens and ensure tsx format
export const processToken = (token: string): string => {
  // Replace code fence extensions if needed
  if (token.startsWith("```") && token.includes(".jsx")) {
    return token.replace(".jsx", ".tsx");
  }
  
  if (token.startsWith("```") && token.includes(".js") && !token.includes(".json")) {
    return token.replace(".js", ".tsx");
  }
  
  return token;
};
