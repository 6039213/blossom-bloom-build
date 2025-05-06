
import { ANTHROPIC_API_KEY, OPENAI_API_KEY } from '../constants';

// API service for AI generators
export const aiService = {
  /**
   * Generate website code based on a prompt
   */
  generateWebsite: async (prompt: string) => {
    try {
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating website:', error);
      throw error;
    }
  },
  
  /**
   * Check if API keys are configured
   */
  hasConfiguredKeys: () => {
    return Boolean(ANTHROPIC_API_KEY || OPENAI_API_KEY);
  },
  
  /**
   * Request the user to input API keys if needed
   */
  requestApiKeys: async () => {
    // This would typically show a modal or redirect to settings
    // For now, we'll just return a notification object
    return {
      type: 'warning',
      message: 'API key required',
      description: 'Please set up your AI API key in project settings'
    };
  }
};

export default aiService;
