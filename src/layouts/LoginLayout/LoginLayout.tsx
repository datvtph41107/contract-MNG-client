import classNames from "classnames/bind";
import styles from "./LoginLayout.module.scss";

const cx = classNames.bind(styles);

const LoginLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("content")} style={{ position: "relative", zIndex: "1" }}>
                {children}
            </div>
        </div>
    );
};

export default LoginLayout;
