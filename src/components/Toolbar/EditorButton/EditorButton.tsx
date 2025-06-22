"use client";

import { useState, useRef, useEffect } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { Level } from "@tiptap/extension-heading";
import { SketchPicker, type ColorResult } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAlignLeft,
    faAlignCenter,
    faAlignRight,
    faAlignJustify,
    faChevronDown,
    faList,
    faListOl,
    faImage,
    faUpload,
    faMagnifyingGlass,
    faLink,
    faTextHeight,
} from "@fortawesome/free-solid-svg-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { useEditorStore } from "~/store/editor-store";
import classNames from "classnames/bind";
import styles from "./EditorButton.module.scss";
import { DropdownToolbar } from "../DropdownToolbar/DropdownToolbar";

const cx = classNames.bind(styles);
const IconButton = ({ icon }: { icon: IconProp }) => <FontAwesomeIcon icon={icon} className={cx("icon")} />;

// Hook được cải thiện để tránh xung đột timeout
const useToolbarInteraction = () => {
    const { setInteractingWithToolbar } = useEditorStore();

    const handleInteraction = (callback?: () => void) => {
        // Chỉ thực hiện callback, không set interaction state
        // vì DropdownToolbar sẽ quản lý state này
        callback?.();
    };

    const handleNonDropdownInteraction = (callback?: () => void) => {
        // Dành cho các button không phải dropdown
        setInteractingWithToolbar(true);
        callback?.();
        setTimeout(() => {
            setInteractingWithToolbar(false);
        }, 300);
    };

    return { handleInteraction, handleNonDropdownInteraction };
};

export const LineHeightButton = () => {
    const { editor } = useEditorStore();
    const { handleInteraction } = useToolbarInteraction();

    const lineHeights = [
        { label: "Default", value: "normal" },
        { label: "Single", value: "1" },
        { label: "1.15", value: "1.15" },
        { label: "1.5", value: "1.5" },
        { label: "Double", value: "2" },
    ];
    const currentLineHeight = editor?.getAttributes("paragraph").lineHeight || "normal";

    return (
        <DropdownToolbar
            trigger={
                <button className={cx("trigger")}>
                    <FontAwesomeIcon icon={faTextHeight} />
                    <IconButton icon={faChevronDown} />
                </button>
            }
        >
            {lineHeights.map(({ label, value }) => (
                <div
                    key={value}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleInteraction(() => {
                            editor?.chain().focus().setLineHeight(value).run();
                        });
                    }}
                    className={cx("dropdown-item", { active: currentLineHeight === value })}
                >
                    {label}
                </div>
            ))}
        </DropdownToolbar>
    );
};

export const ListButton = () => {
    const { editor } = useEditorStore();
    const { handleInteraction } = useToolbarInteraction();

    const lists = [
        {
            label: "Bullet List",
            icon: faList,
            isActive: () => editor?.isActive("bulletList"),
            onClick: () => editor?.chain().focus().toggleBulletList().run(),
        },
        {
            label: "Ordered List",
            icon: faListOl,
            isActive: () => editor?.isActive("orderedList"),
            onClick: () => editor?.chain().focus().toggleOrderedList().run(),
        },
    ];

    return (
        <DropdownToolbar
            trigger={
                <button className={cx("trigger")}>
                    <IconButton icon={faList} />
                    <IconButton icon={faChevronDown} />
                </button>
            }
        >
            {lists.map(({ label, icon, onClick, isActive }) => (
                <div
                    key={label}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleInteraction(onClick);
                    }}
                    className={cx("dropdown-item", { active: isActive() })}
                >
                    <IconButton icon={icon} />
                    <span>{label}</span>
                </div>
            ))}
        </DropdownToolbar>
    );
};

export const AlignButton = () => {
    const { editor } = useEditorStore();
    const { handleInteraction } = useToolbarInteraction();

    const alignments = [
        { label: "Align Left", value: "left", icon: faAlignLeft },
        { label: "Align Center", value: "center", icon: faAlignCenter },
        { label: "Align Right", value: "right", icon: faAlignRight },
        { label: "Align Justify", value: "justify", icon: faAlignJustify },
    ];

    return (
        <DropdownToolbar
            trigger={
                <button className={cx("trigger")}>
                    <IconButton icon={faAlignLeft} />
                    <IconButton icon={faChevronDown} />
                </button>
            }
        >
            {alignments.map(({ label, value, icon }) => (
                <div
                    key={value}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleInteraction(() => {
                            editor?.chain().focus().setTextAlign(value).run();
                        });
                    }}
                    className={cx("dropdown-item", { active: editor?.isActive({ textAlign: value }) })}
                >
                    <IconButton icon={icon} />
                    <span>{label}</span>
                </div>
            ))}
        </DropdownToolbar>
    );
};

