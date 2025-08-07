import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useContractStore } from "~/store/contract-store";
import { useDraftStore } from "~/store/contract-draft-store";
import type { ContractFormData, Milestone } from "~/types/contract.types";

export const useContractForm = () => {
    const navigate = useNavigate();

    const {
        formData,
        currentStep,
        completedSteps,
        isFormDirty,
        lastSavedAt,
        updateFormData,
        goToStep,
        nextStep: storeNextStep,
        prevStep: storePrevStep,
        validateStep,
        canAccessStep,
        getStepProgress,
        setStep1Data,
        setMilestones,
        markFormClean,
        hasUnsavedChanges,
        saveAsDraft,
        getCurrentDraftId,
        loadFromDraft,
    } = useContractStore();

    const { currentDraft, setCurrentDraft } = useDraftStore();

    // Auto-save functionality
    useEffect(() => {
        if (isFormDirty && getCurrentDraftId()) {
            const autoSaveTimer = setTimeout(async () => {
                try {
                    console.log("💾 Auto-saving form data...");
                    await saveAsDraft();
                    console.log("✅ Auto-save completed");
                } catch (error) {
                    console.error("❌ Auto-save failed:", error);
                }
            }, 3000); // Auto-save after 3 seconds of inactivity

            return () => clearTimeout(autoSaveTimer);
        }
    }, [isFormDirty, saveAsDraft, getCurrentDraftId]);

    // Load draft data on mount if coming from collection
    useEffect(() => {
        if (currentDraft && !formData.name) {
            loadFromDraft(currentDraft.id);
        }
    }, [currentDraft, formData.name, loadFromDraft]);

    // Navigation with validation and URL updates
    const nextStep = useCallback(() => {
        const result = storeNextStep();
        if (result.success) {
            navigate(`/page/create/daft?stage=${result.step}`);
        }
        return result;
    }, [storeNextStep, navigate]);

    const prevStep = useCallback(() => {
        const result = storePrevStep();
        if (result.success) {
            navigate(`/page/create/daft?stage=${result.step}`);
        }
        return result;
    }, [storePrevStep, navigate]);

    const jumpToStep = useCallback(
        (step: number) => {
            if (canAccessStep(step)) {
                goToStep(step);
                navigate(`/page/create/daft?stage=${step}`);
                return { success: true, step };
            }
            return {
                success: false,
                message: `Không thể truy cập bước ${step}. Vui lòng hoàn thành các bước trước đó.`,
            };
        },
        [canAccessStep, goToStep, navigate],
    );

    // Form data helpers with auto-save trigger
    const updateStep1Data = useCallback(
        (data: Partial<ContractFormData>) => {
            setStep1Data(data);
        },
        [setStep1Data],
    );

    const updateMilestones = useCallback(
        (milestones: Milestone[]) => {
            setMilestones(milestones);
        },
        [setMilestones],
    );

    // Manual save as draft
    const saveCurrentAsDraft = useCallback(
        async (name?: string) => {
            try {
                const draftId = await saveAsDraft(name);

                // Update current draft in draft store
                if (!currentDraft) {
                    // If no current draft, we need to fetch the created draft
                    // This would typically be handled by the draft store
                    console.log("Draft saved with ID:", draftId);
                }

                return { success: true, draftId };
            } catch (error) {
                console.error("Failed to save as draft:", error);
                return { success: false, error: "Không thể lưu bản nháp" };
            }
        },
        [saveAsDraft, currentDraft],
    );

    // Progress tracking
    const progress = getStepProgress();

    return {
        // Form data
        formData,

        // Navigation state
        currentStep,
        completedSteps,
        progress,

        // Form state
        isFormDirty,
        lastSavedAt,
        hasUnsavedChanges: hasUnsavedChanges(),

        // Navigation methods
        nextStep,
        prevStep,
        jumpToStep,
        canAccessStep,

        // Data update methods
        updateFormData,
        updateStep1Data,
        updateMilestones,

        // Validation
        validateStep,

        // Utility
        getFormattedLastSaved: () => {
            if (!lastSavedAt) return null;
            return new Date(lastSavedAt).toLocaleString("vi-VN");
        },

        // Draft integration
        saveCurrentAsDraft,
        currentDraftId: getCurrentDraftId(),
        currentDraft,
    };
};
