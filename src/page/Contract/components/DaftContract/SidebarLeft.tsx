// SidebarLeft/index.tsx
import styles from "./SidebarLeft.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown, faArrowRightArrowLeft, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FaEllipsisH, FaEyeSlash } from "react-icons/fa";
import React from "react";

const cx = classNames.bind(styles);

interface Page {
    id: number | string;
    name: string;
    active: boolean;
    hidden?: boolean;
}

interface SidebarLeftProps {
    pages: Page[];
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ pages }) => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("section")}>
                <div className={cx("header_left")}>
                    <h4>Page 1</h4>
                    <div className={cx("header_layer")}>
                        <button className={cx("add-btn")}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <div>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    </div>
                </div>

                <div className={cx("template-box")}>
                    <div className={cx("template-box_group")}>
                        <div className={cx("template-box_preview")}></div>
                        <div className={cx("template-box_title")}>
                            <p className={cx("template-label")}>Template</p>
                            <p className={cx("template-label-title")}>Simple Contract</p>
                        </div>
                    </div>
                    <button className={cx("change-btn")}>
                        <FontAwesomeIcon className={cx("change-btn-ic")} icon={faArrowRightArrowLeft} />
                    </button>
                </div>

                <div className={cx("item")}>
                    <span className={cx("icon")}>
                        <FontAwesomeIcon icon={faTableCells} />
                    </span>
                    <span>Introductory section</span>
                    <FaEllipsisH className={cx("dot")} />
                </div>

                <div className={cx("item", "active")}>
                    <span className={cx("icon")}>
                        <FontAwesomeIcon icon={faTableCells} />
                    </span>
                    <span>Scope of work</span>
                    <FaEllipsisH className={cx("dot")} />
                </div>
            </div>

            <div className={cx("section")}>
                <div className={cx("navigator")}>
                    <div className={cx("header_left")}>
                        <span className={cx("header_left-navigator")}>Navigator</span>
                        <div className={cx("header_layer")}>
                            <button className={cx("add-btn_navigator")}>
                                <FontAwesomeIcon icon={faPlus} /> Page
                            </button>
                            <div>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        </div>
                    </div>
                    <ul className={cx("page-list")}>
                        {pages.map((page) => (
                            <li key={page.id} className={cx("page-item", { active: page.active })}>
                                <div className={cx("left")}>
                                    <span className={cx("drag-icon")}>☰</span>
                                    <div className={cx("thumbnail")} />
                                    <span>{page.name}</span>
                                </div>
                                <div className={cx("right")}>
                                    {page.hidden && <FaEyeSlash className={cx("icon")} />}
                                    <FaEllipsisH className={cx("icon")} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={cx("section")}>
                <div className={cx("styling-section")}>
                    <div className={cx("header_left")}>
                        <span className={cx("header_left-navigator")}>Styling</span>
                        <div className={cx("header_layer")}>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    </div>
                    <div className={cx("branding")}>
                        <div className={cx("logo-placeholder")}>Logo</div>
                        <button className={cx("change-btn")}>
                            <FontAwesomeIcon className={cx("change-btn-ic")} icon={faArrowRightArrowLeft} />
                        </button>
                    </div>
                    <div className={cx("styling-options")}>
                        <div className={cx("row")}>
                            <label>Bg</label>
                            <div className={cx("input-box")}>#ffffff</div>
                        </div>
                        <div className={cx("row")}>
                            <label>Text</label>
                            <div className={cx("input-box", "with-color")}>
                                <span className={cx("color-dot")} style={{ backgroundColor: "#0A2540" }} />
                                #0A2540
                            </div>
                        </div>
                        <div className={cx("row")}>
                            <label>Font</label>
                            <div className={cx("input-box")}>Poppins</div>
                        </div>
                        <div className={cx("row")}>
                            <label>Font size</label>
                            <div className={cx("input-box")}>12pt</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarLeft;
