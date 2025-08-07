// Field types for custom template
export type FieldType =
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "phone"
    | "date"
    | "dateRange"
    | "select"
    | "multiSelect"
    | "checkbox"
    | "radio"
    | "file"
    | "currency"
    | "percentage"
    | "url";

export interface FieldOption {
    value: string;
    label: string;
    description?: string;
}

export interface CustomField {
    id: string;
    name: string; // Field name for form
    label: string; // Display label
    type: FieldType;
    required: boolean;
    placeholder?: string;
    description?: string;
    defaultValue?: unknown;

    // Validation rules
    validation?: {
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        customMessage?: string;
    };

    // Options for select/radio/checkbox
    options?: FieldOption[];

    // Conditional display
    conditional?: {
        dependsOn: string; // Field name this depends on
        condition: "equals" | "notEquals" | "contains" | "notContains";
        value: unknown;
    };

    // Layout
    width?: "full" | "half" | "third" | "quarter";
    order: number;
    section?: string; // Group fields into sections
}

export interface ContractTypeTemplate {
    id: string;
    name: string;
    description: string;
    contractType: "employment" | "service" | "purchase" | "rental" | "partnership" | "custom";

    // Custom fields for this template
    customFields: CustomField[];

    // Template metadata
    isDefault: boolean;
    isPublic: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;

    // Usage statistics
    usageCount: number;
    lastUsed?: string;

    // Template settings
    settings: {
        allowFieldModification: boolean;
        requireAllFields: boolean;
        autoGenerateCode: boolean;
        codePrefix?: string;
    };
}

export interface TemplateSection {
    id: string;
    name: string;
    description?: string;
    order: number;
    collapsible: boolean;
    defaultExpanded: boolean;
}

// Form data structure for templates
export interface TemplateFormData {
    [fieldName: string]: unknown;
}

// Template usage tracking
export interface TemplateUsage {
    templateId: string;
    contractId: string;
    userId: string;
    usedAt: string;
    formData: TemplateFormData;
}
