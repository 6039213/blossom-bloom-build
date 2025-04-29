
/**
 * A utility function that simulates typing animation for code blocks
 * @param text The full text to be typed
 * @param onUpdate Callback function that receives the current typed text
 * @param speed Speed of typing in milliseconds per character
 * @returns A function to cancel the typing animation
 */
export const simulateTyping = (
  text: string,
  onUpdate: (text: string) => void,
  speed: number = 10
): () => void => {
  let currentIndex = 0;
  let typedText = '';
  let timerId: number | null = null;

  const type = () => {
    if (currentIndex < text.length) {
      typedText += text.charAt(currentIndex);
      onUpdate(typedText);
      currentIndex++;
      timerId = window.setTimeout(type, speed);
    }
  };

  // Start typing
  type();

  // Return a function to cancel typing if needed
  return () => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
  };
};

/**
 * Determines the appropriate syntax highlighting class for a file type
 * @param fileType The file extension or type
 * @returns The CSS class name for syntax highlighting
 */
export const getSyntaxHighlightClass = (fileType: string): string => {
  switch (fileType.toLowerCase()) {
    case 'js':
    case 'jsx':
      return 'language-javascript';
    case 'ts':
    case 'tsx':
      return 'language-typescript';
    case 'css':
      return 'language-css';
    case 'scss':
      return 'language-scss';
    case 'html':
      return 'language-html';
    case 'json':
      return 'language-json';
    case 'md':
    case 'markdown':
      return 'language-markdown';
    default:
      return 'language-plaintext';
  }
};
