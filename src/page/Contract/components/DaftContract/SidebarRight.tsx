import classNames from "classnames/bind";
import styles from "./SidebarRight.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const SidebarRight = () => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("section")}>
                <div className={cx("header_right")}>
                    <div className={cx("header_right-layer")}>
                        <h4>Scope of work</h4>
                        <div>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    </div>
                    <p className={cx("subtext")}>Outline the work to be performed.</p>
                </div>

                <div className={cx("field")}>
                    <label>Project description</label>
                    <textarea defaultValue="Contractor will provide the following services to Client:" rows={3} />
                </div>

                <div className={cx("field")}>
                    <label>Deliverables</label>
                    <div className={cx("deliverable-input")}>
                        <input placeholder="Add new deliverable..." />
                        <button className={cx("add-btn")}>+</button>
                    </div>
                </div>

                <div className={cx("field", "date-range")}>
                    <div>
                        <label>Start Date</label>
                        <input type="date" />
                    </div>
                    <div>
                        <label>End Date</label>
                        <input type="date" />
                    </div>
                </div>

                <div className={cx("added-list")}>
                    <p className={cx("label")}>Added (2)</p>
                    <ul>
                        <li>
                            <span className={cx("dot")} />
                            <span className={cx("text")}>
                                Branding services, including brand strategy consultation, logo design, brand guidelines, and any other
                                branding materials as agreed upon by both parties.
                            </span>
                            <FontAwesomeIcon icon={faTrash} className={cx("trash")} />
                        </li>
                        <li>
                            <span className={cx("dot")} />
                            <span className={cx("text")}>
                                Web design services, including the design and development of a new website for the Client.
                            </span>
                            <FontAwesomeIcon icon={faTrash} className={cx("trash")} />
                        </li>
                    </ul>
                </div>
            </div>

            <div className={cx("section")}>
                <div className={cx("new_work")}>
                    <FontAwesomeIcon className={cx("new_work-icon")} icon={faPlus} />
                    New
                </div>
            </div>
        </div>
    );
};

export default SidebarRight;
