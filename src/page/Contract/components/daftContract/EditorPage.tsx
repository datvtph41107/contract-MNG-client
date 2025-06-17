import classNames from "classnames/bind";
import styles from "./EditorPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCopy, faUpDownLeftRight, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const EditorPage = () => {
    return (
        <div className={cx("page-wrapper")}>
            {/* Tag Page */}
            <div className={cx("page-tag")}>Page 1</div>
            <div className={cx("page-control")}>
                <div className={cx("page-control_box", "box_left")}>
                    <FontAwesomeIcon icon={faCirclePlus} />
                </div>
                <div className={cx("page-control_box")}>
                    <FontAwesomeIcon icon={faCopy} />
                </div>
                <div className={cx("page-control_box")}>
                    <FontAwesomeIcon icon={faUpDownLeftRight} />
                </div>
                <div className={cx("page-control_box", "box_right")}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </div>
            </div>

            {/* Document Content */}
            <div className={cx("document")}>
                {/* Header */}
                <div className={cx("header")}>
                    <h2>Design Contract Agreement</h2>
                    <p>
                        This Design Service Agreement (the "Agreement") is made and entered into on 21 Dec 2022 by and between{" "}
                        <strong>Google</strong> ("Client") and <strong>Toni Tagx</strong> ("Contractor").
                    </p>
                </div>

                {/* Section: Scope of Work */}
                <div className={cx("section-box")}>
                    <div className={cx("section-title")}>Scope of work</div>
                    <div className={cx("section-content")}>
                        <h3>1. Scope of work</h3>
                        <p>Contractor will provide the following services to Client:</p>
                        <ul>
                            <li>
                                <strong>Branding services</strong>, including brand strategy consultation, logo design, brand guidelines...
                            </li>
                            <li>Web design services for the Client.</li>
                        </ul>

                        {/* Mock Toolbar */}
                        <div className={cx("toolbar")}>
                            <button>Undo</button>
                            <select>
                                <option>Normal text</option>
                                <option>Heading 1</option>
                            </select>
                            <button>B</button>
                            <button>I</button>
                            <button>U</button>
                            <button>•</button>
                            <button>🔗</button>
                            <button>“”</button>
                            <button>⋯</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
