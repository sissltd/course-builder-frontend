"use client";

import React, { useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export interface RichTextEditorHandle {
  editor: Editor | null;
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ content, onChange, placeholder = "Start typing...", minHeight }, ref) => {
    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
          link: {
            openOnClick: true,
            HTMLAttributes: {
              class: "text-[#0A60E1] underline cursor-pointer",
            },
          },
        }),
        ImageExtension.configure({
          HTMLAttributes: {
            class: "max-w-full rounded-[8px]",
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm max-w-none focus:outline-none min-h-[140px] px-[20px] py-[16px]",
        },
      },
    });

    useImperativeHandle(ref, () => ({ editor }), [editor]);

    if (!editor) {
      return null;
    }

    return (
      <div
        className="border border-[#E8E8E8] rounded-[12px] bg-white w-full flex flex-col"
        style={{ minHeight: minHeight || "auto" }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .ProseMirror {
            outline: none;
            min-height: 140px;
          }
          .ProseMirror h1 {
            font-size: 2rem;
            font-weight: 700;
            line-height: 2.5rem;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            color: #202020;
          }
          .ProseMirror h2 {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 2rem;
            margin-top: 1.25rem;
            margin-bottom: 0.75rem;
            color: #202020;
          }
          .ProseMirror h3 {
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.75rem;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: #202020;
          }
          .ProseMirror p {
            margin-bottom: 0.75rem;
            color: #202020;
            font-size: 1rem;
            line-height: 1.6;
          }
          .ProseMirror ul {
            list-style-type: disc;
            margin: 0.75rem 0;
            padding-left: 1.5rem;
          }
          .ProseMirror ol {
            list-style-type: decimal;
            margin: 0.75rem 0;
            padding-left: 1.5rem;
          }
          .ProseMirror li {
            color: #202020;
            margin-bottom: 0.375rem;
            padding-left: 0.25rem;
          }
          .ProseMirror li p {
            margin-bottom: 0;
          }
          .ProseMirror ul ul {
            list-style-type: circle;
            margin: 0.375rem 0;
          }
          .ProseMirror ol ol {
            list-style-type: lower-alpha;
            margin: 0.375rem 0;
          }
          .ProseMirror blockquote {
            border-left: 4px solid #0A60E1;
            padding: 0.5rem 1rem;
            margin: 0.75rem 0;
            color: #636363;
            font-style: italic;
            background: #F9FAFB;
            border-radius: 0 4px 4px 0;
          }
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #B6B6B6;
            pointer-events: none;
            height: 0;
          }
          .ProseMirror hr {
            border: none;
            border-top: 2px solid #E8E8E8;
            margin: 1.5rem 0;
          }
          .ProseMirror pre {
            background: #F5F5F5;
            padding: 1rem;
            border-radius: 8px;
            margin: 0.75rem 0;
            overflow-x: auto;
            font-family: monospace;
            font-size: 0.875rem;
          }
          .ProseMirror code {
            background: #F5F5F5;
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.875rem;
          }
          .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1rem 0;
          }
          .ProseMirror a {
            color: #0A60E1;
            text-decoration: underline;
          }
          .ProseMirror [style*="text-align: center"] {
            text-align: center;
          }
          .ProseMirror [style*="text-align: right"] {
            text-align: right;
          }
          .ProseMirror iframe {
            max-width: 100%;
            border-radius: 8px;
            margin: 1rem 0;
          }
        `,
          }}
        />
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
