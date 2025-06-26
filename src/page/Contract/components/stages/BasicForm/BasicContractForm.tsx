import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import Form from "~/components/Form/Form";
import { ContractManagementSection } from "./form-section/contract-management-section";
import { GeneralInfoSection } from "./form-section/general-info-section";
import { ContractContentSection } from "./form-section/contract-content-section";
import { ProgressSidebar } from "../Sidebar/ProgressSidebar";
import { ContractTypeInfo } from "../Sidebar/ContractTypeInfo";
import { useContractForm } from "~/hooks/useContractForm";
import type { ContractFormData, FileAttachment } from "~/types/contract.types";
import styles from "./BasicContractForm.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";

const cx = classNames.bind(styles);

const BasicContractForm = () => {
    const { formData, setStep1Data, nextStep, validateStep, currentStep } = useContractForm();
    const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);

    // Tạo defaultValues từ formData trong store
    const defaultValues: Partial<ContractFormData> = {
        title: formData.title,
        contractType: formData.contractType,
        creationDate: formData.creationDate,
        dateRange: formData.dateRange,
        details: formData.details,
        milestones: formData.milestones,
    };

    const handleFormSubmit = (data: ContractFormData) => {
        console.log("Form submitted with data:", data);

        // Lưu dữ liệu vào store
        const formDataWithFiles = {
            ...data,
            attachments: attachedFiles,
        };

        // Cập nhật dữ liệu step 1
        setStep1Data(formDataWithFiles);

        // Validate và chuyển sang step 2
        if (validateStep(1)) {
            console.log("Step 1 validation passed, moving to step 2");
            nextStep();
        } else {
            console.log("valid");

            // alert("Thông tin chưa hợp lệ, vui lòng kiểm tra lại các trường bắt buộc.");
        }
    };

    const handleError = (errors: FieldErrors) => {
        console.log("Form validation errors:", errors);
        // alert("Vui lòng kiểm tra lại thông tin đã nhập.");
    };

    return (
        <div className={cx("basic-form-container")}>
            <div className={cx("form-header")}>
                <h2>
                    <FontAwesomeIcon icon={faFileContract} />
                    Tạo hợp đồng mới - Giai đoạn {currentStep}
                </h2>
                <p>Điền thông tin cơ bản của hợp đồng để bắt đầu quá trình quản lý</p>
            </div>

            <div className={cx("form-content")}>
                <div className={cx("form-section")}>
                    <Form<ContractFormData>
                        className={cx("form-section")}
                        defaultValues={defaultValues}
                        onSubmit={handleFormSubmit}
                        onError={handleError}
                    >
                        <ContractManagementSection />

                        <GeneralInfoSection />

                        <ContractContentSection selectedType={formData.contractType} />

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
                    <ContractTypeInfo selectedType={formData.contractType} />
                </div>
            </div>
        </div>
    );
};

export default BasicContractForm;
