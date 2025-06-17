import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CreateContractLayout.module.scss";
import classNames from "classnames/bind";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { routes } from "~/config/routes.config";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

interface CreateContractLayoutProps {
    children: ReactNode;
}

const CreateContractLayout: React.FC<CreateContractLayoutProps> = ({ children }) => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <Link to={routes.dashboard} className={cx("head-box")}>
                    <div className={cx("tooltip")}>
                        <FontAwesomeIcon icon={faRightToBracket} />
                        {/* <span className={cx('tooltip-text')}>Back</span> */}
                    </div>
                </Link>
                <span className={cx("head-title")}>Create a new Lesson</span>
            </div>
            {children}
        </div>
    );
};

export default CreateContractLayout;
