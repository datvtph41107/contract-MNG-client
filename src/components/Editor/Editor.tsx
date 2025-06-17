import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import HighLight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";
import Toolbar from "../Toolbar";
import classNames from "classnames/bind";
import style from "./Editor.module.scss";
import { useEditorStore } from "~/store/editor-store";
import TextStyle from "@tiptap/extension-text-style";
import { FontSizeExtension } from "./extensions/font-size";
import { LineHeightExtension } from "./extensions/line-height";

const cx = classNames.bind(style);

export const Editor = () => {
    const { setEditor } = useEditorStore();

    const editor = useEditor({
        immediatelyRender: false,
        onCreate({ editor }) {
            setEditor(editor);
        },
        onDestroy() {},
        onUpdate({ editor }) {
            setEditor(editor);
        },
        onSelectionUpdate({ editor }) {
            setEditor(editor);
        },
        onTransaction() {
            setEditor(editor);
        },
        onFocus({ editor }) {
            setEditor(editor);
        },
        onBlur({ editor }) {
            setEditor(editor);
        },
        onContentError({ editor }) {
            setEditor(editor);
        },
        editorProps: {
            attributes: {
                style: "padding-left: 56px; padding-right: 56px",
                class: cx("editor-content"),
            },
        },
        extensions: [
            StarterKit,
            TaskList,
            Color,
            FontSizeExtension,
            LineHeightExtension,
            HighLight.configure({
                multicolor: true,
            }),
            FontFamily,
            TextStyle,
            Image,
            ImageResize,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            TaskItem.configure({ nested: true }),
            Table.configure({
                resizable: true,
            }),
            Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
            TableRow,
            TableHeader,
            TableCell,
            Underline,
        ],
        content: `
  <p>Welcome to the editor</p>
  <p></p>
`,
    });

    return (
        <div className={cx("editor-wrapper")}>
            {editor && <Toolbar />}
            <EditorContent editor={editor} />
        </div>
    );
};
