import classNames from "classnames/bind";
import styles from "./AdminLogin.module.scss";

const cx = classNames.bind(styles);

const AdminLogin = () => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("form-box")}>
                <h1 className={cx("title")}>Quản trị hệ thống</h1>

                <form className={cx("form")}>
                    <input type="text" className={cx("input")} placeholder="Tên đăng nhập" />
                    <input type="password" className={cx("input")} placeholder="Mật khẩu" />

                    <button type="submit" className={cx("submit-button")}>
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
