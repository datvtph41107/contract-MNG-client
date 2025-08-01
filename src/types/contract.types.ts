export type ContractMode = "basic" | "editor" | "upload";
export type ContractType = "employment" | "service" | "partnership" | "rental" | "consulting" | "training" | "nda";

export interface DateRange {
    startDate: string | null;
    endDate: string | null;
}

export interface TimeRange {
    startDate: string | null;
    endDate: string | null;
    estimatedHours: number;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    assignee: string;
    timeRange: TimeRange;
    completed?: boolean;
}

export interface Milestone {
    id: string;
    name: string;
    description: string;
    dateRange: DateRange;
    priority: "low" | "medium" | "high" | "critical";
    assignee: string;
    tasks: Task[];
}

export interface NotificationSettings {
    contractNotifications: string[];
    milestoneNotifications: string[];
    taskNotifications: string[];
    globalSettings: {
        enableEmailNotifications: boolean;
        enableSMSNotifications: boolean;
        enableInAppNotifications: boolean;
        enablePushNotifications: boolean;
        defaultRecipients: string[];
        workingHours: {
            start: string;
            end: string;
            timezone: string;
        };
    };
}

export interface ContractFormData {
    contractCode: string;
    contractType: ContractType;
    dateRange: DateRange;
    details: {
        description: string;
        department?: string;
        vendorName?: string;
        contractValue?: number;
    };
    drafter: string;
    manager: string;
    milestones: Milestone[];
    mode: ContractMode;
    name: string;
    notificationSettings: NotificationSettings;
    structuredData: Record<string, any>;
}

export interface MilestoneFormData {
    name: string;
    description: string;
    dateRange: DateRange;
    priority: "low" | "medium" | "high" | "critical";
    assignee: string;
    tasks: TaskFormData[];
}

export interface TaskFormData {
    id?: string;
    name: string;
    description: string;
    assignee: string;
    timeRange: TimeRange;
}

export interface StepNavigationResult {
    success: boolean;
    step: number;
    message?: string;
    error?: string;
}

export interface FormProgress {
    completed: number;
    total: number;
    percentage: number;
    current: number;
}

export interface ContractState {
    // Data
    formData: ContractFormData;
    currentStep: number;
    completedSteps: number[];
    isFormDirty: boolean;
    lastSavedAt: string | null;

    // Basic actions
    updateFormData: (data: Partial<ContractFormData>) => void;
    resetFormData: () => void;

    // Step navigation
    goToStep: (step: number) => void;
    markStepComplete: (step: number) => void;
    nextStep: () => StepNavigationResult;
    prevStep: () => StepNavigationResult;

    // Validation
    validateStep: (step: number) => boolean;

    // Specific data setters
    setStep1Data: (data: Partial<ContractFormData>) => void;
    setMilestones: (milestones: Milestone[]) => void;

    // Utility methods
    canAccessStep: (step: number) => boolean;
    getStepProgress: () => FormProgress;
    markFormClean: () => void;
    hasUnsavedChanges: () => boolean;
}
