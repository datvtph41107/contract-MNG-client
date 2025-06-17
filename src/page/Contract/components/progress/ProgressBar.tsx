import styles from "./ProgressBar.module.scss";
import classNames from "classnames/bind";
import ProgressBarHeader from "./ProgressBarHeader";

const cx = classNames.bind(styles);

const ProgressBar = () => {
    return (
        <div className={cx("progress-bar-container")}>
            <div className={cx("container")}>
                <ProgressBarHeader />
            </div>
        </div>
    );
};

export default ProgressBar;
