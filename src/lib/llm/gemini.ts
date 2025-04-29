
import { GEMINI_API_KEY } from '@/lib/constants';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Generative AI with the API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper to extract diffs from the prompt response
const extractDiff = (text: string): string => {
  // Basic implementation - in real usage, this would parse code blocks or diff format
  if (text.includes('```') || text.includes('FILE:')) {
    return text;
  }
  return '';
};

// Stream generator for Gemini API
export async function* geminiStream(
  prompt: string,
  onToken: (token: string) => void
) {
  // Get the model - specifically use gemini-2.5-flash-preview
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview' });
  
  // Generate content stream
  const stream = await model.generateContentStream([
    { role: 'user', parts: [{ text: prompt }] }
  ]);
  
  let diff = '';
  const filesChanged: string[] = [];
  
  // Process each chunk from the stream
  for await (const chunk of stream) {
    const text = chunk.text();
    onToken(text);
    diff += text;
    
    // Check for file changes
    if (text.includes('// FILE:') || text.includes('```')) {
      // Extract filename from content like "// FILE: src/path/to/file.tsx"
      const fileRegex = /\/\/ FILE: ([^\n]+)/g;
      let match;
      while ((match = fileRegex.exec(text)) !== null) {
        filesChanged.push(match[1]);
      }
      
      // Also check for ```typescript filename or ```tsx filename patterns
      const codeBlockRegex = /```(?:typescript|tsx|jsx|js) ([^\n]+)/g;
      while ((match = codeBlockRegex.exec(text)) !== null) {
        filesChanged.push(match[1]);
      }
    }
    
    // Yield the extracted diff and changed files
    yield { diff: extractDiff(text), filesChanged };
  }
  
  // Final yield to indicate completion
  yield { done: true, filesChanged };
}
