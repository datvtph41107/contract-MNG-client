import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTruckPickup, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./ProgressBarHeader.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const steps = [
    { label: "Choose Date", icon: faCheck, status: "completed" },
    { label: "Choose Campsite", icon: faCheck, status: "completed" },
    { label: "Choose RV", icon: faTruckPickup, status: "active" },
    { label: "Booking Check", icon: faMapMarkerAlt, status: "upcoming" },
];

const ProgressBarHeader = () => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                {steps.map((step, index) => (
                    <div key={index} className={cx("step", step.status)}>
                        {index !== 0 && <div className={cx("line", steps[index - 1].status)} />}
                        <div className={cx("icon-circle")}>
                            <div className={cx("icon-circle_box")}>
                                {step.status === "completed" ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={step.icon} />}
                            </div>
                        </div>
                        <span className={cx("label")}>{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressBarHeader;
