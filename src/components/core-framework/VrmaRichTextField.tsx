import React, { useRef, useCallback, useEffect } from "react";
import {
  Box,
  Divider,
  FormHelperText,
  IconButton,
  MenuItem,
  Popover,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import LinkIcon from "@mui/icons-material/Link";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CodeIcon from "@mui/icons-material/Code";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

export interface VrmaRichTextFieldProps {
  /** HTML string (controlled) */
  value?: string;
  /** Default HTML for uncontrolled mode */
  defaultValue?: string;
  onChange?: (html: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  /** Min height of the editor area */
  minHeight?: number | string;
  maxHeight?: number | string;
  /** Show word count */
  showWordCount?: boolean;
  /** Max characters (soft limit — shows warning) */
  maxChars?: number;
  /** Show Edit / Preview toggle button in toolbar */
  showPreview?: boolean;
  labelSize?: "small" | "medium" | "large" | number;
  labelColor?: string;
  sx?: SxProps<Theme>;
}

type FormatCommand =
  | "bold" | "italic" | "underline" | "strikeThrough"
  | "insertUnorderedList" | "insertOrderedList"
  | "formatBlock" | "justifyLeft" | "justifyCenter" | "justifyRight"
  | "indent" | "outdent"
  | "insertHorizontalRule"
  | "removeFormat" | "undo" | "redo";

const labelSizeMap: Record<"small" | "medium" | "large", string> = {
  small: "0.75rem",
  medium: "0.875rem",
  large: "1rem",
};

const TEXT_COLORS = [
  "#000000", "#374151", "#EF4444", "#F97316",
  "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6",
  "#EC4899", "#6B7280", "#0EA5E9", "#14B8A6",
];

function execCmd(cmd: FormatCommand, value?: string) {
  document.execCommand(cmd, false, value);
}

function getActiveFormats(): string[] {
  const active: string[] = [];
  if (document.queryCommandState("bold")) active.push("bold");
  if (document.queryCommandState("italic")) active.push("italic");
  if (document.queryCommandState("underline")) active.push("underline");
  if (document.queryCommandState("strikeThrough")) active.push("strikeThrough");
  return active;
}

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

function getBlockFormat(): string {
  const val = document.queryCommandValue("formatBlock").toLowerCase();
  if (val === "h1" || val === "h2" || val === "h3" || val === "h4") return val;
  if (val === "blockquote") return "blockquote";
  return "p";
}

const VrmaRichTextField: React.FC<VrmaRichTextFieldProps> = ({
  value,
  defaultValue = "",
  onChange,
  label,
  placeholder = "Start typing...",
  disabled = false,
  required = false,
  error = false,
  helperText,
  minHeight = 120,
  maxHeight,
  showWordCount = false,
  maxChars,
  showPreview = false,
  labelSize = "medium",
  labelColor,
  sx,
}) => {
  const theme = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const [activeFormats, setActiveFormats] = React.useState<string[]>([]);
  const [charCount, setCharCount] = React.useState(0);
  const [previewMode, setPreviewMode] = React.useState(false);
  const [blockFormat, setBlockFormat] = React.useState("p");
  const [colorAnchor, setColorAnchor] = React.useState<HTMLElement | null>(null);
  const [currentColor, setCurrentColor] = React.useState("#000000");

  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSizeMap[labelSize];

  // Sync controlled value into DOM
  useEffect(() => {
    if (!isControlled || !editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value ?? "";
    }
  }, [isControlled, value]);

  // Initialize with defaultValue
  useEffect(() => {
    if (editorRef.current && !isControlled) {
      editorRef.current.innerHTML = defaultValue;
      setCharCount(defaultValue.replace(/<[^>]*>/g, "").length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshState = useCallback(() => {
    setActiveFormats(getActiveFormats());
    setBlockFormat(getBlockFormat());
  }, []);

  const handleInput = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    const text = html.replace(/<[^>]*>/g, "");
    setCharCount(text.length);
    refreshState();
    onChange?.(html);
  }, [onChange, refreshState]);

  function applyFormat(cmd: FormatCommand, val?: string) {
    if (disabled) return;
    editorRef.current?.focus();
    execCmd(cmd, val);
    refreshState();
    onChange?.(editorRef.current?.innerHTML ?? "");
  }

  function applyColor(color: string) {
    if (disabled) return;
    setCurrentColor(color);
    editorRef.current?.focus();
    document.execCommand("foreColor", false, color);
    onChange?.(editorRef.current?.innerHTML ?? "");
    setColorAnchor(null);
  }

  function applyCode() {
    if (disabled) return;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const code = document.createElement("code");
      code.style.cssText =
        "background:#f1f5f9;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.85em";
      range.surroundContents(code);
      onChange?.(editorRef.current?.innerHTML ?? "");
    }
  }

  function insertLink() {
    const url = window.prompt("Enter URL:", "https://");
    if (url) {
      editorRef.current?.focus();
      document.execCommand("createLink", false, url);
      onChange?.(editorRef.current?.innerHTML ?? "");
    }
  }

  const borderColor = error
    ? theme.palette.error.main
    : theme.palette.divider;

  const currentHtml = isControlled ? (value ?? "") : (editorRef.current?.innerHTML ?? "");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ...(sx as object) }}>
      {label && (
        <Typography
          component="label"
          sx={{ fontSize: resolvedLabelSize, color: labelColor ?? "text.primary", fontWeight: 500 }}
        >
          {label}
          {required && <span style={{ color: theme.palette.error.main, marginLeft: 3 }}>*</span>}
        </Typography>
      )}

      <Box
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: 1,
          overflow: "hidden",
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto",
          "&:focus-within": {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${error ? theme.palette.error.main : theme.palette.primary.main}20`,
          },
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {/* ── Toolbar ── */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 0.25,
            px: 0.75,
            py: 0.5,
            bgcolor: "action.hover",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Undo / Redo */}
          <Tooltip title="Undo (Ctrl+Z)">
            <IconButton size="small" onClick={() => applyFormat("undo")}><UndoIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Redo (Ctrl+Y)">
            <IconButton size="small" onClick={() => applyFormat("redo")}><RedoIcon fontSize="small" /></IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Block format selector */}
          <Select
            size="small"
            value={blockFormat}
            onChange={(e) => applyFormat("formatBlock", e.target.value)}
            variant="outlined"
            sx={{
              fontSize: "0.75rem",
              height: 28,
              minWidth: 110,
              "& .MuiSelect-select": { py: "2px", pl: "8px" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
            }}
          >
            <MenuItem value="p"  sx={{ fontSize: "0.8rem" }}>Paragraph</MenuItem>
            <MenuItem value="h1" sx={{ fontSize: "0.8rem", fontWeight: 700, fontSize2: "1.1rem" }}>Heading 1</MenuItem>
            <MenuItem value="h2" sx={{ fontSize: "0.8rem", fontWeight: 700 }}>Heading 2</MenuItem>
            <MenuItem value="h3" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>Heading 3</MenuItem>
            <MenuItem value="h4" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>Heading 4</MenuItem>
            <MenuItem value="blockquote" sx={{ fontSize: "0.8rem", fontStyle: "italic" }}>Blockquote</MenuItem>
          </Select>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Text styles */}
          <ToggleButtonGroup size="small" value={activeFormats}>
            <ToggleButton value="bold" onClick={() => applyFormat("bold")} aria-label="bold">
              <Tooltip title="Bold (Ctrl+B)"><FormatBoldIcon fontSize="small" /></Tooltip>
            </ToggleButton>
            <ToggleButton value="italic" onClick={() => applyFormat("italic")} aria-label="italic">
              <Tooltip title="Italic (Ctrl+I)"><FormatItalicIcon fontSize="small" /></Tooltip>
            </ToggleButton>
            <ToggleButton value="underline" onClick={() => applyFormat("underline")} aria-label="underline">
              <Tooltip title="Underline (Ctrl+U)"><FormatUnderlinedIcon fontSize="small" /></Tooltip>
            </ToggleButton>
            <ToggleButton value="strikeThrough" onClick={() => applyFormat("strikeThrough")} aria-label="strikethrough">
              <Tooltip title="Strikethrough"><StrikethroughSIcon fontSize="small" /></Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Text color */}
          <Tooltip title="Text color">
            <IconButton
              size="small"
              onClick={(e) => setColorAnchor(e.currentTarget)}
              sx={{ position: "relative" }}
            >
              <FormatColorTextIcon fontSize="small" />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 14,
                  height: 3,
                  bgcolor: currentColor,
                  borderRadius: 0.5,
                }}
              />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(colorAnchor)}
            anchorEl={colorAnchor}
            onClose={() => setColorAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Box sx={{ p: 1, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0.5 }}>
              {TEXT_COLORS.map((c) => (
                <Box
                  key={c}
                  onClick={() => applyColor(c)}
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: c,
                    borderRadius: 0.5,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: c === "#FFFFFF" ? "divider" : "transparent",
                    "&:hover": { transform: "scale(1.2)", boxShadow: 2 },
                    transition: "transform 0.1s",
                  }}
                />
              ))}
            </Box>
          </Popover>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Lists */}
          <Tooltip title="Bullet list">
            <IconButton size="small" onClick={() => applyFormat("insertUnorderedList")}>
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbered list">
            <IconButton size="small" onClick={() => applyFormat("insertOrderedList")}>
              <FormatListNumberedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Indent */}
          <Tooltip title="Indent">
            <IconButton size="small" onClick={() => applyFormat("indent")}>
              <FormatIndentIncreaseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Outdent">
            <IconButton size="small" onClick={() => applyFormat("outdent")}>
              <FormatIndentDecreaseIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Alignment */}
          <Tooltip title="Align left">
            <IconButton size="small" onClick={() => applyFormat("justifyLeft")}><FormatAlignLeftIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Align center">
            <IconButton size="small" onClick={() => applyFormat("justifyCenter")}><FormatAlignCenterIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Align right">
            <IconButton size="small" onClick={() => applyFormat("justifyRight")}><FormatAlignRightIcon fontSize="small" /></IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Link / Code / HR */}
          <Tooltip title="Insert link">
            <IconButton size="small" onClick={insertLink}><LinkIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Inline code (select text first)">
            <IconButton size="small" onClick={applyCode}><CodeIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Horizontal rule">
            <IconButton size="small" onClick={() => applyFormat("insertHorizontalRule")}>
              <HorizontalRuleIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Clear */}
          <Tooltip title="Clear formatting">
            <IconButton size="small" onClick={() => applyFormat("removeFormat")}><FormatClearIcon fontSize="small" /></IconButton>
          </Tooltip>

          {/* Preview toggle */}
          {showPreview && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Tooltip title={previewMode ? "Switch to Edit" : "Switch to Preview"}>
                <IconButton
                  size="small"
                  onClick={() => setPreviewMode((v) => !v)}
                  color={previewMode ? "primary" : "default"}
                >
                  {previewMode ? <EditIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

        {/* ── Editor / Preview area ── */}
        {previewMode ? (
          <Box
            dangerouslySetInnerHTML={{ __html: currentHtml }}
            sx={{
              p: 2,
              minHeight,
              ...(maxHeight && { maxHeight, overflowY: "auto" }),
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: "text.primary",
              "& h1": { fontSize: "1.75rem", fontWeight: 700, mt: 1, mb: 0.5 },
              "& h2": { fontSize: "1.4rem",  fontWeight: 700, mt: 1, mb: 0.5 },
              "& h3": { fontSize: "1.15rem", fontWeight: 600, mt: 1, mb: 0.5 },
              "& h4": { fontSize: "1rem",    fontWeight: 600, mt: 1, mb: 0.5 },
              "& blockquote": {
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                pl: 2, ml: 0, color: "text.secondary", fontStyle: "italic",
              },
              "& a": { color: "primary.main" },
              "& code": {
                background: theme.palette.action.hover,
                px: "5px", borderRadius: "3px",
                fontFamily: "monospace", fontSize: "0.85em",
              },
              "& hr": { border: "none", borderTop: `1px solid ${theme.palette.divider}`, my: 2 },
              "& ul, & ol": { pl: 2.5, my: 0.5 },
            }}
          />
        ) : (
          <Box
            ref={editorRef}
            contentEditable={!disabled}
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyUp={refreshState}
            onMouseUp={refreshState}
            data-placeholder={placeholder}
            sx={{
              outline: "none",
              p: 1.5,
              minHeight,
              ...(maxHeight && { maxHeight, overflowY: "auto" }),
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: "text.primary",
              "&:empty::before": {
                content: "attr(data-placeholder)",
                color: "text.disabled",
                pointerEvents: "none",
              },
              "& h1": { fontSize: "1.75rem", fontWeight: 700, mt: 1, mb: 0.5 },
              "& h2": { fontSize: "1.4rem",  fontWeight: 700, mt: 1, mb: 0.5 },
              "& h3": { fontSize: "1.15rem", fontWeight: 600, mt: 1, mb: 0.5 },
              "& h4": { fontSize: "1rem",    fontWeight: 600, mt: 1, mb: 0.5 },
              "& blockquote": {
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                pl: 2, ml: 0, color: "text.secondary", fontStyle: "italic",
              },
              "& a": { color: "primary.main" },
              "& code": {
                background: theme.palette.action.hover,
                px: "5px", borderRadius: "3px",
                fontFamily: "monospace", fontSize: "0.85em",
              },
              "& hr": { border: "none", borderTop: `1px solid ${theme.palette.divider}`, my: 2 },
              "& ul, & ol": { pl: 2.5, my: 0.5 },
            }}
          />
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {helperText || error ? (
          <FormHelperText error={error} sx={{ mx: 0 }}>
            {helperText ?? (error && required ? `${label ?? "Field"} is required` : "")}
          </FormHelperText>
        ) : <Box />}

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          {showWordCount && (
            <Typography variant="caption" color="text.disabled">
              {countWords(editorRef.current?.innerHTML ?? "")} words
            </Typography>
          )}
          {maxChars && (
            <Typography
              variant="caption"
              color={charCount > maxChars ? "error" : "text.disabled"}
            >
              {charCount} / {maxChars}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VrmaRichTextField;
