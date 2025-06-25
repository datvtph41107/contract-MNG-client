"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import Form from "~/components/Form/Form";
import { ContractManagementSection } from "./form-section/contract-management-section";
import { GeneralInfoSection } from "./form-section/general-info-section";
import { ContractContentSection } from "./form-section/contract-content-section";
import { ProgressSidebar } from "./sidebar/ProgressSidebar";
import { ContractTypeInfo } from "./sidebar/ContractTypeInfo";
import { useContractForm } from "~/hooks/useContractFormBasic";
import type { ContractFormData } from "~/types/contract.types";
import styles from "./BasicContractForm.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const BasicContractForm = () => {
    const {
        selectedType,
        selectedDrafter,
        selectedManager,
        dateRange,
        defaultValues,
        setSelectedType,
        setSelectedDrafter,
        setSelectedManager,
        setDateRange,
        handleSubmit,
        handleError,
    } = useContractForm();

    return (
        <div className={cx("basic-form-container")}>
            <div className={cx("form-header")}>
                <h2>
                    <FontAwesomeIcon icon={faFileContract} />
                    Tạo hợp đồng mới - Giai đoạn 1
                </h2>
                <p>Điền thông tin cơ bản của hợp đồng để bắt đầu quá trình quản lý</p>
            </div>

            <div className={cx("form-content")}>
                <div className={cx("form-section")}>
                    <Form<ContractFormData>
                        className={cx("form-section")}
                        defaultValues={defaultValues}
                        onSubmit={handleSubmit}
                        onError={handleError}
                    >
                        <ContractManagementSection />

                        <GeneralInfoSection
                            selectedType={selectedType}
                            selectedDrafter={selectedDrafter}
                            selectedManager={selectedManager}
                            onContractTypeChange={setSelectedType}
                            onDrafterChange={setSelectedDrafter}
                            onManagerChange={setSelectedManager}
                        />

                        <ContractContentSection contractType={selectedType} dateRange={dateRange} onDateRangeChange={setDateRange} />

                        <div className={cx("form-actions")}>
                            <button type="submit" className={cx("submit-button")}>
                                <FontAwesomeIcon icon={faFileContract} />
                                Lưu và tiếp tục đến giai đoạn 2
                            </button>
                        </div>
                    </Form>
                </div>

                <div className={cx("form-sidebar")}>
                    <ProgressSidebar />
                    <ContractTypeInfo selectedType={selectedType} />
                </div>
            </div>
        </div>
    );
};

export default BasicContractForm;
