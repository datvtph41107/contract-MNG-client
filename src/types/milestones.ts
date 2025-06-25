export interface Milestone {
    id: number;
    title: string;
    description: string;
    type: "contract_signing" | "payment" | "delivery" | "acceptance" | "completion" | "custom";
    dueDate: Date;
    status: "pending" | "in_progress" | "completed" | "overdue";
    priority: "low" | "medium" | "high" | "critical";
    assignee: string;
    notificationDays: number[]; // [7, 5, 3, 1] - thông báo trước bao nhiêu ngày
    tasks: number[]; // IDs của tasks thuộc milestone này
    completedAt?: Date;
    notes?: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    assignee: string;
    dueDate: Date;
    status: "pending" | "in_progress" | "completed" | "overdue";
    priority: "low" | "medium" | "high" | "critical";
    milestoneId?: number; // ID của milestone chứa task này (optional)
    notificationDays: number[]; // [3, 1] - thông báo trước bao nhiêu ngày
    estimatedHours?: number;
    actualHours?: number;
    completedAt?: Date;
    notes?: string;
}

export interface Notification {
    id: number;
    type: "milestone" | "task";
    itemId: number;
    title: string;
    message: string;
    dueDate: Date;
    daysBefore: number;
    isRead: boolean;
    createdAt: Date;
}

export const milestoneTypes = [
    { value: "contract_signing", label: "Ký hợp đồng", icon: "📝", color: "#3498db" },
    { value: "payment", label: "Thanh toán", icon: "💰", color: "#e74c3c" },
    { value: "delivery", label: "Bàn giao", icon: "📦", color: "#f39c12" },
    { value: "acceptance", label: "Nghiệm thu", icon: "✅", color: "#27ae60" },
    { value: "completion", label: "Hoàn thành", icon: "🎯", color: "#9b59b6" },
    { value: "custom", label: "Tùy chỉnh", icon: "⚙️", color: "#95a5a6" },
];

export const priorityOptions = [
    { value: "low", label: "Thấp", color: "#95a5a6" },
    { value: "medium", label: "Trung bình", color: "#f39c12" },
    { value: "high", label: "Cao", color: "#e67e22" },
    { value: "critical", label: "Khẩn cấp", color: "#e74c3c" },
];

export const defaultNotificationDays = {
    milestone: [7, 5, 3, 1],
    task: [3, 1],
};
