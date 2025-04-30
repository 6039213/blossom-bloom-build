
import CodeGenerator from '@/components/dashboard/ai-builder/CodeGenerator';
import CodePreview from '@/components/dashboard/ai-builder/CodePreview';
import EmptyStateView from '@/components/dashboard/ai-builder/EmptyStateView';
import ErrorMessage from '@/components/dashboard/ai-builder/ErrorMessage';
import ProjectInput from '@/components/dashboard/ai-builder/ProjectInput';
import * as Types from '@/components/dashboard/ai-builder/types';
import * as Utils from '@/components/dashboard/ai-builder/utils';
import WebContainerService from '@/components/dashboard/ai-builder/WebContainerService';

// Re-export the InternalChatMessage interface directly
export type { InternalChatMessage } from '@/components/dashboard/ai-builder/types';

export {
  CodeGenerator,
  CodePreview,
  EmptyStateView,
  ErrorMessage,
  ProjectInput,
  Types,
  Utils,
  WebContainerService
};
