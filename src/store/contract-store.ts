import { create } from "zustand";
import type { ContractFormData, ContractState } from "~/types/contract.types";

const defaultState: ContractFormData = {
    title: "",
    contractCode: "",
    contractType: "employment",
    mode: "basic",
    creationDate: new Date().toISOString(),
    dateRange: { startDate: null, endDate: null },
    details: { description: "" },
    structuredData: {},
    milestones: [],
};

export const useContractStore = create<ContractState>((set, get) => ({
    formData: defaultState,
    currentStep: 1,
    completedSteps: [],

    updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

    resetFormData: () => set({ formData: defaultState, currentStep: 1, completedSteps: [] }),

    goToStep: (step) => set({ currentStep: step }),

    markStepComplete: (step) =>
        set((state) => ({
            completedSteps: Array.from(new Set([...state.completedSteps, step])),
        })),

    validateStep: (step) => {
        const { formData } = get();
        switch (step) {
            case 1:
                return true;
                return Boolean(formData.title && formData.contractType && formData.details.description);
            case 2:
                return true;
            // return formData.milestones.length > 0;
            case 3:
                return true;
            default:
                return false;
        }
    },
}));
