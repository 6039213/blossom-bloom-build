// Configuration for the application
const config = {
  // Claude API configuration
  claudeApiKey: process.env.VITE_CLAUDE_API_KEY,
  claudeModel: process.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229",
  apiUrl: "https://api.anthropic.com/v1/messages",
  
  // Application settings
  maxTokens: 4000,
  defaultTemperature: 0.7,
  
  // Feature flags
  enableDebugLogging: process.env.NODE_ENV === 'development',
};

// Validate critical configuration
if (!config.claudeApiKey) {
  console.error("Claude API key is not configured. Please set VITE_CLAUDE_API_KEY environment variable.");
}

// Validate API URL format
if (!config.apiUrl.startsWith('https://')) {
  console.error("Invalid API URL format. Must be a secure HTTPS URL.");
}

export default config; 