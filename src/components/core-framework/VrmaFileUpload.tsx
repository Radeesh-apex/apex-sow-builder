import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  FormHelperText,
  LinearProgress,
  useTheme,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import CloudUploadIcon       from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon   from "@mui/icons-material/InsertDriveFile";
import ImageIcon             from "@mui/icons-material/Image";
import PictureAsPdfIcon      from "@mui/icons-material/PictureAsPdf";
import TableChartIcon        from "@mui/icons-material/TableChart";
import DescriptionIcon       from "@mui/icons-material/Description";
import SlideshowIcon         from "@mui/icons-material/Slideshow";
import AudioFileIcon         from "@mui/icons-material/AudioFile";
import VideoFileIcon         from "@mui/icons-material/VideoFile";
import FolderZipIcon         from "@mui/icons-material/FolderZip";
import CodeIcon              from "@mui/icons-material/Code";
import DeleteOutlineIcon     from "@mui/icons-material/DeleteOutline";
import VrmaToolTip           from "./VrmaToolTip";

export interface VrmaFileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  /** Comma-separated MIME types or extensions, e.g. "image/*,.pdf" */
  accept?: string;
  multiple?: boolean;
  /** Max file size in bytes */
  maxSize?: number;
  /** Max number of files (only meaningful when multiple=true) */
  maxFiles?: number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorVariant?: "helperText" | "tooltip";
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
  showFileList?: boolean;
  showFileSize?: boolean;
  /** Animate an upload progress bar when files are added */
  showProgress?: boolean;
  /** Duration (ms) of the per-file progress animation */
  progressDuration?: number;
  size?: "small" | "medium" | "large";
  labelSize?: "small" | "medium" | "large" | number;
  labelColor?: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

interface FileIconInfo {
  icon: React.ReactElement;
  color: string;
}

// All colors pulled from the active MUI theme so they adapt across
// light / dark / corporate-blue / emerald / purple presets.
function getFileIconInfo(file: File, theme: Theme): FileIconInfo {
  const mime = file.type.toLowerCase();
  const ext  = file.name.split(".").pop()?.toLowerCase() ?? "";
  const p    = theme.palette;

  if (mime.startsWith("image/"))
    return { icon: <ImageIcon fontSize="small" />, color: p.secondary.main };

  if (mime === "application/pdf" || ext === "pdf")
    return { icon: <PictureAsPdfIcon fontSize="small" />, color: p.error.main };

  if (
    mime === "application/vnd.ms-excel" ||
    mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mime === "text/csv" ||
    ["xlsx", "xls", "xlsm", "xlsb", "csv"].includes(ext)
  ) return { icon: <TableChartIcon fontSize="small" />, color: p.success.main };

  if (
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ["doc", "docx", "odt", "rtf"].includes(ext)
  ) return { icon: <DescriptionIcon fontSize="small" />, color: p.primary.main };

  if (
    mime.includes("presentation") ||
    mime === "application/vnd.ms-powerpoint" ||
    ["ppt", "pptx", "odp", "key"].includes(ext)
  ) return { icon: <SlideshowIcon fontSize="small" />, color: p.warning.main };

  if (
    mime.startsWith("audio/") ||
    ["mp3", "wav", "flac", "aac", "m4a", "ogg", "wma"].includes(ext)
  ) return { icon: <AudioFileIcon fontSize="small" />, color: p.info.main };

  if (
    mime.startsWith("video/") ||
    ["mp4", "avi", "mov", "mkv", "webm", "wmv", "flv"].includes(ext)
  ) return { icon: <VideoFileIcon fontSize="small" />, color: p.info.dark };

  if (["zip", "rar", "7z", "tar", "gz", "bz2", "xz"].includes(ext))
    return { icon: <FolderZipIcon fontSize="small" />, color: p.warning.dark };

  if (
    ["js", "ts", "tsx", "jsx", "html", "css", "scss", "json", "xml",
     "py", "java", "cpp", "c", "cs", "go", "rb", "php", "sh"].includes(ext)
  ) return { icon: <CodeIcon fontSize="small" />, color: p.text.secondary };

  return { icon: <InsertDriveFileIcon fontSize="small" />, color: p.text.disabled };
}

