import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import classNames from "classnames/bind";
import styles from "./Popup.module.scss";
import type { Placement } from "tippy.js";
import type { ReactNode } from "react";

const cx = classNames.bind(styles);

interface PopupProps {
    content: ReactNode;
    children: ReactNode;
    placement?: Placement;
    trigger?: "mouseenter focus" | "click";
    popupType?: "info" | "warning" | "success" | "error";
    offset?: [number, number];
}

export default function Popup({
    content,
    children,
    placement = "top",
    trigger = "mouseenter focus",
    popupType = "info",
    offset = [0, 10],
}: PopupProps) {
    return (
        <Tippy
            content={<div className={cx("popup", popupType)}>{content}</div>}
            placement={placement}
            interactive={true}
            delay={[0, 50]}
            offset={offset}
            arrow={true}
            trigger={trigger}
        >
            <div className={cx("popup-wrapper")}>{children}</div>
        </Tippy>
    );
}
