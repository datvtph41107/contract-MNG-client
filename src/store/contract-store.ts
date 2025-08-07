import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ContractFormData, ContractState } from "~/types/contract.types";

const defaultState: ContractFormData = {
    name: "",
    contractCode: "",
    contractType: "employment",
    drafter: "",
    manager: "",
    mode: "basic",
    dateRange: { startDate: null, endDate: null },
    details: { description: "" },
    structuredData: {},
    milestones: [], // Initialize empty milestones array
    notificationSettings: {
        contractNotifications: [],
        milestoneNotifications: [],
        taskNotifications: [],
        globalSettings: {
            enableEmailNotifications: true,
            enableSMSNotifications: false,
            enableInAppNotifications: true,
            enablePushNotifications: true,
            defaultRecipients: [],
            workingHours: {
                start: "09:00",
                end: "17:00",
                timezone: "Asia/Ho_Chi_Minh",
            },
        },
    },
};

export const useContractStore = create<ContractState>()(
    persist(
        (set, get) => ({
            // State
            formData: defaultState,
            currentStep: 1,
            completedSteps: [],
            isFormDirty: false,
            lastSavedAt: null,

            // Basic actions
            updateFormData: (data) => {
                console.log("📝 Updating form data:", data);
                set((state) => ({
                    formData: { ...state.formData, ...data },
                    isFormDirty: true,
                    lastSavedAt: new Date().toISOString(),
                }));
            },

            resetFormData: () => {
                console.log("🔄 Resetting form data");
                set({
                    formData: defaultState,
                    currentStep: 1,
                    completedSteps: [],
                    isFormDirty: false,
                    lastSavedAt: null,
                });
            },

            // Step navigation
            goToStep: (step) => {
                console.log(`🚀 Going to step: ${step}`);
                set({ currentStep: step });
            },

            markStepComplete: (step) => {
                console.log(`✅ Marking step ${step} as complete`);
                set((state) => ({
                    completedSteps: Array.from(new Set([...state.completedSteps, step])),
                }));
            },

            // Enhanced validation with milestone support
            validateStep: (step) => {
                const { formData } = get();
                console.log(`🔍 Validating step ${step}:`, formData);

                const validations: Record<number, () => boolean> = {
                    1: () => {
                        // Basic contract info validation
                        const isValid = !!(
                            formData.name?.trim() &&
                            formData.contractType &&
                            formData.drafter?.trim() &&
                            formData.manager?.trim()
                        );

                        // Additional validation based on mode
                        if (formData.mode === "basic") {
                            const basicData = formData as any;
                            return isValid && !!basicData.details?.description?.trim();
                        } else if (formData.mode === "editor") {
                            const editorData = formData as any;
                            return isValid && !!editorData.editorContent?.plainText?.trim();
                        } else if (formData.mode === "upload") {
                            const uploadData = formData as any;
                            return isValid && !!uploadData.uploadedFile?.fileUrl;
                        }

                        console.log(`Step 1 validation result: ${isValid}`);
                        return isValid;
                    },

                    2: () => {
                        // Milestones validation
                        const isValid =
                            formData.milestones.length > 0 &&
                            formData.milestones.every(
                                (milestone) =>
                                    milestone.name?.trim() &&
                                    milestone.description?.trim() &&
                                    milestone.priority &&
                                    milestone.assignee?.trim() &&
                                    milestone.dateRange.startDate &&
                                    milestone.dateRange.endDate,
                            );
                        console.log(`Step 2 validation result: ${isValid}, Milestones count: ${formData.milestones.length}`);
                        return isValid;
                    },

                    3: () => {
                        // Preview step - validate all previous steps are complete
                        const step1Valid = validations[1]();
                        const step2Valid = validations[2]();
                        const isValid = step1Valid && step2Valid;
                        console.log(`Step 3 validation - step1: ${step1Valid}, step2: ${step2Valid}, result: ${isValid}`);
                        return isValid;
                    },
                };

                return validations[step]?.() ?? false;
            },

            // Enhanced step navigation with validation
            nextStep: () => {
                const { currentStep, validateStep, markStepComplete } = get();
                console.log(`⏭️ Attempting to go to next step from ${currentStep}`);

                if (validateStep(currentStep)) {
                    markStepComplete(currentStep);
                    const nextStep = Math.min(currentStep + 1, 3); // Max 3 steps
                    set({ currentStep: nextStep });
                    console.log(`✅ Successfully moved to step ${nextStep}`);
                    return { success: true, step: nextStep };
                } else {
                    console.log(`❌ Validation failed for step ${currentStep}`);
                    return { success: false, step: currentStep, error: "Validation failed" };
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                console.log(`⏮️ Going to previous step from ${currentStep}`);

                if (currentStep > 1) {
                    const prevStep = currentStep - 1;
                    set({ currentStep: prevStep });
                    console.log(`✅ Successfully moved to step ${prevStep}`);
                    return { success: true, step: prevStep };
                }
                return { success: false, step: currentStep };
            },

            // Specific data setters
            setStep1Data: (data) => {
                console.log("📋 Setting step 1 data:", data);
                set((state) => ({
                    formData: { ...state.formData, ...data },
                    isFormDirty: true,
                    lastSavedAt: new Date().toISOString(),
                }));
            },

            setMilestones: (milestones) => {
                console.log("🎯 Setting milestones:", milestones);
                set((state) => ({
                    formData: { ...state.formData, milestones },
                    isFormDirty: true,
                    lastSavedAt: new Date().toISOString(),
                }));
            },

            // Utility methods
            canAccessStep: (step) => {
                const { completedSteps, validateStep } = get();

                // Can always access step 1
                if (step === 1) return true;

                // For other steps, check if all previous steps are completed or valid
                for (let i = 1; i < step; i++) {
                    if (!completedSteps.includes(i) && !validateStep(i)) {
                        return false;
                    }
                }
                return true;
            },

            getStepProgress: () => {
                const { completedSteps, currentStep } = get();
                const totalSteps = 3;
                const progress = (completedSteps.length / totalSteps) * 100;
                return {
                    completed: completedSteps.length,
                    total: totalSteps,
                    percentage: Math.round(progress),
                    current: currentStep,
                };
            },

            // Form state management
            markFormClean: () => {
                set({ isFormDirty: false });
            },

            hasUnsavedChanges: () => {
                const { isFormDirty } = get();
                return isFormDirty;
            },
        }),
        {
            name: "contract-form-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                formData: state.formData,
                currentStep: state.currentStep,
                completedSteps: state.completedSteps,
                lastSavedAt: state.lastSavedAt,
            }),
            version: 1,
            migrate: (persistedState: any, version) => {
                console.log("🔄 Migrating persisted state from version", version);
                // Ensure milestones array exists in migrated data
                if (persistedState.formData && !persistedState.formData.milestones) {
                    persistedState.formData.milestones = [];
                }
                return persistedState;
            },
        },
    ),
);
