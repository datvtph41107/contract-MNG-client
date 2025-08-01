import { useEffect, useCallback } from "react";
import { useContractStore } from "~/store/contract-store";
import type { ContractFormData, Milestone } from "~/types/contract.types";

export const useContractForm = () => {
    const {
        formData,
        currentStep,
        completedSteps,
        isFormDirty,
        lastSavedAt,
        updateFormData,
        goToStep,
        nextStep,
        prevStep,
        validateStep,
        canAccessStep,
        getStepProgress,
        setStep1Data,
        setMilestones,
        markFormClean,
        hasUnsavedChanges,
    } = useContractStore();

    // Auto-save functionality
    useEffect(() => {
        if (isFormDirty) {
            const autoSaveTimer = setTimeout(() => {
                console.log("💾 Auto-saving form data...");
                markFormClean();
            }, 2000); // Auto-save after 2 seconds of inactivity

            return () => clearTimeout(autoSaveTimer);
        }
    }, [isFormDirty, markFormClean]);

    // Navigation with validation
    const handleNextStep = useCallback(() => {
        const result = nextStep();
        if (!result.success) {
            // Handle validation error
            console.error("Cannot proceed to next step:", result.error);
            return {
                success: false,
                message: "Vui lòng hoàn thành tất cả thông tin bắt buộc trước khi tiếp tục.",
            };
        }
        return { success: true, step: result.step };
    }, [nextStep]);

    const handlePrevStep = useCallback(() => {
        const result = prevStep();
        return { success: result.success, step: result.step };
    }, [prevStep]);

    const handleJumpToStep = useCallback(
        (step: number) => {
            if (canAccessStep(step)) {
                goToStep(step);
                return { success: true, step };
            }
            return {
                success: false,
                message: `Không thể truy cập bước ${step}. Vui lòng hoàn thành các bước trước đó.`,
            };
        },
        [canAccessStep, goToStep],
    );

    // Form data helpers
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
        nextStep: handleNextStep,
        prevStep: handlePrevStep,
        jumpToStep: handleJumpToStep,
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
    };
};
