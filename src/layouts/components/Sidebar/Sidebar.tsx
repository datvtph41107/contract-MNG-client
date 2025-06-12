import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { sidebarItems } from "./sidebarItems";
import { useLocation, Link } from "react-router-dom";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Popup from "~/components/Popup";

const cx = classNames.bind(styles);

const Sidebar = ({ collapsed, showChildren, onToggle }: { collapsed: boolean; showChildren: boolean; onToggle: () => void }) => {
    const location = useLocation();

    return (
        <div
            className={cx("sidebar", {
                collapsed,
                "show-children": showChildren && !collapsed,
                animated: true,
            })}
        >
            <div className={cx("header-group")}>
                <div className={cx("header")}>
                    <div className={cx("header-box")}>P</div>
                    <div className={cx("header-detail")}>
                        <p className={cx("header-detail-name")}>Nguyễn Văn P</p>
                        <span className={cx("header-detail-dep")}>Trưởng phòng hành chính</span>
                    </div>
                </div>
                {window.innerWidth > 768 && (
                    <div className={cx("header-collapse")} onClick={onToggle}>
                        {collapsed ? <TbLayoutSidebarRightCollapseFilled /> : <TbLayoutSidebarLeftCollapseFilled />}
                    </div>
                )}
            </div>

            <div className={cx("side-content")}>
                <div className={cx("group-section")}>
                    {sidebarItems.map((item, idx) => {
                        if ("label" in item && "path" in item) {
                            return (
                                <ul key={item.path} className={cx("menu")}>
                                    <li className={cx("menu-item", { active: idx === 0 })}>
                                        <Link
                                            className={cx("menu-group")}
                                            to={item.path as string}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            {item.icon && <item.icon className={cx("menu-group-icon")} />}
                                            <div className={cx("menu-group-label")}>{item.label}</div>
                                        </Link>
                                    </li>
                                </ul>
                            );
                        }

                        if ("section" in item && Array.isArray(item.items)) {
                            return (
                                <div key={idx} className={cx("section-group")}>
                                    <div className={cx("section-title-wrapper")}>
                                        {collapsed ? (
                                            <Popup
                                                triggerType="hover"
                                                placement="right"
                                                popupClassName="sidebar-popup"
                                                popupContent={
                                                    <ul className={cx("popup-sub-menu")}>
                                                        {item.items.map((subItem) => (
                                                            <li
                                                                key={subItem.path}
                                                                className={cx("popup-sub-item", {
                                                                    active: location.pathname === subItem.path,
                                                                })}
                                                            >
                                                                <Link className={cx("popup-sub-item-link")} to={subItem.path}>
                                                                    {subItem.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                }
                                            >
                                                <div className={cx("section-title", "popup-trigger")}>
                                                    {item.icon && <item.icon className={cx("section-title-icon")} />}
                                                </div>
                                            </Popup>
                                        ) : (
                                            <div className={cx("section-title")}>
                                                {item.icon && <item.icon className={cx("section-title-icon")} />}
                                                <div className={cx("section-title-ic")}>{item.section}</div>
                                                <FontAwesomeIcon className={cx("ft")} icon={faCaretDown} />
                                            </div>
                                        )}
                                    </div>

                                    {!collapsed && (
                                        <ul className={cx("section-sub")}>
                                            {item.items.map((subItem) => (
                                                <li
                                                    key={subItem.path}
                                                    className={cx("section-sub-item", {
                                                        active: location.pathname === subItem.path,
                                                    })}
                                                >
                                                    <Link className={cx("section-sub-item-link")} to={subItem.path}>
                                                        {subItem.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>

                <div className={cx("footer")}>
                    {!collapsed ? (
                        <>
                            <p>Send feedback</p>
                            <p>Documentation</p>
                            <p>Status</p>
                            <p className={cx("branding")}>11 ⬤ oneleet</p>
                        </>
                    ) : (
                        <div title="More options" className={cx("footer-icon")}>
                            <img src="/avatar.png" alt="avatar" className={cx("avatar")} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
