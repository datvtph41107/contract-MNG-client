"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContractStore } from "~/store/contract-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faProjectDiagram,
    faPlus,
    faCheck,
    faTrash,
    faClock,
    faUser,
    faEdit,
    faChevronDown,
    faChevronRight,
    faFlag,
    faTasks,
    faCalendarAlt,
    faChartLine,
    faCalendar,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../../Dropdown/Dropdown";
import DatePicker from "../../DatePicker/DatePicker";
import { EditMilestoneModal } from "./form-section/edit-modal/edit-milestone-modal";
import { EditTaskModal } from "./form-section/edit-modal/edit-task-modal";
import { MILESTONE_TYPES, PRIORITY_OPTIONS, EMPLOYEES } from "~/constants/milestone.constants";
import { getDaysUntilDue } from "~/utils/milestone.utils";
import type { Milestone, Task } from "~/types/milestone.types";
import classNames from "classnames/bind";
import styles from "./StageMilestones.module.scss";

const cx = classNames.bind(styles);

const StageMilestones: React.FC = () => {
    const navigate = useNavigate();
    const { contractData, updateContractData } = useContractStore();
    const [activeTab, setActiveTab] = useState<"milestone" | "task">("milestone");
    const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set());

    // Edit modal states
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // DatePicker states
    const [showMilestoneDatePicker, setShowMilestoneDatePicker] = useState(false);
    const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);

    const milestones = contractData.milestones || [];
    const allTasks = milestones.flatMap((m) => m.tasks);

    // Get today's date as default start date
    const getTodayStart = () => {
        const today = new Date();
        today.setHours(9, 0, 0, 0);
        return today;
    };

    const [newMilestone, setNewMilestone] = useState({
        title: "",
        description: "",
        type: "custom" as Milestone["type"],
        startDate: new Date(),
        endDate: null as Date | null,
        priority: "medium" as Milestone["priority"],
        assignee: "",
    });

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        assignee: "",
        startDate: new Date(),
        endDate: null as Date | null,
        priority: "medium" as Task["priority"],
        milestoneId: milestones[0]?.id || 0,
        estimatedHours: "",
    });

    const handleClose = () => {
        navigate(-1);
    };

    const handleAddMilestone = () => {
        if (newMilestone.title.trim() && newMilestone.endDate) {
            const newMilestoneData: Milestone = {
                id: Date.now(),
                title: newMilestone.title,
                description: newMilestone.description,
                type: newMilestone.type,
                dueDate: newMilestone.endDate,
                priority: newMilestone.priority,
                assignee: newMilestone.assignee,
                status: "pending",
                tasks: [],
                estimatedHours: 0,
                completionPercentage: 0,
            };

            updateContractData({
                milestones: [...milestones, newMilestoneData],
            });

            setNewMilestone({
                title: "",
                description: "",
                type: "custom",
                startDate: new Date(),
                endDate: null,
                priority: "medium",
                assignee: "",
            });
        }
    };

    const handleAddTask = () => {
        if (newTask.title.trim() && newTask.endDate && newTask.milestoneId) {
            const newTaskData: Task = {
                id: Date.now(),
                title: newTask.title,
                description: newTask.description,
                assignee: newTask.assignee,
                dueDate: newTask.endDate,
                priority: newTask.priority,
                estimatedHours: newTask.estimatedHours ? Number(newTask.estimatedHours) : 0,
                milestoneId: newTask.milestoneId,
                status: "pending",
            };

            const updatedMilestones = milestones.map((milestone) =>
                milestone.id === newTask.milestoneId ? { ...milestone, tasks: [...milestone.tasks, newTaskData] } : milestone,
            );

            updateContractData({ milestones: updatedMilestones });

            setNewTask({
                title: "",
                description: "",
                assignee: "",
                startDate: new Date(),
                endDate: null,
                priority: "medium",
                milestoneId: milestones[0]?.id || 0,
                estimatedHours: "",
            });
        }
    };

    // Edit handlers
    const handleEditMilestone = (milestone: Milestone) => {
        setEditingMilestone(milestone);
    };

    const handleSaveMilestone = (updatedMilestone: Milestone) => {
        const updatedMilestones = milestones.map((m) => (m.id === updatedMilestone.id ? updatedMilestone : m));
        updateContractData({ milestones: updatedMilestones });
        setEditingMilestone(null);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleSaveTask = (updatedTask: Task) => {
        const updatedMilestones = milestones.map((milestone) => ({
            ...milestone,
            tasks: milestone.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        }));
        updateContractData({ milestones: updatedMilestones });
        setEditingTask(null);
    };

    const toggleMilestoneStatus = (id: number) => {
        const updatedMilestones = milestones.map((milestone) =>
            milestone.id === id
                ? {
                      ...milestone,
                      status: milestone.status === "completed" ? "pending" : "completed",
                      completionPercentage: milestone.status === "completed" ? 0 : 100,
                  }
                : milestone,
        );
        updateContractData({ milestones: updatedMilestones });
    };

    const toggleTaskStatus = (taskId: number, milestoneId: number) => {
        const updatedMilestones = milestones.map((milestone) =>
            milestone.id === milestoneId
                ? {
                      ...milestone,
                      tasks: milestone.tasks.map((task) =>
                          task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task,
                      ),
                  }
                : milestone,
        );
        updateContractData({ milestones: updatedMilestones });
    };

    const toggleMilestoneExpansion = (milestoneId: number) => {
        setExpandedMilestones((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(milestoneId)) {
                newSet.delete(milestoneId);
            } else {
                newSet.add(milestoneId);
            }
            return newSet;
        });
    };

    const removeMilestone = (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa mốc thời gian này?")) {
            updateContractData({
                milestones: milestones.filter((m) => m.id !== id),
            });
        }
    };

    const removeTask = (taskId: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
            const updatedMilestones = milestones.map((milestone) => ({
                ...milestone,
                tasks: milestone.tasks.filter((task) => task.id !== taskId),
            }));
            updateContractData({ milestones: updatedMilestones });
        }
    };

    const getMilestoneTypeInfo = (type: string) => {
        return MILESTONE_TYPES.find((t) => t.value === type) || MILESTONE_TYPES[MILESTONE_TYPES.length - 1];
    };

    const getPriorityInfo = (priority: string) => {
        return PRIORITY_OPTIONS.find((p) => p.value === priority) || PRIORITY_OPTIONS[1];
    };

    const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return "Chưa xác định";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "Không hợp lệ";

        return d.toLocaleDateString("vi-VN");
    };

    const formatDateTimeRange = (startDate: Date | null, endDate: Date | null) => {
        if (!startDate || !endDate) return "Chọn ngày";

        const formatSingle = (date: Date) => {
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        return `${formatSingle(startDate)} - ${formatSingle(endDate)}`;
    };

    const getMilestoneProgress = (milestoneId: number) => {
        const milestone = milestones.find((m) => m.id === milestoneId);
        if (!milestone || milestone.tasks.length === 0) return 0;
        const completedTasks = milestone.tasks.filter((task) => task.status === "completed").length;
        return Math.round((completedTasks / milestone.tasks.length) * 100);
    };

    const getTotalProgress = () => {
        const totalTasks = allTasks.length;
        if (totalTasks === 0) return 0;
        const completedTasks = allTasks.filter((task) => task.status === "completed").length;
        return Math.round((completedTasks / totalTasks) * 100);
    };

    const getOverallStats = () => {
        const totalMilestones = milestones.length;
        const completedMilestones = milestones.filter((m) => m.status === "completed").length;
        const overdueMilestones = milestones.filter((m) => {
            const now = new Date();
            return m.dueDate < now && m.status !== "completed";
        }).length;

        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter((t) => t.status === "completed").length;
        const overdueTasks = allTasks.filter((t) => {
            const now = new Date();
            return t.dueDate < now && t.status !== "completed";
        }).length;

        return {
            milestones: { total: totalMilestones, completed: completedMilestones, overdue: overdueMilestones },
            tasks: { total: totalTasks, completed: completedTasks, overdue: overdueTasks },
        };
    };

    const stats = getOverallStats();

    // Milestone options for task dropdown
    const milestoneOptions = milestones.map((milestone) => ({
        value: milestone.id.toString(),
        label: milestone.title,
        icon: getMilestoneTypeInfo(milestone.type).icon,
    }));

    // Handle milestone date selection
    const handleMilestoneDateChange = (startDate: Date | null, endDate: Date | null) => {
        setNewMilestone({ ...newMilestone, endDate: startDate });
    };

    // Handle task date selection
    const handleTaskDateChange = (startDate: Date | null, endDate: Date | null) => {
        setNewTask({ ...newTask, endDate: startDate });
    };

    return (
        <div className={cx("fullscreen-modal")}>
            {/* Header */}
            <div className={cx("modal-header")}>
                <div className={cx("header-content")}>
                    <FontAwesomeIcon icon={faProjectDiagram} />
                    <h1>Quản lý mốc thời gian & công việc</h1>
                </div>
                <button onClick={handleClose} className={cx("close-btn")}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <div className={cx("modal-layout")}>
                {/* Left Panel - Overview */}
                <div className={cx("left-panel")}>
                    <div className={cx("panel-header")}>
                        <h3>
                            <FontAwesomeIcon icon={faChartLine} />
                            Tổng quan tiến độ
                        </h3>

                        {/* Stats Cards */}
                        <div className={cx("stats-grid")}>
                            <div className={cx("stat-card", "milestones")}>
                                <div className={cx("stat-icon")}>
                                    <FontAwesomeIcon icon={faFlag} />
                                </div>
                                <div className={cx("stat-content")}>
                                    <div className={cx("stat-number")}>{stats.milestones.total}</div>
                                    <div className={cx("stat-label")}>Mốc thời gian</div>
                                    <div className={cx("stat-detail")}>
                                        {stats.milestones.completed} hoàn thành
                                        {stats.milestones.overdue > 0 && (
                                            <span className={cx("overdue")}> • {stats.milestones.overdue} quá hạn</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={cx("stat-card", "tasks")}>
                                <div className={cx("stat-icon")}>
                                    <FontAwesomeIcon icon={faTasks} />
                                </div>
                                <div className={cx("stat-content")}>
                                    <div className={cx("stat-number")}>{stats.tasks.total}</div>
                                    <div className={cx("stat-label")}>Công việc</div>
                                    <div className={cx("stat-detail")}>
                                        {stats.tasks.completed} hoàn thành
                                        {stats.tasks.overdue > 0 && <span className={cx("overdue")}> • {stats.tasks.overdue} quá hạn</span>}
                                    </div>
                                </div>
                            </div>

                            <div className={cx("stat-card", "progress")}>
                                <div className={cx("stat-icon")}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </div>
                                <div className={cx("stat-content")}>
                                    <div className={cx("stat-number")}>{getTotalProgress()}%</div>
                                    <div className={cx("stat-label")}>Tiến độ tổng</div>
                                    <div className={cx("progress-bar")}>
                                        <div className={cx("progress-fill")} style={{ width: `${getTotalProgress()}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Milestones Timeline */}
                    <div className={cx("timeline-section")}>
                        <h4>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            Timeline các giai đoạn
                        </h4>

                        <div className={cx("timeline-container")}>
                            {milestones.length > 0 ? (
                                milestones
                                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                                    .map((milestone, index) => {
                                        const typeInfo = getMilestoneTypeInfo(milestone.type);
                                        const priorityInfo = getPriorityInfo(milestone.priority);
                                        const daysUntilDue = getDaysUntilDue(milestone.dueDate);
                                        const isOverdue = daysUntilDue < 0 && milestone.status !== "completed";
                                        const isExpanded = expandedMilestones.has(milestone.id);
                                        const progress = getMilestoneProgress(milestone.id);
                                        const completedTasks = milestone.tasks.filter((t) => t.status === "completed").length;

                                        return (
                                            <div
                                                key={milestone.id}
                                                className={cx("timeline-milestone", {
                                                    completed: milestone.status === "completed",
                                                    overdue: isOverdue,
                                                })}
                                            >
                                                {/* Milestone Header */}
                                                <div className={cx("milestone-row")}>
                                                    <div className={cx("milestone-left")}>
                                                        <div className={cx("milestone-icon")} style={{ backgroundColor: typeInfo.color }}>
                                                            <span>{typeInfo.icon}</span>
                                                        </div>

                                                        <div className={cx("milestone-content")}>
                                                            <div className={cx("milestone-header-row")}>
                                                                <span
                                                                    className={cx("milestone-checkbox")}
                                                                    onClick={() => toggleMilestoneStatus(milestone.id)}
                                                                >
                                                                    {milestone.status === "completed" && <FontAwesomeIcon icon={faCheck} />}
                                                                </span>

                                                                <h5 className={cx("milestone-title")}>{milestone.title}</h5>

                                                                <div className={cx("milestone-badges")}>
                                                                    <span className={cx("task-count-badge")}>
                                                                        {completedTasks}/{milestone.tasks.length} công việc
                                                                    </span>
                                                                    <button
                                                                        className={cx("expand-toggle")}
                                                                        onClick={() => toggleMilestoneExpansion(milestone.id)}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={isExpanded ? faChevronDown : faChevronRight}
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        className={cx("edit-btn")}
                                                                        onClick={() => handleEditMilestone(milestone)}
                                                                        title="Chỉnh sửa"
                                                                    >
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </button>
                                                                    <button
                                                                        className={cx("delete-btn")}
                                                                        onClick={() => removeMilestone(milestone.id)}
                                                                        title="Xóa"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {milestone.description && (
                                                                <div className={cx("milestone-description")}>{milestone.description}</div>
                                                            )}

                                                            <div className={cx("milestone-meta-row")}>
                                                                <span className={cx("milestone-date")}>
                                                                    <FontAwesomeIcon icon={faClock} />
                                                                    {formatDate(milestone.dueDate)}
                                                                    {daysUntilDue >= 0 ? (
                                                                        <span
                                                                            className={cx("days-remaining", { urgent: daysUntilDue <= 3 })}
                                                                        >
                                                                            (còn {daysUntilDue} ngày)
                                                                        </span>
                                                                    ) : (
                                                                        <span className={cx("days-overdue")}>
                                                                            (quá hạn {Math.abs(daysUntilDue)} ngày)
                                                                        </span>
                                                                    )}
                                                                </span>

                                                                <span className={cx("milestone-assignee")}>
                                                                    <FontAwesomeIcon icon={faUser} />
                                                                    {milestone.assignee.split(" - ")[0]}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={cx("milestone-right")}>
                                                        <div className={cx("progress-display")}>{progress}%</div>
                                                    </div>
                                                </div>

                                                {/* Tasks Section */}
                                                {isExpanded && milestone.tasks.length > 0 && (
                                                    <div className={cx("tasks-section")}>
                                                        <h6>Công việc trong giai đoạn này</h6>
                                                        <div className={cx("tasks-list")}>
                                                            {milestone.tasks.map((task) => {
                                                                const taskPriorityInfo = getPriorityInfo(task.priority);
                                                                const taskDaysUntilDue = getDaysUntilDue(task.dueDate);
                                                                const isTaskOverdue = taskDaysUntilDue < 0 && task.status !== "completed";

                                                                return (
                                                                    <div key={task.id} className={cx("task-row")}>
                                                                        <span
                                                                            className={cx("task-checkbox")}
                                                                            onClick={() => toggleTaskStatus(task.id, milestone.id)}
                                                                        >
                                                                            {task.status === "completed" && (
                                                                                <FontAwesomeIcon icon={faCheck} />
                                                                            )}
                                                                        </span>

                                                                        <div className={cx("task-content")}>
                                                                            <div className={cx("task-title")}>{task.title}</div>
                                                                            <div className={cx("task-meta")}>
                                                                                <span className={cx("task-assignee")}>
                                                                                    <FontAwesomeIcon icon={faUser} />
                                                                                    {task.assignee.split(" - ")[0]}
                                                                                </span>
                                                                                <span className={cx("task-date")}>
                                                                                    <FontAwesomeIcon icon={faClock} />
                                                                                    {formatDate(task.dueDate)}
                                                                                    {taskDaysUntilDue >= 0 ? (
                                                                                        <span
                                                                                            className={cx("days-remaining", {
                                                                                                urgent: taskDaysUntilDue <= 1,
                                                                                            })}
                                                                                        >
                                                                                            (còn {taskDaysUntilDue} ngày)
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className={cx("days-overdue")}>
                                                                                            (quá hạn {Math.abs(taskDaysUntilDue)} ngày)
                                                                                        </span>
                                                                                    )}
                                                                                </span>
                                                                                {task.estimatedHours && (
                                                                                    <span className={cx("task-hours")}>
                                                                                        <FontAwesomeIcon icon={faClock} />
                                                                                        {task.estimatedHours}h
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className={cx("task-badges")}>
                                                                            <span
                                                                                className={cx("priority-badge")}
                                                                                style={{ backgroundColor: taskPriorityInfo.color }}
                                                                            >
                                                                                {taskPriorityInfo.label}
                                                                            </span>
                                                                            <button
                                                                                className={cx("task-edit-btn")}
                                                                                onClick={() => handleEditTask(task)}
                                                                                title="Chỉnh sửa"
                                                                            >
                                                                                <FontAwesomeIcon icon={faEdit} />
                                                                            </button>
                                                                            <button
                                                                                className={cx("task-delete-btn")}
                                                                                onClick={() => removeTask(task.id)}
                                                                                title="Xóa"
                                                                            >
                                                                                <FontAwesomeIcon icon={faTrash} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className={cx("empty-timeline")}>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                    <p>Chưa có mốc thời gian nào được thiết lập</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Creation Forms */}
                <div className={cx("right-panel")}>
                    <div className={cx("panel-header")}>
                        <h3>
                            <FontAwesomeIcon icon={faPlus} />
                            Tạo mới
                        </h3>

                        {/* Tab Navigation */}
                        <div className={cx("tab-navigation")}>
                            <button
                                className={cx("tab-btn", { active: activeTab === "milestone" })}
                                onClick={() => setActiveTab("milestone")}
                            >
                                <FontAwesomeIcon icon={faFlag} />
                                Mốc thời gian
                            </button>
                            <button className={cx("tab-btn", { active: activeTab === "task" })} onClick={() => setActiveTab("task")}>
                                <FontAwesomeIcon icon={faTasks} />
                                Công việc
                            </button>
                        </div>
                    </div>

                    <div className={cx("form-container")}>
                        {activeTab === "milestone" ? (
                            /* Milestone Form */
                            <div className={cx("milestone-form")}>
                                <h4>
                                    <FontAwesomeIcon icon={faFlag} />
                                    Thêm mốc thời gian mới
                                </h4>

                                <div className={cx("form-grid")}>
                                    <div className={cx("field", "full-width")}>
                                        <label>Tên mốc thời gian</label>
                                        <input
                                            type="text"
                                            value={newMilestone.title}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                            placeholder="Ví dụ: Giai đoạn 1 - Ký kết hợp đồng"
                                        />
                                    </div>

                                    <div className={cx("field", "full-width")}>
                                        <label>Mô tả giai đoạn</label>
                                        <textarea
                                            value={newMilestone.description}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                            rows={3}
                                            placeholder="Mô tả chi tiết về giai đoạn này..."
                                        />
                                    </div>

                                    <div className={cx("field")}>
                                        <label>Loại mốc</label>
                                        <Dropdown
                                            options={MILESTONE_TYPES.map((type) => ({
                                                value: type.value,
                                                label: type.label,
                                                icon: type.icon,
                                            }))}
                                            value={newMilestone.type}
                                            onChange={(value) => setNewMilestone({ ...newMilestone, type: value as Milestone["type"] })}
                                        />
                                    </div>

                                    <div className={cx("field")}>
                                        <label>Độ ưu tiên</label>
                                        <Dropdown
                                            options={PRIORITY_OPTIONS.map((priority) => ({
                                                value: priority.value,
                                                label: priority.label,
                                                icon: "🔥",
                                            }))}
                                            value={newMilestone.priority}
                                            onChange={(value) =>
                                                setNewMilestone({ ...newMilestone, priority: value as Milestone["priority"] })
                                            }
                                        />
                                    </div>

                                    <div className={cx("field", "full-width")}>
                                        <label>Thời hạn hoàn thành</label>
                                        <div className={cx("date-picker-trigger")} onClick={() => setShowMilestoneDatePicker(true)}>
                                            <FontAwesomeIcon icon={faCalendar} />
                                            <span>{formatDateTimeRange(newMilestone.startDate, newMilestone.endDate)}</span>
                                        </div>
                                    </div>

                                    <div className={cx("field", "full-width")}>
                                        <label>Người phụ trách</label>
                                        <Dropdown
                                            options={EMPLOYEES}
                                            value={newMilestone.assignee}
                                            onChange={(value) => setNewMilestone({ ...newMilestone, assignee: value })}
                                            placeholder="Chọn người phụ trách"
                                        />
                                    </div>
                                </div>

                                <div className={cx("form-actions")}>
                                    <button className={cx("save-btn")} onClick={handleAddMilestone}>
                                        <FontAwesomeIcon icon={faCheck} />
                                        Tạo mốc thời gian
                                    </button>
                                    <button
                                        className={cx("reset-btn")}
                                        onClick={() =>
                                            setNewMilestone({
                                                title: "",
                                                description: "",
                                                type: "custom",
                                                startDate: new Date(),
                                                endDate: null,
                                                priority: "medium",
                                                assignee: "",
                                            })
                                        }
                                    >
                                        Đặt lại
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Task Form */
                            <div className={cx("task-form")}>
                                <h4>
                                    <FontAwesomeIcon icon={faTasks} />
                                    Thêm công việc mới
                                </h4>

                                <div className={cx("form-grid")}>
                                    <div className={cx("field", "full-width")}>
                                        <label>Tên công việc</label>
                                        <input
                                            type="text"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            placeholder="Ví dụ: Chuẩn bị hồ sơ pháp lý"
                                        />
                                    </div>

                                    <div className={cx("field", "full-width")}>
                                        <label>Mô tả công việc</label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            rows={3}
                                            placeholder="Mô tả chi tiết về công việc cần thực hiện..."
                                        />
                                    </div>

                                    <div className={cx("field", "full-width")}>
                                        <label>Thuộc mốc thời gian</label>
                                        <Dropdown
                                            options={milestoneOptions}
                                            value={newTask.milestoneId.toString()}
                                            onChange={(value) => setNewTask({ ...newTask, milestoneId: Number(value) })}
                                            placeholder="Chọn mốc thời gian"
                                        />
                                    </div>

                                    <div className={cx("field")}>
                                        <label>Người thực hiện</label>
                                        <Dropdown
                                            options={EMPLOYEES}
                                            value={newTask.assignee}
                                            onChange={(value) => setNewTask({ ...newTask, assignee: value })}
                                            placeholder="Chọn người thực hiện"
                                        />
                                    </div>

                                    <div className={cx("field")}>
                                        <label>Độ ưu tiên</label>
                                        <Dropdown
                                            options={PRIORITY_OPTIONS.map((priority) => ({
                                                value: priority.value,
                                                label: priority.label,
                                                icon: "🔥",
                                            }))}
                                            value={newTask.priority}
                                            onChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
                                        />
                                    </div>

                                    <div className={cx("field", "full-width")}>
                                        <label>Thời hạn hoàn thành</label>
                                        <div className={cx("date-picker-trigger")} onClick={() => setShowTaskDatePicker(true)}>
                                            <FontAwesomeIcon icon={faCalendar} />
                                            <span>{formatDateTimeRange(newTask.startDate, newTask.endDate)}</span>
                                        </div>
                                    </div>

                                    <div className={cx("field")}>
                                        <label>Ước tính thời gian (giờ)</label>
                                        <input
                                            type="number"
                                            value={newTask.estimatedHours}
                                            onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                                            placeholder="8"
                                            min="0"
                                            step="0.5"
                                        />
                                    </div>
                                </div>

                                <div className={cx("form-actions")}>
                                    <button className={cx("save-btn")} onClick={handleAddTask}>
                                        <FontAwesomeIcon icon={faCheck} />
                                        Tạo công việc
                                    </button>
                                    <button
                                        className={cx("reset-btn")}
                                        onClick={() =>
                                            setNewTask({
                                                title: "",
                                                description: "",
                                                assignee: "",
                                                startDate: new Date(),
                                                endDate: null,
                                                priority: "medium",
                                                milestoneId: milestones[0]?.id || 0,
                                                estimatedHours: "",
                                            })
                                        }
                                    >
                                        Đặt lại
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DatePicker Modals */}
            {showMilestoneDatePicker && (
                <DatePicker
                    startDate={newMilestone.endDate}
                    onDateChange={handleMilestoneDateChange}
                    onClose={() => setShowMilestoneDatePicker(false)}
                />
            )}

            {showTaskDatePicker && (
                <DatePicker startDate={newTask.endDate} onDateChange={handleTaskDateChange} onClose={() => setShowTaskDatePicker(false)} />
            )}

            {/* Edit Modals */}
            {editingMilestone && (
                <EditMilestoneModal milestone={editingMilestone} onSave={handleSaveMilestone} onClose={() => setEditingMilestone(null)} />
            )}

            {editingTask && (
                <EditTaskModal task={editingTask} milestones={milestones} onSave={handleSaveTask} onClose={() => setEditingTask(null)} />
            )}
        </div>
    );
};

export default StageMilestones;
