import React, { useLayoutEffect, useRef } from "react";
import { Box, TextField } from "@mui/material";
import VrmaToolTip from "./VrmaToolTip";

// ── Mask utilities ────────────────────────────────────────────────────────────

/** Returns true if the mask character represents a user-input position */
function isInputPos(c: string): boolean {
  return c === "#" || c === "A" || c === "*";
}

/** Returns true if `char` satisfies the given mask-position character */
function matchesMaskChar(char: string, maskChar: string): boolean {
  if (maskChar === "#") return /\d/.test(char);
  if (maskChar === "A") return /[a-zA-Z]/.test(char);
  if (maskChar === "*") return /[a-zA-Z0-9]/.test(char);
  return false;
}

/**
 * Strip all mask literals from `display` to extract the raw user-data characters.
 * The literal set is derived from the mask itself.
 */
function extractRaw(display: string, mask: string): string {
  const literals = new Set(mask.split("").filter((c) => !isInputPos(c)));
  return display
    .split("")
    .filter((c) => !literals.has(c))
    .join("");
}

/**
 * Apply the mask to `raw` (user-data characters), inserting literals automatically.
 * Invalid characters for a given mask position are skipped.
 */
function applyMask(raw: string, mask: string, uppercase: boolean): string {
  let result = "";
  let ri = 0; // index into raw

  for (let mi = 0; mi < mask.length; mi++) {
    if (ri >= raw.length) break;

    const mc = mask[mi];

    if (!isInputPos(mc)) {
      result += mc; // auto-insert literal
      continue;
    }

    // Skip raw chars that are invalid for this mask position
    while (ri < raw.length && !matchesMaskChar(raw[ri], mc)) {
      ri++;
    }

    if (ri < raw.length) {
      result += uppercase ? raw[ri].toUpperCase() : raw[ri];
      ri++;
    }
  }

  return result;
}

/**
 * Compute the cursor position in the masked string after `rawLength` input chars
 * have been entered. The cursor is placed after the last input char and any
 * immediately-following auto-inserted literals.
 */
function maskedCursorPos(masked: string, mask: string, rawLength: number): number {
  let count = 0;
  for (let i = 0; i < masked.length; i++) {
    if (i < mask.length && isInputPos(mask[i])) {
      count++;
      if (count === rawLength) {
        // Advance past any auto-literals that follow
        let pos = i + 1;
        while (pos < mask.length && !isInputPos(mask[pos])) pos++;
        return Math.min(pos, masked.length);
      }
    }
  }
  return masked.length;
}

/** Build a placeholder string showing the mask skeleton, e.g. "(___) ___-____" */
function buildMaskPlaceholder(mask: string, char: string): string {
  return mask
    .split("")
    .map((c) => (isInputPos(c) ? char : c))
    .join("");
}

// ── Presets ───────────────────────────────────────────────────────────────────

/**
 * Ready-made mask strings for the most common use cases.
 *
 * Mask legend:
 *   `#`  — digit (0–9)
 *   `A`  — letter (a–z / A–Z)
 *   `*`  — alphanumeric
 *   any other character — literal (auto-inserted, never typed by the user)
 */
