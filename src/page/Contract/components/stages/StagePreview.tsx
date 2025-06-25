import React from "react";
import { useNavigate } from "react-router-dom"; // Thay thế useRouter của Next.js bằng useNavigate của React Router
import { useContractStore } from "~/store/contract-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCheck,
    faDownload,
    faPrint,
    faFile,
    faBuilding,
    faUser,
    faProjectDiagram,
    faClock,
    faFlag,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./Stage.module.scss";
import { routes } from "~/config/routes.config";

// Sử dụng classNames để dễ dàng gắn CSS module
const cx = classNames.bind(styles);

// Định nghĩa kiểu dữ liệu cho contract, milestone và task
interface ContractData {
    contractCode: string;
    contractName: string;
    contractType: string;
    manager: string;
    contractValue: string;
    paymentMethod: string;
    projectDescription?: string;
    milestones: Milestone[];
    partyA: Party;
    partyB: Party;
    attachedFiles: File[];
    version: string;
    acceptanceConditions?: string;
    internalNotes?: string;
}

interface Party {
    name: string;
    representative: string;
    position: string;
    taxCode: string;
    address: string;
    phone: string;
    email: string;
}

interface Milestone {
    id: number;
    title: string;
    description: string;
    type: string;
    dueDate: Date;
    priority: string;
    assignee: string;
    status: string;
    tasks: Task[];
}

interface Task {
    id: number;
    title: string;
    description: string;
    assignee: string;
    dueDate: Date;
    priority: string;
    estimatedHours?: number;
    status: string;
}

