import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import TextArea from "~/components/TextArea";
import DateRangePicker from "~/components/DateRangePicker/DateRangePicker";
import { ContractContentRenderer } from "../contract-content/contract-content-renderer";
import type { DateRange } from "~/types/contract.types";
import classNames from "classnames/bind";
import styles from "../BasicContractForm.module.scss";

const cx = classNames.bind(styles);

interface ContractContentSectionProps {
    contractType: string;
    dateRange: DateRange;
    onDateRangeChange: (range: DateRange) => void;
}

export const ContractContentSection = ({ contractType, dateRange, onDateRangeChange }: ContractContentSectionProps) => {
    return (
        <div className={cx("section-card")}>
            <h3>
                <FontAwesomeIcon icon={faFileContract} />
                3. Nội dung hợp đồng
            </h3>

            <div className={cx("form-group", "full-width")}>
                <label className={cx("form-label")}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Thời gian hiệu lực *
                </label>
                <DateRangePicker value={dateRange} onChange={onDateRangeChange} placeholder="Chọn thời gian bắt đầu và kết thúc" />
            </div>

            <TextArea
                name="description"
                label="Mô tả tổng quan hợp đồng *"
                placeholder="Mô tả tổng quan về mục đích, ý nghĩa và tầm quan trọng của hợp đồng"
                required="Vui lòng mô tả hợp đồng"
                rows={3}
            />

            {/* <ContractContentRenderer contractType={contractType} /> */}
        </div>
    );
};
