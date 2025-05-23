import { useCallback, useEffect, useState, type SetStateAction } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from '@lexical/html';

import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  UNDO_COMMAND,
  REDO_COMMAND,
  type EditorState,
  $getRoot,
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createQuoteNode } from "@lexical/rich-text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Separator } from "./separator";
import { Button } from "./button";
import { Card } from "./card";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

type EditorProp = {
    onContentChange?:(data:string)=>void,
    value:string
}

const FormatDropdown = () => {
  const [editor] = useLexicalComposerContext();
  const [selectedFormat, setSelectedFormat] = useState("paragraph");

  const handleFormatChange = (format: SetStateAction<string>) => {
    setSelectedFormat(format);

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      switch (format) {
        case "paragraph":
          $setBlocksType(selection, () => $createParagraphNode());
          break;
        case "h1":
          $setBlocksType(selection, () => $createHeadingNode("h1"));
          break;
        case "h2":
          $setBlocksType(selection, () => $createHeadingNode("h2"));
          break;
        case "h3":
          $setBlocksType(selection, () => $createHeadingNode("h3"));
          break;
        case "h4":
          $setBlocksType(selection, () => $createHeadingNode("h4"));
          break;
        case "h5":
          $setBlocksType(selection, () => $createHeadingNode("h5"));
          break;
        case "quote":
          $setBlocksType(selection, () => $createQuoteNode());
          break;
      }
    });
  };

  return (
    <Select value={selectedFormat} onValueChange={handleFormatChange}>
      <SelectTrigger
        size="sm"
        className="h-8  border-0 bg-transparent data-[state=open]:bg-mute "
      >
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <SelectValue placeholder="Paragraph" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="paragraph">Paragraph</SelectItem>
        <SelectItem value="h1">Heading 1</SelectItem>
        <SelectItem value="h2">Heading 2</SelectItem>
        <SelectItem value="h3">Heading 3</SelectItem>
        <SelectItem value="h4">Heading 4</SelectItem>
        <SelectItem value="h5">Heading 5</SelectItem>
        <SelectItem value="quote">Quote</SelectItem>
      </SelectContent>
    </Select>
  );
};

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  // Calculate word count
  const updateWordCount = () => {
    editor.getEditorState().read(() => {
      const text = editor
        .getEditorState()
        .toJSON()
        .root.children.map(
          (node: any) =>
            node?.children
              ?.map((child: { text: any }) => child.text || "")
              .join("") || ""
        )
        .join(" ");

      const count = text.trim() ? text.trim().split(/\s+/).length : 0;
    });
  };

  // Update word count when editor changes
  editor.registerUpdateListener(() => {
    updateWordCount();
  });

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const formatAlignLeft = () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
  };

  const formatAlignCenter = () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
  };

  const formatAlignRight = () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <div className="flex items-center p-2 border-b  border-muted">
          <div className="flex flex-1 items-center space-x-1">
            <FormatDropdown />

            <Separator orientation="vertical" className="mx-1 h-6 " />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={formatBold}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={formatItalic}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={formatUnderline}
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={formatBulletList}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={formatNumberedList}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={formatAlignLeft}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Left</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={formatAlignCenter}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Center</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={formatAlignRight}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Right</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={undo}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={redo}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export const LoadInitialContent = ({ value }: any) => {
  const [editor] = useLexicalComposerContext();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!value || hasLoaded) return;

    editor.update(() => {
      // Decode HTML entities
      const textarea = document.createElement('textarea');
      textarea.innerHTML = value;
      const decodedValue = textarea.value;
      
      const parser = new DOMParser();
      const dom = parser.parseFromString(decodedValue, "text/html");
      
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      
      // Only clear and load if we actually have content
      if (nodes.length > 0) {
        root.clear();
        nodes.forEach((n) => root.append(n));
      }
    });
    
    setHasLoaded(true);
  }, [editor, value, hasLoaded]);

  return null;
};

const HtmlPlugin = ({ onContentChange, value }: EditorProp) => {
  const [editor] = useLexicalComposerContext();

  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        try {
          const rootElement = editor._rootElement;
          if (rootElement && onContentChange) {
            const html = rootElement.innerHTML;
            onContentChange(html);
          }
        } catch (error) {
          console.error("Error getting HTML content:", error);

          // Fallback to plain text if HTML extraction fails
          const text = editorState
            .toJSON()
            .root.children.map(
              (node: any) =>
                node.children
                  ?.map((child: { text: any }) => child.text || "")
                  .join("") || ""
            )
            .join("\n");

          if (onContentChange) {
            onContentChange(text);
          }
        }
      });
    },
    [editor, onContentChange]
  );

  return <OnChangePlugin onChange={handleEditorChange} />;
};

const CharacterLimitPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [characterCount, setCharacterCount] = useState(0);
  const [showLimit, setShowLimit] = useState(false);
  const LIMIT = 2000;

  editor.registerUpdateListener(() => {
    editor.getEditorState().read(() => {
      const text = editor
        .getEditorState()
        .toJSON()
        .root.children.map(
          (node: any) =>
            node.children
              ?.map((child: { text: any }) => child.text || "")
              .join("") || ""
        )
        .join(" ");

      setCharacterCount(text.length);
    });
  });

  const handleHover = () => {
    setShowLimit(true);
  };

  const handleLeave = () => {
    setShowLimit(false);
  };

  return (
    <div
      className="text-xs text-slate-500 text-right p-2 border-t border-slate-200"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {showLimit ? (
        <span>
          {characterCount} / {LIMIT} characters
        </span>
      ) : (
        <span>{characterCount} characters</span>
      )}
    </div>
  );
};

// Add Enter Key Handler Plugin to control line breaks
const EnterKeyPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Allow normal Enter behavior - this creates proper paragraph breaks
          // You can customize this behavior here if needed
          return false; // Let Lexical handle the default behavior
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
};

const Editor = ({ onContentChange, value }: EditorProp) => {
  const initialConfig = {
    namespace: "ShopifyStyleEditor",
    nodes: [ListNode, ListItemNode, HeadingNode, QuoteNode, LinkNode],
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
      },
      list: {
        ul: "list-disc ml-6 my-2",
        ol: "list-decimal ml-6 my-2",
      },
      heading: {
        h1: "text-2xl font-bold my-2",
        h2: "text-xl font-bold my-2",
        h3: "text-lg font-bold my-2",
        h4: "text-base font-bold my-2",
        h5: "text-sm font-bold my-2",
      },
      quote: "border-l-4 border-slate-200 pl-4 my-2 italic",
      paragraph: "my-1", // Add proper paragraph spacing
    },
    onError: (error: any) => {
      console.error(error);
    },
  };

  return (
    <div className="w-full">
      <Card className="overflow-hidden rounded-md gap-0 shadow-none py-0 bg-white border-muted">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div className="relative bg-white">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[200px] p-4 focus:outline-none" />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-sm text-accent pointer-events-none">
                  Start typing to describe your product...
                </div>
              }
              ErrorBoundary={() => <div>Something went wrong.</div>}
            />
          </div>
          <LoadInitialContent value={value} />
          <HtmlPlugin value={value} onContentChange={onContentChange} />
          <EnterKeyPlugin />
          <ListPlugin />
          <HistoryPlugin />
          <CharacterLimitPlugin />
        </LexicalComposer>
      </Card>
    </div>
  );
};

export default Editor;