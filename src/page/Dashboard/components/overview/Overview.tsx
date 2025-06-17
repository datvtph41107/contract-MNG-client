// src/components/Overview.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Overview.module.scss";
import classNames from "classnames/bind";
import { FaDownload } from "react-icons/fa";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const Overview = () => {
    const progressBlocks = Array.from({ length: 92 });
    const stages = ["Preparation", "Internal Audit", "Audit", "Report"];
    return (
        <div className={cx("overview-card")}>
            <div className={cx("overview-card_contain")}>
                <div className={cx("header")}>
                    <div className={cx("title-group")}>
                        <div className={cx("title-group_avatar")}>
                            {/* <img src="/soc2-icon.png" alt="SOC 2" className={cx("icon")} /> */}
                        </div>
                        <h3>Hợp đồng giao dịch </h3>
                        <p className={cx("title-estimate")}>(23/07/2025 - 24/08/2025)</p>
                    </div>
                    <div className={cx("completion")}>
                        <span className={cx("completion-label")}>Completion:</span>
                        <div className={cx("completion-label_progress")}>
                            <FontAwesomeIcon className={cx("completion-label_progress-icon")} icon={faSpinner} />
                            <span className={cx("completion-label_percent")}>100%</span>
                        </div>
                    </div>
                </div>

                <div className={cx("status")}>
                    <div className={cx("status-label")}>
                        Hoạt động: <span className={cx("status-label_main")}>92</span> / 92 hoạt động hoàn thành
                    </div>
                    <p className={cx("assigned")}>100% assigned</p>
                </div>

                <div className={cx("blocks")}>
                    {progressBlocks.map((_, idx) => (
                        <div key={idx} className={cx("block")}></div>
                    ))}
                </div>

                <div className={cx("progress-audit")}>
                    <div className={cx("progress-audit_des")}>
                        <h4>Audit soc 2</h4>
                        <div className={cx("progress-audit_box")}>
                            Dowload Report <FaDownload />
                        </div>
                    </div>
                    <div className={cx("progress-step")}>
                        <div className={cx("progress-stages")}>
                            {stages.map((label, index) => (
                                <div key={index} className={cx("stage")}>
                                    <div className={cx("line")} />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
