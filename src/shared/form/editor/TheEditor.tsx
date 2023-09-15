import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

interface TheEditorProps {}

export function TheEditor({}: TheEditorProps) {
  const [value, setValue] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {},
        },
      }),
      Document,
      Paragraph,
      Text,
    ],
    content: "<p>Hello World! 🌎️</p>",
  });
  return (
    <div className="flex h-full w-full items-center justify-center">
      <EditorContent editor={editor} />
    </div>
  );
}
