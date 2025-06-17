import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import TableCard from "./TableCard";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Overview from "./components/overview/Overview";
import ChartOverview from "./components/chart/ChartOverview";
import ActivityStaff from "./components/activity/ActivityStaff";

const cx = classNames.bind(styles);

const Dashboard = () => {
    const [showAll, setShowAll] = useState(false);
    const overviews = Array.from({ length: 5 });

    return (
        <div className={cx("wrapper")}>
            <TableCard />

            <div className={cx("overview")}>
                <div className={cx("overview-chart")}>
                    <div className={cx("overview-title")}>
                        <h3>Tổng quan hệ thống</h3>
                    </div>
                    <ChartOverview />
                    <div className={cx("overview-line")}>
                        <div className={cx("line")}></div>
                        <div className={cx("box-line")}>Hoạt động giám sát</div>
                        <div className={cx("line")}></div>
                    </div>
                    <div className={cx("overview-activity")}>
                        <ActivityStaff />
                    </div>
                </div>

                <div className={cx("overview-title")}>
                    <h3>Hợp đồng mới nhất</h3>
                    <Link to={"/contract"}>
                        <FontAwesomeIcon icon={faChevronRight} /> Truy cập
                    </Link>
                </div>

                <div className={cx("overview-fade-wrapper")}>
                    <div className={cx("overview-group", { faded: !showAll })}>
                        {overviews.slice(0, showAll ? overviews.length : 3).map((_, index) => (
                            <Overview key={index} />
                        ))}
                    </div>

                    {!showAll && (
                        <button className={cx("see-more")} onClick={() => setShowAll(true)}>
                            Xem thêm
                        </button>
                    )}
                </div>

                {showAll && (
                    <div className={cx("see-less-wrapper")}>
                        <button className={cx("see-less")} onClick={() => setShowAll(false)}>
                            Thu gọn
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
