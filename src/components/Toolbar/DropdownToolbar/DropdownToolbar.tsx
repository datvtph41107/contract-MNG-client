"use client";

import type React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./DropdownToolbar.module.scss";
import { useEditorStore } from "~/store/editor-store";

const cx = classNames.bind(styles);

interface BaseDropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const DropdownToolbar = ({ trigger, children, className }: BaseDropdownProps) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { setInteractingWithToolbar, setInteractionTimeoutId, clearInteractionTimeout } = useEditorStore();

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            setInteractingWithToolbar(true);
            clearInteractionTimeout();
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            // Delay reset interaction state when dropdown closes
            const timeoutId = setTimeout(() => {
                setInteractingWithToolbar(false);
            }, 200);
            setInteractionTimeoutId(timeoutId);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, handleClickOutside, setInteractingWithToolbar, clearInteractionTimeout, setInteractionTimeoutId]);

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        clearInteractionTimeout();
        setOpen((prev) => !prev);
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearInteractionTimeout();
        setInteractingWithToolbar(true);
    };

    const handleItemClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearInteractionTimeout();

        setOpen(false);

        const timeoutId = setTimeout(() => {
            setInteractingWithToolbar(false);
        }, 200);
        setInteractionTimeoutId(timeoutId);
    };

    return (
        <div className={cx("dropdown-wrapper", className)} ref={dropdownRef}>
            <div
                onClick={handleTriggerClick}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                {trigger}
            </div>
            {open && (
                <div
                    className={cx("dropdown-content")}
                    onClick={handleContentClick}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <div onClick={handleItemClick}>{children}</div>
                </div>
            )}
        </div>
    );
};
