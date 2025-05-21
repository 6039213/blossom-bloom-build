import { anthropicProvider } from '../providers/anthropic';

// Get the selected model - we're always using the direct Claude API implementation
export const getSelectedModel = () => {
  return anthropicProvider;
};

export default {
  getSelectedModel
};
