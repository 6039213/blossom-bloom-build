
import React from 'react';
import AIPromptInput from '@/components/dashboard/AIPromptInput';
import ProjectTypeSelector from '@/components/dashboard/ProjectTypeSelector';
import { Button } from '@/components/ui/button';
import ErrorMessage from './ErrorMessage';
import { ProjectTemplate } from './types';

interface ProjectInputProps {
  showTemplateSelector: boolean;
  selectedTemplate: ProjectTemplate | null;
  onTemplateSelect: (template: ProjectTemplate) => void;
  onResetSelection: () => void;
  onUseTemplatePrompt: () => void;
  errorMessage: string | null;
  onDismissError: () => void;
  onPromptSubmit: (prompt: string, model?: string) => void;
  isGenerating: boolean;
  onSaveCode: () => void;
  showSaveButton: boolean;
  onReportError: (error: Error) => void;
  onSnapshot: () => void;
  onRevert: () => void;
}

export default function ProjectInput({
  showTemplateSelector,
  selectedTemplate,
  onTemplateSelect,
  onResetSelection,
  onUseTemplatePrompt,
  errorMessage,
  onDismissError,
  onPromptSubmit,
  isGenerating,
  onSaveCode,
  showSaveButton,
  onReportError,
  onSnapshot,
  onRevert
}: ProjectInputProps) {
  return (
    <div className="p-4 border-t border-border">
      {showTemplateSelector && (
        <div className="mb-6">
          <ProjectTypeSelector onSelect={onTemplateSelect} />
        </div>
      )}
      
      {selectedTemplate && !showSaveButton && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Selected template: {selectedTemplate.displayName}</h3>
            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onResetSelection}>
              Change Template
            </Button>
            <Button variant="default" size="sm" onClick={onUseTemplatePrompt}>
              Use Default Prompt
            </Button>
          </div>
        </div>
      )}
      
      <AIPromptInput 
        onSubmit={onPromptSubmit} 
        isProcessing={isGenerating}
        onSaveCode={onSaveCode}
        showSaveButton={showSaveButton}
        onReportError={onReportError}
      />
      
      {errorMessage && (
        <ErrorMessage errorMessage={errorMessage} onDismiss={onDismissError} />
      )}
      
      {/* Added Snapshot and Revert buttons if needed */}
      {showSaveButton && (
        <div className="mt-2 flex gap-2">
          <Button variant="outline" size="sm" onClick={onSnapshot}>
            Create Snapshot
          </Button>
          <Button variant="outline" size="sm" onClick={onRevert}>
            Revert to Snapshot
          </Button>
        </div>
      )}
    </div>
  );
}
