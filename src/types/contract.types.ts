export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

export interface ContractFormData {
    // Contract Management
    contractCode: string;

    // General Information
    title: string;
    contractType: string;
    creationDate: string;
    drafter: string;
    contractManager: string;

    // Contract Content
    description: string;
    startDate: string;
    endDate: string;

    // Type-specific fields
    [key: string]: any;
}

export interface Option {
    value: string;
    label: string;
    icon?: string;
}
