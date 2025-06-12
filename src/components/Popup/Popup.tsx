import React, { useState, useEffect, isValidElement, cloneElement } from "react";
import {
    useFloating,
    offset,
    flip,
    shift,
    useHover,
    useClick,
    useDismiss,
    useInteractions,
    autoUpdate,
} from "@floating-ui/react-dom-interactions";
import classNames from "classnames/bind";
import styles from "./Popup.module.scss";

const cx = classNames.bind(styles);

type TriggerType = "click" | "hover";

interface PopupProps {
    children: React.ReactElement; // ⚠️ cần là element để clone và gắn ref
    popupContent: React.ReactNode;
    popupClassName?: string;
    triggerType?: TriggerType;
    placement?: "top" | "bottom" | "left" | "right";
}

const Popup: React.FC<PopupProps> = ({ children, popupContent, popupClassName, triggerType = "click", placement = "bottom" }) => {
    const [open, setOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        // placement,
        // middleware: [offset(8), flip(), shift()],
        // whileElementsMounted: autoUpdate,
    });

    const click = useClick(context, { enabled: triggerType === "click" });
    const hover = useHover(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss]);

    // Safe clone with ref
    const trigger = isValidElement(children)
        ? cloneElement(children, {
              ref: refs.setReference,
              ...getReferenceProps(),
              className: cx("trigger", children.props.className),
          })
        : null;
    console.log(trigger);

    useEffect(() => {
        if (refs.reference instanceof HTMLElement) {
            console.log("✅ Ref attached to:", refs.reference);
        }
    }, [refs.reference]);

    return (
        <>
            {trigger}
            {/* {open && ( */}
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className={cx("popup", popupClassName)}>
                {popupContent}
            </div>
            {/* )} */}
        </>
    );
};

export default Popup;
