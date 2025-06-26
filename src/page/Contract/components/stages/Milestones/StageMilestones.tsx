"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faProjectDiagram,
    faPlus,
    faCheck,
    faFlag,
    faTasks,
    faCalendarAlt,
    faChartLine,
    faCalendar,
    faTimes,
    faFileContract,
    faArrowLeft,
    faChevronLeft,
    faChevronRight,
    faInfo,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../../Dropdown/Dropdown";
import DatePicker from "../../DatePicker/DatePicker";
import { EditMilestoneModal } from "./form-section/edit-modal/edit-milestone-modal";
import { EditTaskModal } from "./form-section/edit-modal/edit-task-modal";
import { ProgressSidebar } from "../Sidebar/ProgressSidebar";
import { ContractSummary } from "../Sidebar/ContractSummary";
import { MILESTONE_TYPES, PRIORITY_OPTIONS, EMPLOYEES } from "~/constants/milestone.constants";
import type { Milestone, Task } from "~/types/milestone.types";
import classNames from "classnames/bind";
import styles from "./StageMilestones.module.scss";

const cx = classNames.bind(styles);

const StageMilestones: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"milestone" | "task">("milestone");
    const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set());
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Edit modal states
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // DatePicker states
    const [showMilestoneDatePicker, setShowMilestoneDatePicker] = useState(false);
    const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);

    const milestones = [];
    const allTasks = milestones.flatMap((m) => m.tasks);

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

    // Other handlers remain the same...
    const handleEditMilestone = (milestone: Milestone) => {
        setEditingMilestone(milestone);
    };

    const handleSaveMilestone = (updatedMilestone: Milestone) => {
        setEditingMilestone(null);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleSaveTask = (updatedTask: Task) => {
        setEditingTask(null);
    };

    const toggleMilestoneStatus = (id: number) => {
        // Implementation
    };

    const toggleTaskStatus = (taskId: number, milestoneId: number) => {
        // Implementation
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
            // Remove milestone logic
        }
    };

    const removeTask = (taskId: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
            // Remove task logic
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

    const milestoneOptions = milestones.map((milestone) => ({
        value: milestone.id.toString(),
        label: milestone.title,
        icon: getMilestoneTypeInfo(milestone.type).icon,
    }));

    const handleMilestoneDateChange = (startDate: Date | null, endDate: Date | null) => {
        setNewMilestone({ ...newMilestone, endDate: startDate });
    };

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
                {/* <button onClick={handleClose} className={cx("close-btn")}>
                    <FontAwesomeIcon icon={faTimes} />
                </button> */}
            </div>

            <div className={cx("modal-layout-optimized", { "sidebar-collapsed": sidebarCollapsed })}>
                {/* Main Content Area */}
                <div className={cx("main-content")}>
                    {/* Left Panel - Overview */}
                    <div className={cx("left-panel")}>
                        <div className={cx("panel-header")}>
                            <h3>
                                <FontAwesomeIcon icon={faChartLine} />
                                Tổng quan tiến độ
                            </h3>

                            {/* Compact Stats */}
                            <div className={cx("stats-compact")}>
                                <div className={cx("stat-item")}>
                                    <span className={cx("stat-number")}>{stats.milestones.total}</span>
                                    <span className={cx("stat-label")}>Mốc thời gian</span>
                                </div>
                                <div className={cx("stat-item")}>
                                    <span className={cx("stat-number")}>{stats.tasks.total}</span>
                                    <span className={cx("stat-label")}>Công việc</span>
                                </div>
                                <div className={cx("stat-item")}>
                                    <span className={cx("stat-number")}>{getTotalProgress()}%</span>
                                    <span className={cx("stat-label")}>Tiến độ</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className={cx("timeline-section")}>
                            <h4>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                Timeline các giai đoạn
                            </h4>

                            <div className={cx("timeline-container")}>
                                {milestones.length > 0 ? (
                                    milestones.map((milestone, index) => (
                                        <div key={milestone.id} className={cx("timeline-milestone")}>
                                            {/* Milestone content */}
                                        </div>
                                    ))
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

                {/* Floating Sidebar */}
                <div className={cx("floating-sidebar", { collapsed: sidebarCollapsed })}>
                    {/* Sidebar Toggle */}
                    <button
                        className={cx("sidebar-toggle")}
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                    >
                        <FontAwesomeIcon icon={sidebarCollapsed ? faChevronLeft : faChevronRight} />
                    </button>

                    {/* Sidebar Content */}
                    <div className={cx("sidebar-content")}>
                        {!sidebarCollapsed && (
                            <>
                                <ProgressSidebar />
                                <ContractSummary />
                            </>
                        )}

                        {/* {sidebarCollapsed && (
                            <div className={cx("sidebar-collapsed-content")}>
                                <div className={cx("collapsed-icon")} title="Tiến độ tạo hợp đồng">
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                                <div className={cx("collapsed-icon")} title="Thông tin hợp đồng">
                                    <FontAwesomeIcon icon={faInfo} />
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className={cx("bottom-actions")}>
                <button type="button" className={cx("back-button")}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Quay lại
                </button>
                <button type="submit" className={cx("submit-button")}>
                    <FontAwesomeIcon icon={faFileContract} />
                    Lưu và tiếp tục
                </button>
            </div>

            {/* Modals */}
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