export const ImageButton = () => {
    const { editor } = useEditorStore();
    const { handleNonDropdownInteraction } = useToolbarInteraction();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const onChange = (src: string) => {
        editor?.chain().focus().setImage({ src }).run();
    };

    const onUpload = () => {
        handleNonDropdownInteraction(() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";

            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    onChange(imageUrl);
                }
            };

            input.click();
        });
    };

    const handleImageUrlSubmit = () => {
        handleNonDropdownInteraction(() => {
            if (imageUrl) {
                onChange(imageUrl);
                setImageUrl("");
                setIsDialogOpen(false);
            }
        });
    };

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        className={cx("toolbar-btn")}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNonDropdownInteraction();
                        }}
                    >
                        <IconButton icon={faImage} />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content sideOffset={4} className={cx("dropdown")}>
                    <DropdownMenu.Item onClick={onUpload} className={cx("dropdown-item")} onSelect={(e) => e.preventDefault()}>
                        <IconButton icon={faUpload} />
                        Upload
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNonDropdownInteraction(() => setIsDialogOpen(true));
                        }}
                        className={cx("dropdown-item")}
                        onSelect={(e) => e.preventDefault()}
                    >
                        <IconButton icon={faMagnifyingGlass} /> Paste image URL
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className={cx("dialog-overlay")} />
                    <Dialog.Content className={cx("dialog-content")}>
                        <Dialog.Title className={cx("dialog-title")}>Insert image URL</Dialog.Title>

                        <input
                            placeholder="Insert image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleImageUrlSubmit();
                            }}
                            className={cx("input")}
                        />

                        <div className={cx("dialog-footer")}>
                            <button onClick={handleImageUrlSubmit} className={cx("btn")}>
                                Insert
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

export const LinkButton = () => {
    const { editor, setInteractingWithToolbar, clearInteractionTimeout } = useEditorStore();
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const onChange = (href: string) => {
        if (href.trim()) {
            editor?.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
        }
        setValue("");
        setIsOpen(false);
    };

    // Handle input focus to prevent toolbar from hiding
    const handleInputFocus = () => {
        clearInteractionTimeout();
        setInteractingWithToolbar(true);
    };

    const handleInputBlur = () => {
        // Small delay to allow for other interactions
        setTimeout(() => {
            if (!isOpen) {
                setInteractingWithToolbar(false);
            }
        }, 100);
    };

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Focus input after dropdown opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    return (
        <DropdownMenu.Root
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (open) {
                    clearInteractionTimeout();
                    setInteractingWithToolbar(true);
                    setValue(editor?.getAttributes("link").href || "");
                } else {
                    setTimeout(() => {
                        setInteractingWithToolbar(false);
                    }, 200);
                }
            }}
        >
            <DropdownMenu.Trigger asChild>
                <button
                    className={cx("link-trigger")}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <FontAwesomeIcon icon={faLink} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                sideOffset={4}
                className={cx("dropdown")}
                onCloseAutoFocus={(e) => {
                    // Prevent auto focus back to trigger
                    e.preventDefault();
                }}
            >
                <div className={cx("link-container")} onClick={(e) => e.stopPropagation()}>
                    <input
                        ref={inputRef}
                        type="text"
                        className={cx("link-input")}
                        placeholder="https://example.com"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onChange(value);
                            }
                            if (e.key === "Escape") {
                                e.preventDefault();
                                setIsOpen(false);
                            }
                        }}
                        onMouseDown={(e) => {
                            // Allow normal input interaction
                            e.stopPropagation();
                        }}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(value);
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className={cx("link-apply")}
                    >
                        Apply
                    </button>
                    {value && <p className={cx("link-preview")}>{value}</p>}
                </div>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export const TextColorButton = () => {
    const { editor } = useEditorStore();
    const { handleInteraction } = useToolbarInteraction();

    const value = editor?.getAttributes("textStyle").color || "black";

    const onChange = (color: ColorResult) => {
        handleInteraction(() => {
            editor?.chain().focus().setColor(color.hex).run();
        });
    };

    return (
        <DropdownToolbar
            trigger={
                <button className={cx("color-trigger")}>
                    <span className={cx("color-label")}>A</span>
                    <div className={cx("color-preview")} style={{ backgroundColor: value }} />
                </button>
            }
        >
            <div onClick={(e) => e.stopPropagation()}>
                <SketchPicker color={value} onChange={onChange} />
            </div>
        </DropdownToolbar>
    );
};

export const HeadingLevelButton = () => {
    const { editor } = useEditorStore();
    const { handleInteraction } = useToolbarInteraction();

    const headings = [
        { label: "Normal text", value: 0, fontSize: "16px" },
        { label: "Heading 1", value: 1, fontSize: "20px" },
        { label: "Heading 2", value: 2, fontSize: "18px" },
        { label: "Heading 3", value: 3, fontSize: "16px" },
        { label: "Heading 4", value: 4, fontSize: "14px" },
        { label: "Heading 5", value: 5, fontSize: "13px" },
    ];

    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++) {
            if (editor?.isActive("heading", { level })) {
                return `Heading ${level}`;
            }
        }
        return "Normal text";
    };

    const handleSelect = (value: number) => {
        handleInteraction(() => {
            if (value === 0) {
                editor?.chain().setParagraph().run();
            } else {
                editor
                    ?.chain()
                    .toggleHeading({ level: value as Level })
                    .focus()
                    .run();
            }
        });
    };

    return (
        <DropdownToolbar
            trigger={
                <button className={cx("trigger")}>
                    <span>{getCurrentHeading()}</span>
                    <FontAwesomeIcon icon={faChevronDown} />
                </button>
            }
        >
            <ul className={cx("dropdown-menu")}>
                {headings.map(({ label, value, fontSize }) => (
                    <li
                        key={value}
                        style={{ fontSize }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(value);
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className={cx("dropdown-item", {
                            active: (value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value }),
                        })}
                    >
                        {label}
                    </li>
                ))}
            </ul>
        </DropdownToolbar>
    );
};
