
import { CLAUDE_MODEL } from './constants';

// Set up the API key in the environment
export function setupApiKey() {
  // Claude API key is already set in the .env file
  // This is a placeholder function for any additional setup
  console.log('API setup complete');
  
  // You can add validation or additional setup here
  return {
    isConfigured: Boolean(import.meta.env.VITE_CLAUDE_API_KEY),
    model: CLAUDE_MODEL
  };
}
