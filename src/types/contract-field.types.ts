export interface ContractField {
    id: string;
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "date" | "select" | "checkbox" | "radio" | "file";
    required: boolean;
    placeholder?: string;
    description?: string;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
    options?: Array<{
        value: string;
        label: string;
    }>;
    defaultValue?: any;
    order: number;
}

export interface CustomContractType {
    id: string;
    name: string;
    label: string;
    description: string;
    icon: string;
    fields: ContractField[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ContractTypeStore {
    customTypes: CustomContractType[];
    addCustomType: (type: Omit<CustomContractType, "id" | "createdAt" | "updatedAt">) => void;
    updateCustomType: (id: string, type: Partial<CustomContractType>) => void;
    deleteCustomType: (id: string) => void;
    getCustomType: (id: string) => CustomContractType | undefined;
}
