import classNames from "classnames/bind";
import styles from "../BasicContractForm.module.scss";

const cx = classNames.bind(styles);

export const ProgressSidebar = () => {
    return (
        <div className={cx("progress-card")}>
            <h4>Tiến độ tạo hợp đồng</h4>
            <div className={cx("progress-steps")}>
                <div className={cx("step", "active")}>
                    <span className={cx("step-number")}>1</span>
                    <div className={cx("step-content")}>
                        <h5>Thông tin cơ bản</h5>
                        <p>Điền thông tin chung về hợp đồng</p>
                    </div>
                </div>
                {/* section 2 */}
                {/* <div className={cx("step")}>
                    <span className={cx("step-number")}>2</span>
                    <div className={cx("step-content")}>
                        <h5>Thông tin đối tác</h5>
                        <p>Bổ sung thông tin các bên liên quan</p>
                    </div>
                </div> */}
                <div className={cx("step")}>
                    <span className={cx("step-number")}>3</span>
                    <div className={cx("step-content")}>
                        <h5>Mốc thời gian & Công việc</h5>
                        <p>Thiết lập giai đoạn và phân công</p>
                    </div>
                </div>
                <div className={cx("step")}>
                    <span className={cx("step-number")}>4</span>
                    <div className={cx("step-content")}>
                        <h5>Xem trước & Hoàn tất</h5>
                        <p>Kiểm tra và hoàn thiện hợp đồng</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
