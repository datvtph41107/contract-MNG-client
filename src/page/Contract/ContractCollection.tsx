"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ContractCollection.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileContract,
    faPlus,
    faHistory,
    faSearch,
    faFilter,
    faEllipsisV,
    faEdit,
    faTrash,
    faCopy,
    faCalendar,
    faUser,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useContractDraftStore } from "~/store/contract-draft-store";
import type { ContractDraft, ContractTemplate } from "~/types/contract.types";

const cx = classNames.bind(styles);

interface ContractCollectionProps {
    contractType: "basic" | "editor" | "upload";
}

const ContractCollection: React.FC<ContractCollectionProps> = ({ contractType }) => {
    const navigate = useNavigate();
    const { drafts, templates, loadDrafts, loadTemplates, deleteDraft, duplicateDraft, createFromTemplate } = useContractDraftStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "recent" | "shared">("all");
    const [showDropdown, setShowDropdown] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([loadDrafts(contractType), loadTemplates(contractType)]);
            setLoading(false);
        };
        loadData();
    }, [contractType, loadDrafts, loadTemplates]);

    const filteredDrafts = drafts.filter((draft) => {
        const matchesSearch = draft.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterBy === "all" || (filterBy === "recent" && isRecent(draft.updatedAt)) || (filterBy === "shared" && draft.isShared);
        return matchesSearch && matchesFilter;
    });

    const isRecent = (date: string) => {
        const draftDate = new Date(date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return draftDate > weekAgo;
    };

    const handleCreateNew = () => {
        navigate(`/page/create/draft?type=${contractType}&mode=new`);
    };

    const handleOpenDraft = (draft: ContractDraft) => {
        navigate(`/page/create/draft?type=${contractType}&draftId=${draft.id}&stage=${draft.currentStage}`);
    };

    const handleUseTemplate = async (template: ContractTemplate) => {
        const newDraft = await createFromTemplate(template.id, contractType);
        navigate(`/page/create/draft?type=${contractType}&draftId=${newDraft.id}&stage=1`);
    };

    const handleDeleteDraft = async (draftId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bản nháp này?")) {
            await deleteDraft(draftId);
        }
        setShowDropdown(null);
    };

    const handleDuplicateDraft = async (draftId: string) => {
        const newDraft = await duplicateDraft(draftId);
        navigate(`/page/create/draft?type=${contractType}&draftId=${newDraft.id}&stage=1`);
        setShowDropdown(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "Hôm qua";
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString("vi-VN");
    };

    const getContractTypeTitle = () => {
        switch (contractType) {
            case "editor":
                return "Soạn thảo hợp đồng";
            case "basic":
                return "Hợp đồng cơ bản";
            case "upload":
                return "Tải file lên";
            default:
                return "Hợp đồng";
        }
    };

    if (loading) {
        return (
            <div className={cx("loading-container")}>
                <div className={cx("loading-spinner")} />
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className={cx("contract-collection")}>
            <div className={cx("header")}>
                <button className={cx("back-button")} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Quay lại
                </button>
                <div className={cx("header-content")}>
                    <h1 className={cx("title")}>{getContractTypeTitle()}</h1>
                    <p className={cx("subtitle")}>Chọn template hoặc tiếp tục với bản nháp đã lưu</p>
                </div>
            </div>

            <div className={cx("toolbar")}>
                <div className={cx("search-section")}>
                    <div className={cx("search-box")}>
                        <FontAwesomeIcon icon={faSearch} className={cx("search-icon")} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm hợp đồng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cx("search-input")}
                        />
                    </div>
                    <div className={cx("filter-section")}>
                        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value as any)} className={cx("filter-select")}>
                            <option value="all">Tất cả</option>
                            <option value="recent">Gần đây</option>
                            <option value="shared">Đã chia sẻ</option>
                        </select>
                        <FontAwesomeIcon icon={faFilter} className={cx("filter-icon")} />
                    </div>
                </div>
                <button className={cx("create-button")} onClick={handleCreateNew}>
                    <FontAwesomeIcon icon={faPlus} />
                    Tạo mới
                </button>
            </div>

            <div className={cx("content")}>
                {/* Templates Section */}
                {templates.length > 0 && (
                    <section className={cx("section")}>
                        <h2 className={cx("section-title")}>
                            <FontAwesomeIcon icon={faFileContract} />
                            Templates có sẵn
                        </h2>
                        <div className={cx("templates-grid")}>
                            {templates.map((template) => (
                                <div key={template.id} className={cx("template-card")} onClick={() => handleUseTemplate(template)}>
                                    <div className={cx("template-preview")}>
                                        <img
                                            src={template.thumbnail || "/placeholder.svg?height=120&width=90&query=contract template"}
                                            alt={template.name}
                                            className={cx("template-image")}
                                        />
                                    </div>
                                    <div className={cx("template-info")}>
                                        <h3 className={cx("template-name")}>{template.name}</h3>
                                        <p className={cx("template-description")}>{template.description}</p>
                                        <div className={cx("template-meta")}>
                                            <span className={cx("template-category")}>{template.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recent Drafts Section */}
                <section className={cx("section")}>
                    <h2 className={cx("section-title")}>
                        <FontAwesomeIcon icon={faHistory} />
                        Bản nháp gần đây ({filteredDrafts.length})
                    </h2>

                    {filteredDrafts.length === 0 ? (
                        <div className={cx("empty-state")}>
                            <FontAwesomeIcon icon={faFileContract} className={cx("empty-icon")} />
                            <h3>Chưa có bản nháp nào</h3>
                            <p>Tạo hợp đồng mới để bắt đầu</p>
                            <button className={cx("empty-action")} onClick={handleCreateNew}>
                                <FontAwesomeIcon icon={faPlus} />
                                Tạo hợp đồng mới
                            </button>
                        </div>
                    ) : (
                        <div className={cx("drafts-grid")}>
                            {filteredDrafts.map((draft) => (
                                <div key={draft.id} className={cx("draft-card")} onClick={() => handleOpenDraft(draft)}>
                                    <div className={cx("draft-preview")}>
                                        <img
                                            src={draft.thumbnail || "/placeholder.svg?height=120&width=90&query=contract draft"}
                                            alt={draft.name}
                                            className={cx("draft-image")}
                                        />
                                        <div className={cx("draft-stage")}>Giai đoạn {draft.currentStage}/3</div>
                                    </div>
                                    <div className={cx("draft-info")}>
                                        <h3 className={cx("draft-name")}>{draft.name}</h3>
                                        <div className={cx("draft-meta")}>
                                            <div className={cx("meta-item")}>
                                                <FontAwesomeIcon icon={faCalendar} />
                                                {formatDate(draft.updatedAt)}
                                            </div>
                                            <div className={cx("meta-item")}>
                                                <FontAwesomeIcon icon={faUser} />
                                                {draft.createdBy}
                                            </div>
                                        </div>
                                        <div className={cx("draft-progress")}>
                                            <div className={cx("progress-bar")}>
                                                <div
                                                    className={cx("progress-fill")}
                                                    style={{ width: `${(draft.currentStage / 3) * 100}%` }}
                                                />
                                            </div>
                                            <span className={cx("progress-text")}>
                                                {Math.round((draft.currentStage / 3) * 100)}% hoàn thành
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cx("draft-actions")}>
                                        <button
                                            className={cx("action-button")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDropdown(showDropdown === draft.id ? null : draft.id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEllipsisV} />
                                        </button>
                                        {showDropdown === draft.id && (
                                            <div className={cx("dropdown-menu")}>
                                                <button
                                                    className={cx("dropdown-item")}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenDraft(draft);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    className={cx("dropdown-item")}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDuplicateDraft(draft.id);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCopy} />
                                                    Sao chép
                                                </button>
                                                <button
                                                    className={cx("dropdown-item", "danger")}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteDraft(draft.id);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                    Xóa
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ContractCollection;
