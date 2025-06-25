"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Milestone, Task, Notification } from "../types/milestones";

export interface ContractParty {
    name: string;
    taxCode: string;
    representative: string;
    position: string;
    address: string;
    phone: string;
    email: string;
}

export interface Deliverable {
    id: number;
    text: string;
    completed: boolean;
}

export interface AttachedFile {
    id: number;
    name: string;
    size: string;
    type: string;
}

export const useContractForm = () => {
    // Sections state
    const [expandedSections, setExpandedSections] = useState({
        general: true,
        parties: false,
        content: true,
        milestones: false,
        tasks: false,
        attachments: false,
        security: false,
    });

    // General info
    const [contractCode] = useState("HD-2025-001");
    const [contractName, setContractName] = useState("Hợp đồng cung cấp dịch vụ kế toán quý 3/2025");
    const [contractType, setContractType] = useState("Dịch vụ");
    const [currentUser] = useState("Nguyễn Văn A - Phòng Kế toán");
    const [manager, setManager] = useState("Trần Thị B - Phòng Kinh doanh");

    // Dates
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Content
    const [projectDescription, setProjectDescription] = useState("Nhà thầu sẽ cung cấp các dịch vụ sau cho Khách hàng:");
    const [contractValue, setContractValue] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Chuyển khoản");
    const [paymentSchedule, setPaymentSchedule] = useState("Thanh toán theo tiến độ");
    const [acceptanceConditions, setAcceptanceConditions] = useState("");

    // Parties
    const [partyA, setPartyA] = useState<ContractParty>({
        name: "Công ty TNHH ABC",
        taxCode: "0123456789",
        representative: "Nguyễn Văn A",
        position: "Giám đốc",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        phone: "0901234567",
        email: "contact@abc.com",
    });

    const [partyB, setPartyB] = useState<ContractParty>({
        name: "",
        taxCode: "",
        representative: "",
        position: "",
        address: "",
        phone: "",
        email: "",
    });

    // Lists
    const [deliverables, setDeliverables] = useState<Deliverable[]>([
        {
            id: 1,
            text: "Dịch vụ xây dựng thương hiệu, bao gồm tư vấn chiến lược thương hiệu, thiết kế logo, hướng dẫn thương hiệu và các tài liệu thương hiệu khác theo thỏa thuận của cả hai bên.",
            completed: false,
        },
        {
            id: 2,
            text: "Dịch vụ thiết kế web, bao gồm thiết kế và phát triển website mới cho Khách hàng.",
            completed: false,
        },
    ]);

    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

    // Milestones & Tasks - Updated structure
    const [milestones, setMilestones] = useState<Milestone[]>([
        {
            id: 1,
            title: "Giai đoạn 1: Ký kết hợp đồng",
            description: "Hoàn tất thủ tục ký kết hợp đồng với khách hàng và chuẩn bị các tài liệu pháp lý",
            type: "contract_signing",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "high",
            assignee: "Nguyễn Văn A - Phòng Kế toán",
            notificationDays: [7, 5, 3, 1],
            tasks: [1, 2, 3],
        },
        {
            id: 2,
            title: "Giai đoạn 2: Triển khai dự án",
            description: "Bắt đầu triển khai các công việc chính của dự án",
            type: "delivery",
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "high",
            assignee: "Trần Thị B - Phòng Kinh doanh",
            notificationDays: [7, 5, 3, 1],
            tasks: [4, 5],
        },
        {
            id: 3,
            title: "Giai đoạn 3: Thanh toán đợt 1",
            description: "Nhận thanh toán 50% giá trị hợp đồng sau khi hoàn thành giai đoạn 1",
            type: "payment",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "critical",
            assignee: "Phạm Thị D - Phòng Tài chính",
            notificationDays: [7, 5, 3, 1],
            tasks: [6],
        },
        {
            id: 4,
            title: "Giai đoạn 4: Nghiệm thu và bàn giao",
            description: "Nghiệm thu sản phẩm cuối cùng và bàn giao cho khách hàng",
            type: "acceptance",
            dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "high",
            assignee: "Lê Văn C - Phòng Pháp chế",
            notificationDays: [7, 5, 3, 1],
            tasks: [7, 8],
        },
    ]);

    const [tasks, setTasks] = useState<Task[]>([
        // Giai đoạn 1: Ký kết hợp đồng
        {
            id: 1,
            title: "Chuẩn bị hồ sơ pháp lý",
            description: "Soạn thảo và kiểm tra các giấy tờ pháp lý cần thiết cho việc ký kết",
            assignee: "Lê Văn C - Phòng Pháp chế",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "high",
            milestoneId: 1,
            notificationDays: [3, 1],
            estimatedHours: 8,
        },
        {
            id: 2,
            title: "Lên lịch họp ký kết",
            description: "Sắp xếp thời gian và địa điểm ký kết với khách hàng",
            assignee: "Nguyễn Văn A - Phòng Kế toán",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "medium",
            milestoneId: 1,
            notificationDays: [3, 1],
            estimatedHours: 2,
        },
        {
            id: 3,
            title: "Kiểm tra điều khoản hợp đồng",
            description: "Review lại tất cả điều khoản trong hợp đồng trước khi ký",
            assignee: "Trần Thị B - Phòng Kinh doanh",
            dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "high",
            milestoneId: 1,
            notificationDays: [3, 1],
            estimatedHours: 4,
        },
        // Giai đoạn 2: Triển khai dự án
        {
            id: 4,
            title: "Khởi động dự án",
            description: "Tổ chức meeting kick-off và phân công nhiệm vụ cho team",
            assignee: "Nguyễn Văn A - Phòng Kế toán",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "high",
            milestoneId: 2,
            notificationDays: [3, 1],
            estimatedHours: 4,
        },
        {
            id: 5,
            title: "Thiết lập môi trường làm việc",
            description: "Chuẩn bị tools, tài khoản và môi trường cần thiết cho dự án",
            assignee: "Hoàng Văn E - Phòng Kinh doanh",
            dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "medium",
            milestoneId: 2,
            notificationDays: [3, 1],
            estimatedHours: 6,
        },
        // Giai đoạn 3: Thanh toán đợt 1
        {
            id: 6,
            title: "Lập hóa đơn thanh toán",
            description: "Tạo hóa đơn và gửi yêu cầu thanh toán cho khách hàng",
            assignee: "Phạm Thị D - Phòng Tài chính",
            dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "critical",
            milestoneId: 3,
            notificationDays: [3, 1],
            estimatedHours: 3,
        },
        // Giai đoạn 4: Nghiệm thu và bàn giao
        {
            id: 7,
            title: "Chuẩn bị tài liệu nghiệm thu",
            description: "Soạn thảo checklist và tài liệu cần thiết cho việc nghiệm thu",
            assignee: "Lê Văn C - Phòng Pháp chế",
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "high",
            milestoneId: 4,
            notificationDays: [3, 1],
            estimatedHours: 6,
        },
        {
            id: 8,
            title: "Tổ chức buổi bàn giao",
            description: "Lên lịch và tổ chức buổi bàn giao chính thức với khách hàng",
            assignee: "Nguyễn Văn A - Phòng Kế toán",
            dueDate: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000),
            status: "pending",
            priority: "high",
            milestoneId: 4,
            notificationDays: [3, 1],
            estimatedHours: 4,
        },
    ]);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Security
    const [version, setVersion] = useState("Draft v1.0");
    const [internalNotes, setInternalNotes] = useState("");

    // Helper functions
    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleDateChange = (newStartDate: Date | null, newEndDate: Date | null) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/[^\d]/g, "");
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleContractValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContractValue(formatCurrency(e.target.value));
    };

    // File upload functions
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const newFile: AttachedFile = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                    type: file.type,
                };
                setAttachedFiles((prev) => [...prev, newFile]);
            });
        }
    };

    const removeFile = (id: number) => {
        setAttachedFiles(attachedFiles.filter((file) => file.id !== id));
    };

    // Milestone functions
    const addMilestone = (milestone: Omit<Milestone, "id">) => {
        const newMilestone: Milestone = {
            ...milestone,
            id: Date.now(),
            tasks: [], // New milestones start with no tasks
        };
        setMilestones((prev) => [...prev, newMilestone]);
    };

    const updateMilestone = (id: number, updates: Partial<Milestone>) => {
        setMilestones((prev) => prev.map((milestone) => (milestone.id === id ? { ...milestone, ...updates } : milestone)));
    };

    const removeMilestone = (id: number) => {
        // Remove milestone
        setMilestones((prev) => prev.filter((milestone) => milestone.id !== id));
        // Remove all tasks associated with this milestone
        setTasks((prev) => prev.filter((task) => task.milestoneId !== id));
    };

    // Task functions - Updated to always require milestoneId
    const addTask = (task: Omit<Task, "id"> & { milestoneId: number }) => {
        const newTask: Task = {
            ...task,
            id: Date.now(),
        };
        setTasks((prev) => [...prev, newTask]);

        // Add task to milestone's tasks array
        updateMilestone(task.milestoneId, {
            tasks: [...(milestones.find((m) => m.id === task.milestoneId)?.tasks || []), newTask.id],
        });
    };

    const updateTask = (id: number, updates: Partial<Task>) => {
        const currentTask = tasks.find((t) => t.id === id);
        const updatedTask = { ...currentTask, ...updates } as Task;

        setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));

        // If milestone changed, update both old and new milestones
        if (updates.milestoneId && currentTask?.milestoneId !== updates.milestoneId) {
            // Remove from old milestone
            if (currentTask?.milestoneId) {
                updateMilestone(currentTask.milestoneId, {
                    tasks: milestones.find((m) => m.id === currentTask.milestoneId)?.tasks.filter((taskId) => taskId !== id) || [],
                });
            }
            // Add to new milestone
            updateMilestone(updates.milestoneId, {
                tasks: [...(milestones.find((m) => m.id === updates.milestoneId)?.tasks || []), id],
            });
        }
    };

    const removeTask = (id: number) => {
        const task = tasks.find((t) => t.id === id);
        setTasks((prev) => prev.filter((task) => task.id !== id));

        // Remove task from milestone
        if (task?.milestoneId) {
            updateMilestone(task.milestoneId, {
                tasks: milestones.find((m) => m.id === task.milestoneId)?.tasks.filter((taskId) => taskId !== id) || [],
            });
        }
    };

    // Notification functions
    const generateNotifications = () => {
        const now = new Date();
        const newNotifications: Notification[] = [];

        // Generate milestone notifications
        milestones.forEach((milestone) => {
            if (milestone.status !== "completed") {
                milestone.notificationDays.forEach((days) => {
                    const notificationDate = new Date(milestone.dueDate);
                    notificationDate.setDate(notificationDate.getDate() - days);

                    if (notificationDate <= now && milestone.dueDate > now) {
                        newNotifications.push({
                            id: Date.now() + Math.random(),
                            type: "milestone",
                            itemId: milestone.id,
                            title: `Mốc thời gian sắp đến hạn`,
                            message: `"${milestone.title}" sẽ đến hạn trong ${days} ngày (${milestone.dueDate.toLocaleDateString(
                                "vi-VN",
                            )})`,
                            dueDate: milestone.dueDate,
                            daysBefore: days,
                            isRead: false,
                            createdAt: now,
                        });
                    }
                });
            }
        });

        // Generate task notifications
        tasks.forEach((task) => {
            if (task.status !== "completed") {
                task.notificationDays.forEach((days) => {
                    const notificationDate = new Date(task.dueDate);
                    notificationDate.setDate(notificationDate.getDate() - days);

                    if (notificationDate <= now && task.dueDate > now) {
                        newNotifications.push({
                            id: Date.now() + Math.random(),
                            type: "task",
                            itemId: task.id,
                            title: `Công việc sắp đến hạn`,
                            message: `"${task.title}" sẽ đến hạn trong ${days} ngày (${task.dueDate.toLocaleDateString("vi-VN")})`,
                            dueDate: task.dueDate,
                            daysBefore: days,
                            isRead: false,
                            createdAt: now,
                        });
                    }
                });
            }
        });

        setNotifications((prev) => [...prev, ...newNotifications]);
    };

    // Check for notifications every minute
    useEffect(() => {
        const interval = setInterval(generateNotifications, 60000);
        generateNotifications(); // Run once on mount
        return () => clearInterval(interval);
    }, [milestones, tasks]);

    const markNotificationAsRead = (id: number) => {
        setNotifications((prev) => prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)));
    };

    const getTasksForMilestone = (milestoneId: number) => {
        return tasks.filter((task) => task.milestoneId === milestoneId);
    };

    // Remove getIndependentTasks since all tasks must belong to a milestone
    const getAllTasks = () => {
        return tasks;
    };

    return {
        // States
        expandedSections,
        contractCode,
        contractName,
        setContractName,
        contractType,
        setContractType,
        currentUser,
        manager,
        setManager,
        startDate,
        endDate,
        showDatePicker,
        setShowDatePicker,
        projectDescription,
        setProjectDescription,
        contractValue,
        paymentMethod,
        setPaymentMethod,
        paymentSchedule,
        setPaymentSchedule,
        acceptanceConditions,
        setAcceptanceConditions,
        partyA,
        setPartyA,
        partyB,
        setPartyB,
        deliverables,
        setDeliverables,
        attachedFiles,
        setAttachedFiles,
        milestones,
        setMilestones,
        tasks,
        setTasks,
        notifications,
        version,
        setVersion,
        internalNotes,
        setInternalNotes,
        // Functions
        toggleSection,
        handleDateChange,
        handleContractValueChange,
        handleFileUpload,
        removeFile,
        addMilestone,
        updateMilestone,
        removeMilestone,
        addTask,
        updateTask,
        removeTask,
        markNotificationAsRead,
        getTasksForMilestone,
        getAllTasks,
    };
};
