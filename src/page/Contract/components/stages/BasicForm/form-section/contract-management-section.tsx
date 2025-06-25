import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import Input from "~/components/Input";
import classNames from "classnames/bind";
import styles from "../BasicContractForm.module.scss";

const cx = classNames.bind(styles);

export const ContractManagementSection = () => {
    return (
        <div className={cx("section-card")}>
            <h3>
                <FontAwesomeIcon icon={faCode} />
                1. Quản lý hợp đồng
            </h3>
            <div className={cx("form-grid")}>
                <Input name="contractCode" label="Mã hợp đồng *" placeholder="Mã hợp đồng tự động" required="Vui lòng nhập mã hợp đồng" />
            </div>
        </div>
    );
};
