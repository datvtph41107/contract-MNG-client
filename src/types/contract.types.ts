export interface ContractDraft {
    id: string;
    name: string;
    contractType: "basic" | "editor" | "upload";
    currentStage: number; // 1, 2, or 3
    completedStages: number[];
    stageValidation: Record<number, boolean>;

    // The actual form data based on contract type
    formData: ContractFormData;

    // Milestones (common for all types) - moved to formData level

    // Draft metadata
    thumbnail?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    isShared: boolean;
    version: number;
    lastAutoSave?: string;

    // Stage access control
    stageAccessHistory: number[];
    canNavigateToStage: Record<number, boolean>;
}

// Base contract form data
export interface BaseContractFormData {
    id?: string;
    name: string;
    contractCode: string;
    contractType: "employment" | "service" | "purchase" | "rental" | "partnership";
    drafter: string;
    manager: string;
    mode: "basic" | "editor" | "upload";
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };

    // Milestones data (Stage 2) - common for all contract types
    milestones: Milestone[];

    // Notification settings (Stage 2/3) - common for all contract types
    notificationSettings: NotificationSettings;

    createdAt?: string;
    updatedAt?: string;
    version?: number;
}

// Form-based contract data (basic mode)
export interface FormContractData extends BaseContractFormData {
    mode: "basic";
    details: {
        description: string;
        // Structured form fields based on contract type
        employmentDetails?: {
            position: string;
            salary: number;
            workingHours: string;
            benefits: string[];
            probationPeriod?: number;
        };
        serviceDetails?: {
            serviceType: string;
            deliverables: string[];
            paymentTerms: string;
            timeline: string;
        };
        purchaseDetails?: {
            items: Array<{
                name: string;
                quantity: number;
                unitPrice: number;
                total: number;
            }>;
            totalAmount: number;
            paymentMethod: string;
            deliveryTerms: string;
        };
        rentalDetails?: {
            propertyType: string;
            address: string;
            monthlyRent: number;
            deposit: number;
            utilities: string[];
            leaseTerm: number;
        };
        partnershipDetails?: {
            partnershipType: string;
            profitSharing: string;
            responsibilities: Record<string, string[]>;
            capitalContribution: Record<string, number>;
        };
    };
    // Template-based structured data from ContractContentRenderer
    structuredData: Record<string, unknown>;
}

// Editor-based contract data (editor mode with TipTap)
export interface EditorContractData extends BaseContractFormData {
    mode: "editor";
    editorContent: {
        // TipTap JSON content
        content: unknown;
        // HTML representation for preview
        html: string;
        // Plain text for search/indexing
        plainText: string;
        // Word count and other metadata
        metadata: {
            wordCount: number;
            characterCount: number;
            lastEditedAt: string;
            version: number;
        };
    };
    // Template information if created from template
    templateInfo?: {
        templateId: string;
        templateName: string;
        customizations: string[];
    };
}

// Upload-based contract data (upload mode)
export interface UploadContractData extends BaseContractFormData {
    mode: "upload";
    uploadedFile: {
        originalFileName: string;
        fileSize: number;
        fileType: string;
        uploadedAt: string;
        fileUrl: string;
        // Extracted content from uploaded file
        extractedContent?: {
            text: string;
            html?: string;
            metadata?: Record<string, unknown>;
        };
    };
    // Editor content if user edits the uploaded file
    editorContent?: EditorContractData["editorContent"];
}

// Union type for all contract data types
export type ContractFormData = FormContractData | EditorContractData | UploadContractData;

// Milestone and Task types (used in Stage 2)
export interface Milestone {
    id: string;
    name: string;
    description: string;
    dateRange: {
        startDate: string | null;
        endDate: string | null;
    };
    priority: "low" | "medium" | "high" | "critical";
    assignee: string;
    tasks: Task[];
}

export interface Task {
    id: string;
    name: string;
    description: string;
    assignee: string;
    timeRange: {
        startDate: string | null;
        endDate: string | null;
        estimatedHours: number;
    };
    completed: boolean;
}

// Form data types for milestone creation/editing
export interface MilestoneFormData {
    name: string;
    description: string;
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
    priority: "low" | "medium" | "high" | "critical";
    assignee: string;
    tasks?: Task[];
}

export interface TaskFormData {
    name: string;
    description: string;
    assignee: string;
    startDate: Date | null;
    endDate: Date | null;
    estimatedHours: number;
}

// Notification settings (Stage 2/3)
export interface NotificationSettings {
    contractNotifications: ContractNotification[];
    milestoneNotifications: MilestoneNotification[];
    taskNotifications: TaskNotification[];
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

export interface ContractNotification {
    id: string;
    type: "start" | "end" | "renewal" | "custom";
    message: string;
    triggerDate: string;
    recipients: string[];
    isActive: boolean;
}

export interface MilestoneNotification {
    id: string;
    milestoneId: string;
    type: "start" | "end" | "overdue" | "custom";
    message: string;
    triggerDate: string;
    recipients: string[];
    isActive: boolean;
}

export interface TaskNotification {
    id: string;
    taskId: string;
    type: "start" | "end" | "overdue" | "custom";
    message: string;
    triggerDate: string;
    recipients: string[];
    isActive: boolean;
}

// Contract state for store
export interface ContractState {
    formData: ContractFormData;
    currentStep: number;
    completedSteps: number[];
    isFormDirty: boolean;
    lastSavedAt: string | null;

    // Actions
    updateFormData: (data: Partial<ContractFormData>) => void;
    resetFormData: () => void;
    goToStep: (step: number) => void;
    markStepComplete: (step: number) => void;
    validateStep: (step: number) => boolean;
    nextStep: () => { success: boolean; step: number; error?: string };
    prevStep: () => { success: boolean; step: number };
    setStep1Data: (data: Partial<ContractFormData>) => void;
    setMilestones: (milestones: Milestone[]) => void;
    canAccessStep: (step: number) => boolean;
    getStepProgress: () => { completed: number; total: number; percentage: number; current: number };
    markFormClean: () => void;
    hasUnsavedChanges: () => boolean;
}

// Template types
export interface ContractTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    contractType: "basic" | "editor" | "upload";
    thumbnail?: string;
    // Template content varies by type
    content: FormContractData | EditorContractData | UploadContractData;
    createdAt: string;
    isPublic: boolean;
}

// Server payload types for API calls
export interface ContractDraftPayload {
    name: string;
    contractType: "basic" | "editor" | "upload";
    currentStage: number;
    completedStages: number[];
    stageValidation: Record<number, boolean>;
    formData: ContractFormData;
    stageAccessHistory: number[];
    canNavigateToStage: Record<number, boolean>;
    updatedAt: string;
    version?: number;
}

export interface MilestonePayload {
    milestones: Milestone[];
    stage: number;
    contractId: string;
    updatedAt: string;
}
