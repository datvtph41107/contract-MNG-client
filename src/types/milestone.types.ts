export interface Milestone {
    id: number;
    title: string;
    description: string;
    type: string;
    dueDate: Date;
    priority: string;
    assignee: string;
    status: string;
    tasks: Task[];
    estimatedHours?: number;
    actualHours?: number;
    completionPercentage: number;
    dependencies?: number[];
    deliverables?: string[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    assignee: string;
    dueDate: Date;
    priority: string;
    estimatedHours: number;
    actualHours?: number;
    milestoneId: number;
    status: string;
    dependencies?: number[];
    tags?: string[];
}

export interface MilestoneFormData {
    title: string;
    description: string;
    type: string;
    dueDate: Date | null;
    priority: string;
    assignee: string;
    estimatedHours: number;
    deliverables: string[];
}

export interface TaskFormData {
    title: string;
    description: string;
    assignee: string;
    dueDate: Date | null;
    priority: string;
    estimatedHours: number;
    milestoneId: number;
    tags: string[];
}