const labelSizeMap: Record<"small" | "medium" | "large", string> = {
  small: "0.75rem",
  medium: "0.875rem",
  large: "1rem",
};

const zonePaddingMap: Record<"small" | "medium" | "large", string> = {
  small: "16px",
  medium: "24px",
  large: "36px",
};

// ── component ─────────────────────────────────────────────────────────────────

const VrmaFileUpload: React.FC<VrmaFileUploadProps> = ({
  value = [],
  onChange,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  label,
  placeholder,
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorVariant = "helperText",
  tooltipPlacement = "bottom",
  showFileList = true,
  showFileSize = true,
  showProgress = true,
  progressDuration = 900,
  size = "medium",
  labelSize = "medium",
  labelColor,
}) => {
  const theme    = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragOver,      setIsDragOver]      = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  // key → progress 0-100; absent once complete
  const [uploadProgress,  setUploadProgress]  = useState<Map<string, number>>(new Map());
  const rafIds = useRef<Map<string, number>>(new Map());

  // cancel any in-flight animations on unmount
  useEffect(() => {
    const ids = rafIds.current;
    return () => { ids.forEach((id) => cancelAnimationFrame(id)); };
  }, []);

  function startProgressAnimation(key: string) {
    const startTime = performance.now();

    function step(now: number) {
      const elapsed  = now - startTime;
      const progress = Math.min((elapsed / progressDuration) * 100, 100);

      setUploadProgress((prev) => {
        const next = new Map(prev);
        if (progress >= 100) {
          next.delete(key);
        } else {
          next.set(key, progress);
        }
        return next;
      });

      if (progress < 100) {
        rafIds.current.set(key, requestAnimationFrame(step));
      } else {
        rafIds.current.delete(key);
      }
    }

    rafIds.current.set(key, requestAnimationFrame(step));
  }

  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSizeMap[labelSize];

  const resolvedHelperText =
    helperText ??
    (error && required && label ? `${label.trim()} is required` : "");

  const displayError = validationError ?? (error ? resolvedHelperText : "");

  function validate(files: File[]): string | null {
    if (maxFiles && files.length > maxFiles)
      return `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`;
    if (maxSize) {
      const oversized = files.find((f) => f.size > maxSize);
      if (oversized)
        return `"${oversized.name}" exceeds the ${formatBytes(maxSize)} limit`;
    }
    return null;
  }

  function addFiles(incoming: File[]) {
    if (disabled) return;
    const merged = multiple ? [...value, ...incoming] : incoming.slice(0, 1);
    const err    = validate(merged);
    if (err) { setValidationError(err); return; }
    setValidationError(null);
    onChange?.(merged);
    if (showProgress) {
      incoming.forEach((f) => startProgressAnimation(getFileKey(f)));
    }
  }

  function removeFile(index: number) {
    const removed = value[index];
    if (removed) {
      const key = getFileKey(removed);
      const id  = rafIds.current.get(key);
      if (id !== undefined) cancelAnimationFrame(id);
      rafIds.current.delete(key);
      setUploadProgress((prev) => { const n = new Map(prev); n.delete(key); return n; });
    }
    setValidationError(null);
    onChange?.(value.filter((_, i) => i !== index));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) addFiles(files);
    e.target.value = "";
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }
  function onDragLeave() { setIsDragOver(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length) addFiles(files);
  }

  const borderColor = isDragOver
    ? theme.palette.primary.main
    : error || displayError
    ? theme.palette.error.main
    : theme.palette.divider;

  const zone = (
    <Box
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      sx={{
        border: `2px dashed ${borderColor}`,
        borderRadius: 2,
        p: zonePaddingMap[size],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "border-color 0.2s, background-color 0.2s",
        bgcolor: isDragOver
          ? `${theme.palette.primary.main}14`
          : disabled
          ? "action.disabledBackground"
          : "action.hover",
        "&:hover": disabled
          ? {}
          : { borderColor: theme.palette.primary.main, bgcolor: `${theme.palette.primary.main}0a` },
        opacity: disabled ? 0.6 : 1,
        userSelect: "none",
      }}
    >
      <CloudUploadIcon
        sx={{
          fontSize: size === "small" ? 32 : size === "large" ? 56 : 44,
          color: isDragOver ? "primary.main" : "action.active",
          transition: "color 0.2s",
        }}
      />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {placeholder ?? (isDragOver ? "Drop files here" : "Drag & drop files here, or click to browse")}
      </Typography>
      {accept && (
        <Typography variant="caption" color="text.disabled">
          Accepted: {accept}
          {maxSize ? ` · Max ${formatBytes(maxSize)}` : ""}
          {maxFiles && multiple ? ` · Up to ${maxFiles} files` : ""}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, width: "100%" }}>
      {label && (
        <Typography
          component="label"
          sx={{
            fontSize: resolvedLabelSize,
            color: labelColor ?? "text.primary",
            fontWeight: 500,
            display: "block",
          }}
        >
          {label}
          {required && <span style={{ color: theme.palette.error.main, marginLeft: 3 }}>*</span>}
        </Typography>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={onInputChange}
      />

      {errorVariant === "tooltip" ? (
        <VrmaToolTip
          title={displayError ?? ""}
          severity="error"
          open={Boolean(displayError)}
          placement={tooltipPlacement}
          arrow
        >
          <Box>{zone}</Box>
        </VrmaToolTip>
      ) : (
        zone
      )}

      {errorVariant === "helperText" && displayError && (
        <FormHelperText error sx={{ mx: 0 }}>
          {displayError}
        </FormHelperText>
      )}

      {showFileList && value.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 0.5, width: "100%", alignItems: "stretch" }}>
          {value.map((file, idx) => {
            const key      = getFileKey(file);
            const progress = uploadProgress.get(key);
            const { icon, color } = getFileIconInfo(file, theme);
            const isUploading = progress !== undefined;

            return (
              <Box
                key={key}
                sx={{
                  width: "100%",
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: isUploading ? `${color}50` : "divider",
                  bgcolor: "background.paper",
                  overflow: "hidden",
                  transition: "border-color 0.3s",
                }}
              >
                {/* file row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.25,
                    py: 0.75,
                  }}
                >
                  {/* icon badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: `${color}18`,
                      color,
                      flexShrink: 0,
                      transition: "background-color 0.3s",
                    }}
                  >
                    {icon}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.3,
                      }}
                    >
                      {file.name}
                    </Typography>
                    {showFileSize && (
                      <Typography variant="caption" color="text.disabled" sx={{ lineHeight: 1.2 }}>
                        {formatBytes(file.size)}
                        {isUploading && (
                          <span style={{ marginLeft: 6, color }}>
                            {Math.round(progress)}%
                          </span>
                        )}
                      </Typography>
                    )}
                  </Box>

                  {!disabled && !isUploading && (
                    <IconButton
                      size="small"
                      onClick={() => removeFile(idx)}
                      sx={{ ml: 0.5, p: 0.25, flexShrink: 0 }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                {/* per-file animated progress bar */}
                {isUploading && (
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 3,
                      borderRadius: 0,
                      bgcolor: `${color}20`,
                      "& .MuiLinearProgress-bar": { bgcolor: color },
                    }}
                  />
                )}
              </Box>
            );
          })}

          {/* file-count quota bar */}
          {maxFiles && multiple && (
            <Box sx={{ mt: 0.25 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min((value.length / maxFiles) * 100, 100)}
                sx={{ height: 3, borderRadius: 1 }}
              />
              <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, display: "block" }}>
                {value.length} / {maxFiles} files
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default VrmaFileUpload;