const StagePreview: React.FC = () => {
    const navigate = useNavigate();
    const { contractData, markStageComplete } = useContractStore();

    const handlePrevious = () => {
        navigate(`/${routes.createContract}?stage=3`);
    };

    const handleComplete = () => {
        markStageComplete(4);
        alert("Hợp đồng đã được hoàn tất!");
        // Có thể redirect đến trang danh sách hợp đồng hoặc trang khác
    };

    // const formatDate = (date: Date | null) => {
    //     if (!date) return "Chưa xác định";
    //     return date.toLocaleDateString("vi-VN");
    // };

    const formatCurrency = (value: string) => {
        if (!value) return "Chưa xác định";
        return value + " VNĐ";
    };

    const getTotalTasks = () => {
        return contractData.milestones.reduce((total, milestone) => total + milestone.tasks.length, 0);
    };

    const getCompletedTasks = () => {
        return contractData.milestones.reduce(
            (total, milestone) => total + milestone.tasks.filter((task) => task.status === "completed").length,
            0,
        );
    };

    return (
        <div className={cx("stage-container")}>
            <div className={cx("stage-header")}>
                <h1>Giai đoạn 4: Xem trước hợp đồng</h1>
                <p>Kiểm tra toàn bộ thông tin trước khi hoàn tất</p>
            </div>

            <div className={cx("stage-content", "preview-layout")}>
                <div className={cx("preview-actions")}>
                    <button className={cx("action-btn", "secondary")}>
                        <FontAwesomeIcon icon={faPrint} />
                        In hợp đồng
                    </button>
                    <button className={cx("action-btn", "secondary")}>
                        <FontAwesomeIcon icon={faDownload} />
                        Tải xuống PDF
                    </button>
                </div>

                {/* Thông tin tổng quan */}
                <div className={cx("preview-section")}>
                    <div className={cx("section-header")}>
                        <FontAwesomeIcon icon={faFile} />
                        <h2>Thông tin chung</h2>
                    </div>

                    <div className={cx("info-grid")}>
                        <div className={cx("info-item")}>
                            <label>Mã hợp đồng:</label>
                            <span>{contractData.contractCode}</span>
                        </div>
                        <div className={cx("info-item")}>
                            <label>Tên hợp đồng:</label>
                            <span>{contractData.contractName}</span>
                        </div>
                        <div className={cx("info-item")}>
                            <label>Loại hợp đồng:</label>
                            <span>{contractData.contractType}</span>
                        </div>
                        <div className={cx("info-item")}>
                            <label>Người quản lý:</label>
                            <span>{contractData.manager}</span>
                        </div>
                        <div className={cx("info-item")}>
                            <label>Giá trị hợp đồng:</label>
                            <span className={cx("highlight")}>{formatCurrency(contractData.contractValue)}</span>
                        </div>
                        <div className={cx("info-item")}>
                            <label>Phương thức thanh toán:</label>
                            <span>{contractData.paymentMethod}</span>
                        </div>
                    </div>

                    {contractData.projectDescription && (
                        <div className={cx("description-section")}>
                            <h3>Mục đích hợp đồng:</h3>
                            <p>{contractData.projectDescription}</p>
                        </div>
                    )}
                </div>

                {/* Thông tin các bên */}
                <div className={cx("preview-section")}>
                    <div className={cx("section-header")}>
                        <FontAwesomeIcon icon={faBuilding} />
                        <h2>Thông tin các bên</h2>
                    </div>

                    <div className={cx("parties-grid")}>
                        <div className={cx("party-card")}>
                            <h3>
                                <FontAwesomeIcon icon={faBuilding} />
                                Bên A (Doanh nghiệp)
                            </h3>
                            <div className={cx("party-info")}>
                                <div className={cx("info-row")}>
                                    <strong>Tên đơn vị:</strong> {contractData.partyA.name}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Đại diện:</strong> {contractData.partyA.representative}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Chức vụ:</strong> {contractData.partyA.position}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Mã số thuế:</strong> {contractData.partyA.taxCode}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Địa chỉ:</strong> {contractData.partyA.address}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Điện thoại:</strong> {contractData.partyA.phone}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Email:</strong> {contractData.partyA.email}
                                </div>
                            </div>
                        </div>

                        <div className={cx("party-card")}>
                            <h3>
                                <FontAwesomeIcon icon={faUser} />
                                Bên B (Khách hàng/Đối tác)
                            </h3>
                            <div className={cx("party-info")}>
                                <div className={cx("info-row")}>
                                    <strong>Tên đơn vị:</strong> {contractData.partyB.name}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Đại diện:</strong> {contractData.partyB.representative}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Chức vụ:</strong> {contractData.partyB.position}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Mã số thuế:</strong> {contractData.partyB.taxCode}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Địa chỉ:</strong> {contractData.partyB.address}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Điện thoại:</strong> {contractData.partyB.phone}
                                </div>
                                <div className={cx("info-row")}>
                                    <strong>Email:</strong> {contractData.partyB.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mốc thời gian và công việc */}
                <div className={cx("preview-section")}>
                    <div className={cx("section-header")}>
                        <FontAwesomeIcon icon={faProjectDiagram} />
                        <h2>Mốc thời gian & Công việc</h2>
                        <div className={cx("stats")}>
                            <span className={cx("stat")}>{contractData.milestones.length} mốc thời gian</span>
                            <span className={cx("stat")}>{getTotalTasks()} công việc</span>
                        </div>
                    </div>

                    {contractData.milestones.length > 0 ? (
                        <div className={cx("milestones-timeline")}>
                            {contractData.milestones
                                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                                .map((milestone, index) => (
                                    <div key={milestone.id} className={cx("timeline-item")}>
                                        <div className={cx("timeline-marker")}>
                                            <span>{index + 1}</span>
                                        </div>
                                        <div className={cx("timeline-content")}>
                                            <div className={cx("milestone-header")}>
                                                <h3>{milestone.title}</h3>
                                                <div className={cx("milestone-meta")}>
                                                    <span className={cx("due-date")}>
                                                        <FontAwesomeIcon icon={faClock} />
                                                        {/* {formatDate(milestone.dueDate)} */}
                                                    </span>
                                                    <span className={cx("assignee")}>
                                                        <FontAwesomeIcon icon={faUser} />
                                                        {milestone.assignee}
                                                    </span>
                                                </div>
                                            </div>

                                            {milestone.description && (
                                                <p className={cx("milestone-description")}>{milestone.description}</p>
                                            )}

                                            {milestone.tasks.length > 0 && (
                                                <div className={cx("tasks-preview")}>
                                                    <h4>Công việc ({milestone.tasks.length}):</h4>
                                                    <ul className={cx("tasks-list")}>
                                                        {milestone.tasks.map((task) => (
                                                            <li key={task.id} className={cx("task-item")}>
                                                                <span className={cx("task-title")}>{task.title}</span>
                                                                <span className={cx("task-assignee")}>- {task.assignee}</span>
                                                                {/* <span className={cx("task-due")}>({formatDate(task.dueDate)})</span> */}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className={cx("empty-state")}>
                            <p>Chưa có mốc thời gian nào được thiết lập</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={cx("stage-actions")}>
                <button onClick={handlePrevious} className={cx("prev-btn")}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Quay lại</span>
                </button>

                <button onClick={handleComplete} className={cx("complete-btn")}>
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Hoàn tất hợp đồng</span>
                </button>
            </div>
        </div>
    );
};

export default StagePreview;
