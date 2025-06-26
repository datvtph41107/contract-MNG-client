export type ContractMode = "basic" | "editor" | "upload";
export type ContractType = "employment" | "service" | "partnership" | "rental" | "consulting" | "training" | "nda";

export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    tasks: string[];
}

export interface ContractFormData {
    id?: string;
    contractCode: string;
    title: string;
    contractType: ContractType;
    mode: ContractMode;
    creationDate: string;
    dateRange: DateRange;
    details: {
        department?: string;
        vendorName?: string;
        contractValue?: number;
        description: string;
    };
    structuredData?: unknown; // varies per contractType
    milestones: Milestone[];
}

export interface ContractState {
    formData: ContractFormData;
    currentStep: number;
    completedSteps: number[];

    updateFormData: (data: Partial<ContractFormData>) => void;
    resetFormData: () => void;

    goToStep: (step: number) => void;
    validateStep: (step: number) => boolean;
    markStepComplete: (step: number) => void;
}

export interface FileAttachment {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: Date;
}