export const MASK_PRESETS = {
  PHONE_US: "(###) ###-####",
  PHONE_INTL: "+# (###) ###-####",
  DATE: "##/##/####",
  DATETIME: "##/##/#### ##:##",
  TIME_24H: "##:##",
  /** Use with uppercase={true} to ensure "AM"/"PM" display */
  TIME_12H: "##:## AA",
  CREDIT_CARD: "#### #### #### ####",
  SSN: "###-##-####",
  ZIP_US: "#####",
  ZIP_US_PLUS4: "#####-####",
  IPV4: "###.###.###.###",
  /** Two-letter state/country code — use with uppercase={true} */
  STATE_CODE: "AA",
  /** Alphanumeric license-plate style */
  PLATE: "AAA-####",
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface VrmaMaskTextFieldProps {
  /**
   * Mask pattern string.
   * - `#` accepts a single digit (0–9)
   * - `A` accepts a single letter (a–z / A–Z)
   * - `*` accepts a single alphanumeric character
   * - Any other character is a **literal** that is auto-inserted as the user types.
   *
   * @example "(###) ###-####"  // US phone
   * @example "##/##/####"      // date
   * @example "#### #### #### ####"  // credit card
   */
  mask: string;
  /** Current value in the masked/formatted representation */
  value: string;
  /**
   * Called on every keystroke with two arguments:
   * - `masked`  — formatted value (with literals, e.g. "(415) 678-9012")
   * - `raw`     — user-data only, literals stripped (e.g. "4156789012")
   */
  onChange: (masked: string, raw: string) => void;
  label?: string;
  /** Explicit placeholder — overrides the mask-skeleton placeholder */
  placeholder?: string;
  /** Show the mask skeleton as a placeholder when the field is empty (default: true) */
  showMaskPlaceholder?: boolean;
  /** Character shown for each unfilled position in the mask placeholder (default: `"_"`) */
  maskPlaceholderChar?: string;
  /** Transform all letter (`A`) and alphanumeric (`*`) positions to uppercase (default: false) */
  uppercase?: boolean;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  /** How the error is displayed — `"helperText"` (default) or `"tooltip"` */
  errorVariant?: "helperText" | "tooltip";
  /** Tooltip placement when `errorVariant="tooltip"` (default: `"right"`) */
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
  labelSize?: "small" | "medium" | "large" | number;
  inputFontSize?: "small" | "medium" | "large" | number;
  width?: string | number;
  textAlign?: "left" | "center" | "right";
  labelColor?: string;
  fontColor?: string;
  onBlur?: (masked: string, raw: string) => void;
  onFocus?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const VrmaMaskTextField: React.FC<VrmaMaskTextFieldProps> = ({
  mask,
  value,
  onChange,
  label,
  placeholder,
  showMaskPlaceholder = true,
  maskPlaceholderChar = "_",
  uppercase = false,
  size = "medium",
  variant = "outlined",
  disabled = false,
  fullWidth = true,
  required = false,
  error = false,
  helperText,
  errorVariant = "helperText",
  tooltipPlacement = "right",
  labelSize = "medium",
  inputFontSize = "medium",
  width,
  textAlign = "left",
  labelColor,
  fontColor,
  onBlur,
  onFocus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCursor = useRef<number | null>(null);

  const resolvedHelperText =
    helperText ??
    (error && required && label
      ? `The ${String(label).trim().charAt(0).toUpperCase() + String(label).trim().slice(1)} field is required`
      : undefined);

  const sizeMap: Record<"small" | "medium" | "large", string> = {
    small: "0.75rem",
    medium: "0.875rem",
    large: "1rem",
  };

  const resolveSize = (val: string | number): string =>
    typeof val === "number" ? `${val}px` : sizeMap[val as keyof typeof sizeMap] ?? val;

  const resolvedLabelSize = resolveSize(labelSize);
  const resolvedInputFontSize = resolveSize(inputFontSize);

  const resolvedPlaceholder =
    placeholder ??
    (showMaskPlaceholder ? buildMaskPlaceholder(mask, maskPlaceholderChar) : undefined);

  // Apply the pending cursor after React flushes the DOM update
  useLayoutEffect(() => {
    if (pendingCursor.current !== null && inputRef.current) {
      const pos = pendingCursor.current;
      inputRef.current.setSelectionRange(pos, pos);
      pendingCursor.current = null;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = extractRaw(e.target.value, mask);
    const masked = applyMask(raw, mask, uppercase);
    const cleanRaw = extractRaw(masked, mask);

    // Schedule cursor placement for after React re-renders with the new value
    pendingCursor.current = maskedCursorPos(masked, mask, cleanRaw.length);
    onChange(masked, cleanRaw);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = extractRaw(e.target.value, mask);
    onBlur?.(e.target.value, raw);
  };

  const field = (
    <TextField
      label={label}
      value={value}
      size={size}
      variant={variant}
      disabled={disabled}
      fullWidth={fullWidth}
      required={required}
      error={error}
      placeholder={resolvedPlaceholder}
      helperText={errorVariant === "helperText" ? resolvedHelperText : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={onFocus}
      inputRef={inputRef}
      inputProps={{ inputMode: "text" }}
      sx={{
        width,
        "& .MuiInputLabel-root": { fontSize: resolvedLabelSize, color: labelColor },
        "& .MuiFormLabel-asterisk": { color: "error.main" },
        "& .MuiInputBase-input": {
          fontSize: resolvedInputFontSize,
          textAlign,
          color: fontColor,
          fontFamily: "monospace",
          letterSpacing: "0.04em",
        },
        "& .MuiFormHelperText-root": { textAlign: "left" },
      }}
    />
  );

  if (errorVariant === "tooltip") {
    const tooltipTitle = resolvedHelperText ?? "";
    return (
      <VrmaToolTip
        title={tooltipTitle}
        severity="error"
        open={Boolean(error) && Boolean(tooltipTitle)}
        placement={tooltipPlacement}
        arrow
      >
        <Box sx={{ width: "100%" }}>{field}</Box>
      </VrmaToolTip>
    );
  }

  return field;
};

export default VrmaMaskTextField;
