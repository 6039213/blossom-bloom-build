
import anthropicProvider from '../providers/anthropic';

// Get the selected model - in this implementation, we're always using Claude
export const getSelectedModel = () => {
  return anthropicProvider;
};

export default {
  getSelectedModel
};
