"use client";

import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Link2, List, ListOrdered, Unlink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { richTextHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

/** "full": headings, lists, bold, italic, links. "inline": for a short line, only bold, italic and links. */
export type RichTextVariant = "full" | "inline";

// Only what the backend keeps (see app/utils/rich_text.py). No sizes or
// colors, so the page that shows the text keeps its design.
function buildExtensions(variant: RichTextVariant, placeholder?: string) {
  const inline = variant === "inline";
  return [
    StarterKit.configure({
      heading: inline ? false : { levels: [2, 3] },
      bulletList: inline ? false : undefined,
      orderedList: inline ? false : undefined,
      listItem: inline ? false : undefined,
      listKeymap: inline ? false : undefined,
      blockquote: false,
      code: false,
      codeBlock: false,
      horizontalRule: false,
      strike: false,
      underline: false,
      link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
    }),
    ...(placeholder ? [Placeholder.configure({ placeholder })] : []),
  ];
}

const BLOCKS = [
  { value: "p", label: "Texto" },
  { value: "h2", label: "Título" },
  { value: "h3", label: "Subtítulo" },
] as const;

function ToolButton({
  label,
  active = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      // Keep the selection in the editor while clicking the toolbar.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        active && "bg-foreground/[0.08] text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function LinkButton({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  function apply() {
    const href = url.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (href) chain.setLink({ href }).run();
    else chain.unsetLink().run();
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setUrl(editor.getAttributes("link").href ?? "");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Link"
          title="Link"
          aria-pressed={active}
          onMouseDown={(event) => event.preventDefault()}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
            active && "bg-foreground/[0.08] text-foreground",
          )}
        >
          <Link2 className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-2 p-3">
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            apply();
          }}
        >
          <Input
            autoFocus
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://..."
            aria-label="Dirección del link"
          />
          <Button type="submit" className="h-10">
            Listo
          </Button>
        </form>
        {active && (
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              setOpen(false);
            }}
            className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground"
          >
            <Unlink className="size-3.5" />
            Quitar link
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

function Toolbar({ editor, variant, sticky }: { editor: Editor; variant: RichTextVariant; sticky: boolean }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      block: current.isActive("heading", { level: 2 }) ? "h2" : current.isActive("heading", { level: 3 }) ? "h3" : "p",
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      bulletList: current.isActive("bulletList"),
      orderedList: current.isActive("orderedList"),
      link: current.isActive("link"),
    }),
  });

  function setBlock(value: (typeof BLOCKS)[number]["value"]) {
    const chain = editor.chain().focus();
    if (value === "p") chain.setParagraph().run();
    else chain.setHeading({ level: value === "h2" ? 2 : 3 }).run();
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-t-xl border-b border-foreground/[0.06] bg-card",
        variant === "inline" ? "p-1" : "p-1.5",
        // Sticks below the dashboard's action bar while a long text scrolls under it.
        sticky && "sticky top-[8.5rem] z-10 md:top-[5.25rem]",
      )}
    >
      {variant === "full" && (
        <>
          <div role="group" aria-label="Tipo de texto" className="flex gap-0.5 rounded-lg bg-foreground/[0.05] p-0.5">
            {BLOCKS.map((block) => (
              <button
                key={block.value}
                type="button"
                aria-pressed={state.block === block.value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setBlock(block.value)}
                className={cn(
                  "h-7 rounded-md px-2.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  state.block === block.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {block.label}
              </button>
            ))}
          </div>
          <span aria-hidden className="mx-1 h-5 w-px bg-foreground/10" />
        </>
      )}
      <ToolButton label="Negrita" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="size-4" />
      </ToolButton>
      <ToolButton label="Cursiva" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="size-4" />
      </ToolButton>
      {variant === "full" && (
        <>
          <ToolButton
            label="Lista con viñetas"
            active={state.bulletList}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="size-4" />
          </ToolButton>
          <ToolButton
            label="Lista numerada"
            active={state.orderedList}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="size-4" />
          </ToolButton>
        </>
      )}
      <LinkButton editor={editor} active={state.link} />
    </div>
  );
}

/**
 * A text field with a small formatting toolbar. Its value is HTML ("" when
 * empty); plain text from before the editor existed loads as paragraphs.
 */
export function RichTextEditor({
  id,
  value,
  onChange,
  variant = "full",
  placeholder,
  stickyToolbar = false,
  ariaLabel,
  className,
  contentClassName,
}: {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  variant?: RichTextVariant;
  placeholder?: string;
  /** Keep the toolbar in view under the dashboard's action bar (for long texts in editor pages). */
  stickyToolbar?: boolean;
  ariaLabel?: string;
  /** For the outer box, e.g. a different background. */
  className?: string;
  /** For the writing area, e.g. its minimum height. */
  contentClassName?: string;
}) {
  // Built once: Tiptap doesn't pick up changed extensions after creating the editor.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const extensions = useMemo(() => buildExtensions(variant, placeholder), []);
  const editor = useEditor({
    extensions,
    content: richTextHtml(value),
    // Rendered on the server too: build the editor only in the browser.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
        class: cn(
          "rich-text px-3.5 py-3 text-sm outline-none",
          variant === "inline" ? "min-h-14" : "min-h-28",
          contentClassName,
        ),
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.isEmpty ? "" : current.getHTML()),
  });

  // Values set from outside (loading the offer, a form reset after saving).
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (richTextHtml(value) !== current) editor.commands.setContent(richTextHtml(value), { emitUpdate: false });
  }, [editor, value]);

  return (
    // No overflow-hidden here: it would keep the toolbar from sticking.
    <div
      className={cn(
        "w-full rounded-xl border border-transparent bg-foreground/[0.07] transition-[background-color,box-shadow,border-color] duration-300 ease-out focus-within:border-primary/20 focus-within:bg-card focus-within:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] dark:bg-foreground/10 dark:focus-within:bg-card",
        className,
      )}
    >
      {editor ? (
        <Toolbar editor={editor} variant={variant} sticky={stickyToolbar} />
      ) : (
        <div
          className={cn(
            "rounded-t-xl border-b border-foreground/[0.06] bg-card",
            variant === "inline" ? "h-10" : "h-11",
          )}
        />
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
