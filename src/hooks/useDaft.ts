import { useCallback, useEffect, useRef } from "react";
import { useDraftStore } from "~/store/contract-draft-store";
import { useContractStore } from "~/store/contract-store";
import type { ContractFormData } from "~/types/contract.types";
import type { CreateDraftRequest } from "~/types/draft.types";

export const useDraftManager = () => {
    const {
        drafts,
        templates,
        currentDraft,
        loading,
        error,
        loadDrafts,
        loadTemplates,
        createDraft,
        updateDraft,
        deleteDraft,
        duplicateDraft,
        setCurrentDraft,
        autoSaveDraft,
        clearError,
    } = useDraftStore();

    const { formData, updateFormData } = useContractStore();
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

    // Auto-save functionality
    const scheduleAutoSave = useCallback(
        (draftId: string, data: ContractFormData) => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            autoSaveTimeoutRef.current = setTimeout(() => {
                autoSaveDraft(draftId, data);
            }, 2000); // Auto-save after 2 seconds of inactivity
        },
        [autoSaveDraft],
    );

    // Save draft manually
    const saveDraft = useCallback(
        async (name?: string, description?: string) => {
            try {
                if (currentDraft) {
                    // Update existing draft
                    await updateDraft(currentDraft.id, {
                        name: name || currentDraft.name,
                        description,
                        formData,
                    });
                } else {
                    // Create new draft
                    const draftData: CreateDraftRequest = {
                        name: name || `Bản nháp ${new Date().toLocaleDateString()}`,
                        contractType: formData.contractType,
                        mode: formData.mode,
                        formData,
                        description,
                    };
                    const draft = await createDraft(draftData);
                    setCurrentDraft(draft);
                }
            } catch (error) {
                console.error("Save draft failed:", error);
                throw error;
            }
        },
        [currentDraft, formData, createDraft, updateDraft, setCurrentDraft],
    );

    // Load draft and populate form
    const loadDraft = useCallback(
        async (draftId: string) => {
            try {
                const draft = drafts.find((d) => d.id === draftId);
                if (draft) {
                    setCurrentDraft(draft);
                    updateFormData(draft.formData);
                }
            } catch (error) {
                console.error("Load draft failed:", error);
                throw error;
            }
        },
        [drafts, setCurrentDraft, updateFormData],
    );

    // Load template and populate form
    const loadTemplate = useCallback(
        async (templateId: string) => {
            try {
                const template = templates.find((t) => t.id === templateId);
                if (template) {
                    updateFormData(template.formData);
                    // Create a new draft based on template
                    const draftData: CreateDraftRequest = {
                        name: `${template.name} - ${new Date().toLocaleDateString()}`,
                        contractType: template.contractType,
                        mode: template.mode,
                        formData: template.formData as ContractFormData,
                        templateId: template.id,
                    };
                    const draft = await createDraft(draftData);
                    setCurrentDraft(draft);
                }
            } catch (error) {
                console.error("Load template failed:", error);
                throw error;
            }
        },
        [templates, updateFormData, createDraft, setCurrentDraft],
    );

    // Auto-save when form data changes
    useEffect(() => {
        if (currentDraft && formData) {
            scheduleAutoSave(currentDraft.id, formData);
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [currentDraft, formData, scheduleAutoSave]);

    return {
        // State
        drafts,
        templates,
        currentDraft,
        loading,
        error,

        // Actions
        loadDrafts,
        loadTemplates,
        saveDraft,
        loadDraft,
        loadTemplate,
        deleteDraft,
        duplicateDraft,
        clearError,

        // Utils
        isAutoSaving: !!autoSaveTimeoutRef.current,
    };
};
