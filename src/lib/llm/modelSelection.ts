
import anthropicProvider from '../providers/anthropic';

// Get the selected model - we're using the Claude 3.7 Sonnet implementation
export const getSelectedModel = () => {
  return anthropicProvider;
};

export default {
  getSelectedModel
};
