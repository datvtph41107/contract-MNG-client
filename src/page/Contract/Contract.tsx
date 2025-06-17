import styles from "./Contract.module.scss";
import classNames from "classnames/bind";
import SidebarLeft from "./components/daftContract/SidebarLeft";
import SidebarRight from "./components/daftContract/SidebarRight";
import HeaderBar from "./components/daftContract/HeaderBar";
import EditorPage from "./components/daftContract/EditorPage";
const cx = classNames.bind(styles);

const pages = [
    { id: 1, name: "Page 1", active: true, hidden: false },
    { id: 2, name: "Page 2", active: false, hidden: true },
    { id: 3, name: "Page 3", active: false, hidden: false },
];

const Contract = () => {
    return (
        <div className={cx("layout")}>
            {/* Header */}
            <div className={cx("layout-head")}>
                <HeaderBar />
            </div>

            {/* Main Content */}
            <div className={cx("main")}>
                {/* Left Sidebar */}
                <div className={cx("sidebar-left")}>
                    <SidebarLeft pages={pages} />
                </div>

                {/* Editor Center */}
                <main className={cx("editor")}>
                    <div className={cx("editor-wrapper")}>
                        <EditorPage />
                        <EditorPage />
                    </div>
                </main>

                {/* Right Panel */}
                <div className={cx("sidebar-right")}>
                    <SidebarRight />
                </div>
            </div>
        </div>
    );
};

export default Contract;
