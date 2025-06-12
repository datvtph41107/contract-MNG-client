import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Sidebar from "../components/Sidebar";

const cx = classNames.bind(styles);

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showChildren, setShowChildren] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToggleSidebar = () => {
        if (collapsed) {
            setCollapsed(false);
            setTimeout(() => setShowChildren(true), 150);
        } else {
            setShowChildren(false);
            setTimeout(() => setCollapsed(true), 100);
        }
    };

    return (
        <div className={cx("layout")}>
            <aside className={cx("sidebar", { collapsed })}>
                <Sidebar collapsed={collapsed} showChildren={showChildren} onToggle={handleToggleSidebar} />
            </aside>
            <div className={cx("main")}>
                <div className={cx("main-board")}>
                    <header className={cx("header")}>
                        <h1 className={cx("page-title")}>Vendor Directory</h1>
                    </header>
                    <main className={cx("content")}>{children}</main>
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
