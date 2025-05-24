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
  Palette,
  Highlighter,
  ChevronDown,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Separator } from "./separator";
import { Button } from "./button";
import { Card } from "./card";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $patchStyleText } from "@lexical/selection";
import { ExtendedTextNode } from "./LexicalExtended";
import { 
  TextNode, 
   
} from 'lexical';
type EditorProp = {
    onContentChange?:(data:string)=>void,
    value:string
}

// Lexical native color options
const TEXT_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#888888', // Gray
  '#ff0000', // Red
  '#ff8800', // Orange
  '#ffff00', // Yellow
  '#88ff00', // Lime
  '#00ff00', // Green
  '#00ff88', // Spring Green
  '#00ffff', // Cyan
  '#0088ff', // Sky Blue
  '#0000ff', // Blue
  '#8800ff', // Purple
  '#ff00ff', // Magenta
  '#ff0088', // Pink
];

const BACKGROUND_COLORS = [
  'transparent', // No background
  '#f8f9fa', // Light Gray
  '#e9ecef', // Gray
  '#fff3cd', // Light Yellow
  '#d4edda', // Light Green
  '#d1ecf1', // Light Blue
  '#e2e3f0', // Light Purple
  '#f8d7da', // Light Red
  '#ffeaa7', // Yellow
  '#74b9ff', // Blue
  '#a29bfe', // Purple
  '#fd79a8', // Pink
  '#fdcb6e', // Orange
  '#6c5ce7', // Indigo
  '#00b894', // Teal
];

const NativeColorPicker = ({ 
  colors, 
  onColorSelect, 
  icon: Icon, 
  tooltip,
  currentColor = ''
}: {
  colors: string[],
  onColorSelect: (color: string) => void,
  icon: any,
  tooltip: string,
  currentColor?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8 relative"
            >
              <Icon className="h-4 w-4" />
              {/* Show current color indicator */}
              {currentColor && currentColor !== 'transparent' && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b"
                  style={{ backgroundColor: currentColor }}
                />
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          {/* Color Grid */}
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color, index) => (
              <button
                key={index}
                className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform flex items-center justify-center"
                style={{ 
                  backgroundColor: color === 'transparent' ? '#ffffff' : color,
                  border: `2px solid ${currentColor === color ? '#000000' : '#e5e7eb'}`,
                  position: 'relative'
                }}
                onClick={() => {
                  onColorSelect(color === 'transparent' ? '' : color);
                  setIsOpen(false);
                }}
                title={color === 'transparent' ? 'No Color' : color}
              >
                {color === 'transparent' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-red-500 transform rotate-45 absolute" />
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Custom Color Input */}
          <div className="border-t pt-3">
            <label className="text-xs text-gray-600 mb-2 block">Custom Color:</label>
            <div className="flex gap-2">
              <input
                type="color"
                className="w-8 h-8 rounded border cursor-pointer"
                onChange={(e) => {
                  onColorSelect(e.target.value);
                  setIsOpen(false);
                }}
              />
              <input
                type="text"
                placeholder="#000000"
                className="flex-1 px-2 py-1 text-xs border rounded"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                    onColorSelect(value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsOpen(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
  const [currentTextColor, setCurrentTextColor] = useState('');
  const [currentBgColor, setCurrentBgColor] = useState('');

  // Track current colors from selection
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes();
          if (nodes.length > 0) {
            const firstNode = nodes[0];
            const parent = firstNode.getParent();
            if (parent) {
              // Get computed styles
              const style = parent.getStyle();
              if (style) {
                const colorMatch = style.match(/color:\s*([^;]+)/);
                const bgColorMatch = style.match(/background-color:\s*([^;]+)/);
                
                if (colorMatch) setCurrentTextColor(colorMatch[1].trim());
                if (bgColorMatch) setCurrentBgColor(bgColorMatch[1].trim());
              }
            }
          }
        }
      });
    });
  }, [editor]);

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

  const handleTextColorChange = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          color: color || null,
        });
      }
    });
    setCurrentTextColor(color);
  };

  const handleBackgroundColorChange = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'background-color': color || null,
        });
      }
    });
    setCurrentBgColor(color);
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

            <NativeColorPicker
              colors={TEXT_COLORS}
              onColorSelect={handleTextColorChange}
              icon={Palette}
              tooltip="Text Color"
              currentColor={currentTextColor}
            />

            <NativeColorPicker
              colors={BACKGROUND_COLORS}
              onColorSelect={handleBackgroundColorChange}
              icon={Highlighter}
              tooltip="Background Color"
              currentColor={currentBgColor}
            />

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
    nodes: [ListNode, ListItemNode, HeadingNode, QuoteNode, LinkNode,ExtendedTextNode,{
      replace: TextNode,
      with: (node: TextNode) => new ExtendedTextNode(node.__text),
      withKlass: ExtendedTextNode,
    },],
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