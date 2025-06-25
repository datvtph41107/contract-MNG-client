import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import Input from "~/components/Input";
import SidebarDropdown from "../../../Dropdown/Dropdown";
import { CONTRACT_TYPES, EMPLOYEES } from "~/constants/contract.constant";
import classNames from "classnames/bind";
import styles from "../BasicContractForm.module.scss";

const cx = classNames.bind(styles);

interface GeneralInfoSectionProps {
    selectedType: string;
    selectedDrafter: string;
    selectedManager: string;
    onContractTypeChange: (value: string) => void;
    onDrafterChange: (value: string) => void;
    onManagerChange: (value: string) => void;
}

export const GeneralInfoSection = ({
    selectedType,
    selectedDrafter,
    selectedManager,
    onContractTypeChange,
    onDrafterChange,
    onManagerChange,
}: GeneralInfoSectionProps) => {
    return (
        <div className={cx("section-card")}>
            <h3>
                <FontAwesomeIcon icon={faFileContract} />
                2. Thông tin chung
            </h3>
            <div className={cx("form-grid")}>
                <Input
                    name="title"
                    label="Tên hợp đồng *"
                    placeholder="VD: Hợp đồng cung cấp dịch vụ kế toán quý 3/2025"
                    required="Vui lòng nhập tên hợp đồng"
                />

                <div className={cx("form-group")}>
                    <label className={cx("form-label")}>Loại hợp đồng *</label>
                    <SidebarDropdown
                        options={CONTRACT_TYPES}
                        value={selectedType}
                        onChange={onContractTypeChange}
                        placeholder="Chọn loại hợp đồng"
                    />
                </div>

                <Input name="creationDate" label="Ngày tạo" placeholder="Ngày tạo tự động" disabled />

                <div className={cx("form-group")}>
                    <label className={cx("form-label")}>Người soạn thảo *</label>
                    <SidebarDropdown
                        options={EMPLOYEES}
                        value={selectedDrafter}
                        onChange={onDrafterChange}
                        placeholder="Chọn người soạn thảo"
                    />
                </div>

                <div className={cx("form-group")}>
                    <label className={cx("form-label")}>Người quản lý hợp đồng *</label>
                    <SidebarDropdown
                        options={EMPLOYEES}
                        value={selectedManager}
                        onChange={onManagerChange}
                        placeholder="Chọn người quản lý"
                    />
                </div>
            </div>
        </div>
    );
};
