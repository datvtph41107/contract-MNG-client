import { useContractStore } from "~/store/contract-store";
import type { ContractFormData, Milestone } from "~/types/contract.types";

export const useContractForm = () => {
    const { formData, currentStep, completedSteps, updateFormData, goToStep, markStepComplete, validateStep } = useContractStore();

    const setStep1Data = (data: Partial<ContractFormData>) => updateFormData(data);
    const setMilestones = (milestones: Milestone[]) => updateFormData({ milestones });

    const nextStep = () => {
        if (validateStep(currentStep)) {
            markStepComplete(currentStep);
            goToStep(currentStep + 1);
        } else {
            alert("Thông tin chưa hợp lệ, vui lòng kiểm tra lại.");
        }
    };

    const prevStep = () => {
        if (currentStep > 1) goToStep(currentStep - 1);
    };

    const handleSubmit = () => {
        const payload = {
            ...formData,
            dateRange: {
                startDate: formData.dateRange.startDate?.toISOString(),
                endDate: formData.dateRange.endDate?.toISOString(),
            },
        };
        console.log("Submit payload", payload);
    };

    return {
        formData,
        currentStep,
        completedSteps,
        setStep1Data,
        setMilestones,
        goToStep,
        nextStep,
        prevStep,
        validateStep,
        handleSubmit,
    };
};
