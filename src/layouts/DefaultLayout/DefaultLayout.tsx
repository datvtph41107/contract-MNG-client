import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Sidebar from "../components/Sidebar";

const cx = classNames.bind(styles);

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showChildren, setShowChildren] = useState(true);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setCollapsed(e.matches);
            setShowChildren(!e.matches);
        };

        setCollapsed(mediaQuery.matches);
        setShowChildren(!mediaQuery.matches);

        mediaQuery.addEventListener("change", handleMediaChange);
        return () => mediaQuery.removeEventListener("change", handleMediaChange);
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
            <div className={cx("main", { collapsed })}>
                <div className={cx("main-board")}>
                    <header className={cx("header")}>
                        <div>
                            <h1 className={cx("page-title")}>Dasboard</h1>
                        </div>
                        <p>Last updated 24 minutes ago</p>
                    </header>
                    <main className={cx("content")}>{children}</main>
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
