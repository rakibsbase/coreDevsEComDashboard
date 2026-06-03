"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";

// ─── Lucide Icons ─────────────────────────────────────────────────────────────
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  Quote,
  Code,
  Minus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RichTextEditorProps {
  value: string;            // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────
interface ToolbarBtnProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarBtn({ onClick, isActive, disabled, title, children }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent editor blur
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`
        p-1.5 rounded-lg transition-all duration-150 cursor-pointer select-none
        flex items-center justify-center shrink-0
        ${isActive
          ? "bg-primary text-white shadow-sm"
          : "text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-zinc-700/60"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-px h-5 bg-border-divider/80 rounded shrink-0 mx-0.5" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your product description here…",
  maxLength = 2000,
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable built-ins we replace/extend
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
        blockquote: {},
        code: {},
        codeBlock: false,
        horizontalRule: {},
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxLength }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2 cursor-pointer",
        },
      }),
      TextStyle,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] max-h-[340px] overflow-y-auto p-4 text-xs font-semibold text-text-primary leading-relaxed outline-none focus:outline-none prose prose-sm max-w-none prose-invert-auto",
      },
    },
    onUpdate({ editor }) {
      // Return empty string when editor is empty so state stays clean
      const html = editor.isEmpty ? "" : editor.getHTML();
      onChange(html);
    },
    // Sync external value changes (e.g. when editing an existing product)
    onCreate({ editor }) {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    },
    immediatelyRender: false, // SSR safe
  });

  // ── Link handler ──────────────────────────────────────────────────────────
  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", prev ?? "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const charCount = editor.storage.characterCount?.characters?.() ?? 0;
  const wordCount = editor.storage.characterCount?.words?.() ?? 0;
  const nearLimit = charCount > maxLength * 0.85;

  return (
    <div
      className={`
        border border-border-divider rounded-xl overflow-hidden
        focus-within:border-primary focus-within:ring-1 focus-within:ring-primary
        transition-all duration-200 bg-bg-card
        ${className}
      `}
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="bg-gray-50/75 dark:bg-zinc-800/20 border-b border-border-divider px-3 py-2 flex flex-wrap items-center gap-1 select-none">

        {/* History */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={13} />
        </ToolbarBtn>

        <Divider />

        {/* Headings */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={13} />
        </ToolbarBtn>

        <Divider />

        {/* Inline formatting */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <Code size={13} />
        </ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <AlignJustify size={13} />
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={13} />
        </ToolbarBtn>

        <Divider />

        {/* Block elements */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={13} />
        </ToolbarBtn>

        <Divider />

        {/* Link */}
        <ToolbarBtn
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Insert / Edit Link"
        >
          <LinkIcon size={13} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          title="Remove Link"
        >
          <Unlink size={13} />
        </ToolbarBtn>
      </div>

      {/* ── Editor Body ───────────────────────────────────────────────────── */}
      <EditorContent editor={editor} />

      {/* ── Footer: char / word count ─────────────────────────────────────── */}
      <div className="border-t border-border-divider/60 px-4 py-1.5 flex items-center justify-between bg-gray-50/40 dark:bg-zinc-800/10">
        <span className="text-[10px] font-semibold text-text-secondary">
          {wordCount} word{wordCount !== 1 ? "s" : ""}
        </span>
        <span
          className={`text-[10px] font-bold tabular-nums transition-colors ${
            nearLimit ? "text-orange-500" : "text-text-secondary"
          }`}
        >
          {charCount} / {maxLength}
        </span>
      </div>
    </div>
  );
}
