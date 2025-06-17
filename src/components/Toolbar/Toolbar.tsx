import { type ColorResult, SketchPicker } from "react-color";
import { type Level } from "@tiptap/extension-heading";
import { FloatingMenu } from "@tiptap/react";
import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames/bind";
import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    ChevronDownIcon,
    HighlighterIcon,
    ImageIcon,
    ItalicIcon,
    Link2Icon,
    ListCollapseIcon,
    ListIcon,
    ListOrderedIcon,
    ListTodoIcon,
    MessageSquarePlusIcon,
    MinusIcon,
    PlusIcon,
    PrinterIcon,
    Redo2Icon,
    RemoveFormattingIcon,
    SearchIcon,
    SpellCheckIcon,
    UnderlineIcon,
    Undo2Icon,
    UploadIcon,
    type LucideIcon,
} from "lucide-react";
import styles from "./Toolbar.module.scss";
import { useEditorStore } from "~/store/editor-store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";

const cx = classNames.bind(styles);

const LineHeightButton = () => {
    const { editor } = useEditorStore();

    const lineHeights = [
        { label: "Default", value: "normal" },
        { label: "Single", value: "1" },
        { label: "1.15", value: "1.15" },
        { label: "1.5", value: "1.5" },
        { label: "Double", value: "2" },
    ];

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className={cx("trigger")}>
                    <ListCollapseIcon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className={cx("dropdown")}>
                {lineHeights.map(({ label, value }) => (
                    <button
                        className={cx({ active: editor?.getAttributes("paragraph").lineHeight === value })}
                        key={value}
                        onClick={() => editor?.chain().focus().setLineHeight(value).run()}
                    >
                        <span>{label}</span>
                    </button>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

const FontSizeButton = () => {
    const { editor } = useEditorStore();
    const currentFontSize = editor?.getAttributes("textStyle").fontSize
        ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
        : "16";

    const [fontSize, setFontSize] = useState(currentFontSize);
    const [inputValue, setInputValue] = useState(fontSize);
    const [isEditing, setIsEditing] = useState(false);

    const updateFontSize = (newSize: string) => {
        const size = parseInt(newSize);
        if (!isNaN(size) && size > 0) {
            editor?.chain().focus().setFontSize(`${size}px`).run();
            setFontSize(newSize);
            setInputValue(newSize);
            setIsEditing(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        setInputValue(inputValue);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            updateFontSize(inputValue);
            editor?.commands.focus();
        }
    };

    const increment = () => {
        const newSize = parseInt(fontSize) + 1;
        updateFontSize(newSize.toString());
    };

    const decrement = () => {
        const newSize = parseInt(fontSize) - 1;
        if (newSize > 0) {
            updateFontSize(newSize.toString());
        }
    };

    return (
        <div className="font-size-controller">
            <button onClick={decrement} className="font-size-btn">
                <MinusIcon className="icon" />
            </button>

            {isEditing ? (
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    className="font-size-input"
                />
            ) : (
                <button
                    onClick={() => {
                        setIsEditing(true);
                        setFontSize(currentFontSize);
                    }}
                    className="font-size-display"
                >
                    {currentFontSize}
                </button>
            )}

            <button onClick={increment} className="font-size-btn">
                <PlusIcon className="icon" />
            </button>
        </div>
    );
};

const ListButton = () => {
    const { editor } = useEditorStore();

    const lists = [
        {
            label: "Bullet List",
            icon: ListIcon,
            isActive: () => editor?.isActive("bulletList"),
            onClick: () => editor?.chain().focus().toggleBulletList().run(),
        },
        {
            label: "Ordered List",
            icon: ListOrderedIcon,
            isActive: () => editor?.isActive("bulletList"),
            onClick: () => editor?.chain().focus().toggleOrderedList().run(),
        },
    ];

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className={cx("trigger")}>
                    <ListIcon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className={cx("dropdown")}>
                {lists.map(({ label, icon: Icon, onClick, isActive }) => (
                    <button className={cx({ active: isActive() })} key={label} onClick={onClick}>
                        <Icon />
                        <span>{label}</span>
                    </button>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

const AlignButton = () => {
    const { editor } = useEditorStore();

    const alignments = [
        {
            label: "Align Left",
            value: "left",
            icon: AlignLeftIcon,
        },
        {
            label: "Align Center",
            value: "center",
            icon: AlignCenterIcon,
        },
        {
            label: "Align Right",
            value: "right",
            icon: AlignRightIcon,
        },
        {
            label: "Align Justify",
            value: "justify",
            icon: AlignJustifyIcon,
        },
    ];

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className={cx("trigger")}>
                    <AlignLeftIcon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className={cx("dropdown")}>
                {alignments.map(({ label, value, icon: Icon }) => (
                    <button
                        className={cx({ active: editor?.isActive({ textAlign: value }) })}
                        key={value}
                        onClick={() => editor?.chain().focus().setTextAlign(value).run()}
                    >
                        <Icon />
                        <span>{label}</span>
                    </button>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

const ImageButton = () => {
    const { editor } = useEditorStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const onChange = (src: string) => {
        editor?.chain().focus().setImage({ src }).run();
    };

    const onUpload = () => {
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
    };

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl);
            setImageUrl("");
            setIsDialogOpen(false);
        }
    };

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80">
                        <ImageIcon className="size-4" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content className="p-2 w-40 rounded bg-white border shadow">
                    <DropdownMenu.Item onClick={onUpload} className="flex items-center px-2 py-1 gap-2 hover:bg-neutral-100 rounded">
                        <UploadIcon className="size-4" />
                        Upload
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        onClick={() => setIsDialogOpen(true)}
                        className="flex items-center px-2 py-1 gap-2 hover:bg-neutral-100 rounded"
                    >
                        <SearchIcon className="size-4" />
                        Paste image URL
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                    <Dialog.Content className="fixed top-[30%] left-1/2 -translate-x-1/2 bg-white p-4 rounded shadow w-[90%] max-w-sm">
                        <Dialog.Title className="text-lg font-semibold mb-2">Insert image URL</Dialog.Title>

                        <input
                            placeholder="Insert image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleImageUrlSubmit();
                            }}
                        />

                        <div className="mt-3 flex justify-end">
                            <button onClick={handleImageUrlSubmit}>Insert</button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

const LinkButton = () => {
    const { editor } = useEditorStore();
    const [value, setValue] = useState("");

    const onChange = (href: string) => {
        editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
        setValue("");
    };

    return (
        <DropdownMenu.Root
            onOpenChange={(open) => {
                if (open) {
                    setValue(editor?.getAttributes("link").href);
                }
            }}
        >
            <DropdownMenu.Trigger asChild>
                <button className={cx("trigger")}>
                    <Link2Icon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className={cx("dropdown")}>
                {/* input link */}
                <input
                    className="w-full px-2 py-1 border rounded text-sm outline-none"
                    placeholder="https://example.com"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button onClick={() => onChange(value)}></button>
                <p className="text-xs text-gray-500 mt-1">Value: {value}</p>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

const HighLightColorButton = () => {
    const { editor } = useEditorStore();

    const value = editor?.getAttributes("highlight").color || "#FFFFF";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({ color: color.hex }).run();
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className={cx("trigger")}>
                    <HighlighterIcon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className={cx("dropdown")}>
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

const TextColorButton = () => {
    const { editor } = useEditorStore();

    const value = editor?.getAttributes("textStyle").color || "#FFFFF";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className={cx("trigger")}>
                    <span className={cx("text-label")}>A</span>
                    <div className={cx("color-preview")} style={{ backgroundColor: value }} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className={cx("dropdown")}>
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

const HeadingLevelButton = () => {
    const { editor } = useEditorStore();
    const headings = [
        { label: "Normal text", value: 0, fontSize: "16px" },
        { label: "Heading 1", value: 1, fontSize: "32px" },
        { label: "Heading 2", value: 2, fontSize: "24px" },
        { label: "Heading 3", value: 3, fontSize: "20px" },
        { label: "Heading 4", value: 4, fontSize: "18px" },
        { label: "Heading 5", value: 5, fontSize: "16px" },
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
        if (value === 0) {
            editor?.chain().focus().setParagraph().run();
        } else {
            editor
                ?.chain()
                .focus()
                .toggleHeading({ level: value as Level })
                .run();
        }
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className={cx("trigger")}>
                    <span className={cx("label")}>{getCurrentHeading()}</span>
                    <ChevronDownIcon className={cx("icon")} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className={cx("dropdown")}>
                {headings.map(({ label, value, fontSize }) => (
                    <DropdownMenu.Item
                        key={value}
                        onClick={() => handleSelect(value)}
                        className={cx("item", {
                            active: (value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value }),
                        })}
                        style={{ fontSize }}
                    >
                        {label}
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

const FontFamilyButton = () => {
    const { editor } = useEditorStore();

    const fonts = [
        { label: "Arial", value: "Arial" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Courier New", value: "Courier New" },
        { label: "Georgia", value: "Georgia" },
        { label: "Verdana", value: "Verdana" },
    ];

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className={cx("trigger")}>
                    <span className={cx("label")}>{editor?.getAttributes("textStyle").fontFamily || "Arial"}</span>
                    <ChevronDownIcon className={cx("icon")} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className={cx("dropdown")}>
                {fonts.map(({ label, value }) => (
                    <DropdownMenu.Item
                        key={value}
                        onClick={() => editor?.chain().focus().setFontFamily(value).run()}
                        className={cx("item", {
                            active: editor?.getAttributes("textStyle")?.fontFamily === value,
                        })}
                        style={{ fontFamily: value }}
                    >
                        <span>{label}</span>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
}

const ToolbarButton = ({ onClick, isActive, icon: Icon }: ToolbarButtonProps) => {
    return (
        <button className={cx("toolbar-btn", { active: isActive })} onClick={onClick}>
            <Icon className={cx("icon")} />
        </button>
    );
};

const Toolbar = () => {
    const { editor } = useEditorStore();
    const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[][] = [
        [
            {
                label: "Undo",
                icon: Undo2Icon,
                onClick: () => editor?.chain().focus().undo().run(),
            },
            {
                label: "Redo",
                icon: Redo2Icon,
                onClick: () => editor?.chain().focus().redo().run(),
            },
            {
                label: "Print",
                icon: PrinterIcon,
                onClick: () => window.print(),
            },
            {
                label: "Spell Check",
                icon: SpellCheckIcon,
                onClick: () => {
                    const current = editor?.view.dom.getAttribute("spellcheck");
                    editor?.view.dom.setAttribute("spellcheck", current === "false" ? "true" : "false");
                },
            },
        ],
        [
            {
                label: "Bold",
                icon: BoldIcon,
                isActive: editor?.isActive("bold"),
                onClick: () => editor?.chain().focus().toggleBold().run(),
            },
            {
                label: "Italic",
                icon: ItalicIcon,
                isActive: editor?.isActive("italic"),
                onClick: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
                label: "Underline",
                icon: UnderlineIcon,
                isActive: editor?.isActive("underline"),
                onClick: () => editor?.chain().focus().toggleUnderline().run(),
            },
        ],
        [
            { label: "Comment", icon: MessageSquarePlusIcon, onClick: () => console.log("2323"), isActive: false },
            {
                label: "List Todo",
                icon: ListTodoIcon,
                onClick: () => editor?.chain().focus().toggleTaskList().run(),
                isActive: editor?.isActive("taskList"),
            },
            {
                label: "Remove Formatting",
                icon: RemoveFormattingIcon,
                onClick: () => editor?.chain().focus().unsetAllMarks().run(),
                isActive: editor?.isActive("taskList"),
            },
        ],
    ];

    return (
        <FloatingMenu
            editor={editor}
            className={cx("floating-menu")}
            tippyOptions={{
                duration: 100,
                placement: "bottom-start", // 👈 Chọn vị trí phía dưới bên trái
                offset: [0, 8], // 👈 Cách con trỏ 8px
            }}
            shouldShow={({ editor }) => editor.isFocused}
        >
            {sections[0].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}

            {/* TODO: Font family */}
            <div className={cx("vertical-separator")} />
            <FontFamilyButton />
            {/* TODO: Heading */}
            <div className={cx("vertical-separator")} />
            <HeadingLevelButton />
            {/* TODO: Font size */}
            <div className={cx("vertical-separator")} />
            <FontSizeButton />
            <div className={cx("vertical-separator")} />
            {sections[1].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}

            <TextColorButton />
            <HighLightColorButton />
            <div className={cx("vertical-separator")} />
            <LinkButton />
            <ImageButton />
            <AlignButton />
            <LineHeightButton />
            <ListButton />

            {sections[2].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
        </FloatingMenu>
    );
};

export default Toolbar;
