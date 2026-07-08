import React from "react";
import { Box, FormControlLabel, FormHelperText, Switch, useTheme } from "@mui/material";
import VrmaToolTip from "./VrmaToolTip";

type LabelPlacement = "start" | "end" | "top" | "bottom";

interface VrmaSwitchProps {
  label?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  labelPlacement?: LabelPlacement;
  labelPosition?: "left" | "right" | "top" | "bottom";
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning";
  disabled?: boolean;
  labelSize?: "small" | "medium" | "large" | number;
  labelColor?: string;
  customThumbColor?: string;
  trackColorOn?: string;
  trackColorOff?: string;
  customSize?: number;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  /** "helperText" shows error below the switch (default); "tooltip" shows it in a red tooltip */
  errorVariant?: "helperText" | "tooltip";
  /** Tooltip placement when errorVariant="tooltip" (default: "right") */
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
}

const labelSizeMap: Record<"small" | "medium" | "large", string> = {
  small: "0.75rem",
  medium: "0.875rem",
  large: "1rem",
};

const VrmaSwitch: React.FC<VrmaSwitchProps> = ({
  label,
  checked,
  onChange,
  labelPlacement,
  labelPosition,
  size = "medium",
  color = "primary",
  disabled = false,
  labelSize = "medium",
  labelColor,
  customThumbColor,
  trackColorOn,
  trackColorOff,
  customSize,
  required = false,
  error = false,
  helperText,
  errorVariant = "helperText",
  tooltipPlacement = "right",
}) => {
  const theme = useTheme();

  const resolvedHelperText =
    helperText ??
    (error && required && label
      ? `The ${label.trim().charAt(0).toUpperCase() + label.trim().slice(1)} field is required`
      : "");

  const resolvedPlacement: LabelPlacement = (() => {
    if (labelPlacement) return labelPlacement;
    if (labelPosition === "left") return "start";
    if (labelPosition === "right") return "end";
    if (labelPosition === "top") return "top";
    if (labelPosition === "bottom") return "bottom";
    return "end";
  })();

  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSizeMap[labelSize];

  const switchSx: Record<string, unknown> = {};
  if (customSize) {
    const trackH = Math.round(customSize * 0.6);
    const trackW = Math.round(customSize * 2);
    switchSx["& .MuiSwitch-thumb"] = { width: customSize, height: customSize };
    switchSx["& .MuiSwitch-track"] = { width: trackW, height: trackH, borderRadius: trackH / 2 };
  }
  if (customThumbColor) switchSx["& .Mui-checked"] = { color: customThumbColor };
  if (trackColorOn) switchSx["& .Mui-checked + .MuiSwitch-track"] = { backgroundColor: trackColorOn };
  if (trackColorOff) {
    switchSx["& .MuiSwitch-track"] = {
      ...(switchSx["& .MuiSwitch-track"] as object || {}),
      backgroundColor: trackColorOff,
    };
  }

  const switchEl = (
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      size={size}
      color={color}
      disabled={disabled}
      sx={switchSx}
    />
  );

  const resolvedLabel = label ? (
    <span style={{ fontSize: resolvedLabelSize, color: labelColor }}>
      {label}
      {required && <span style={{ color: theme.palette.error.main, marginLeft: 3 }}>*</span>}
    </span>
  ) : undefined;

  // Align helperText with the label text start position
  const helperTextSx = (() => {
    const base = { mt: 0.5 };
    if (resolvedPlacement === "end") {
      // Switch is left, label is right — indent past the switch width
      return { ...base, ml: size === "small" ? "44px" : "52px" };
    }
    if (resolvedPlacement === "start") {
      // Label is left, switch is right — align with label at 0
      return { ...base, ml: 0 };
    }
    // top / bottom — column layout, no indent
    return { ...base, ml: 0, textAlign: "center" as const };
  })();

  const switchNode = (
    <Box sx={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
      {resolvedLabel !== undefined ? (
        <FormControlLabel
          control={switchEl}
          label={resolvedLabel}
          labelPlacement={resolvedPlacement}
          disabled={disabled}
          sx={{ m: 0 }}
        />
      ) : switchEl}
      {errorVariant === "helperText" && resolvedHelperText && (
        <FormHelperText error={error} sx={helperTextSx}>
          {resolvedHelperText}
        </FormHelperText>
      )}
    </Box>
  );

  if (errorVariant === "tooltip") {
    return (
      <VrmaToolTip
        title={resolvedHelperText}
        severity="error"
        open={error && Boolean(resolvedHelperText)}
        placement={tooltipPlacement}
        arrow
      >
        <Box sx={{ display: "inline-flex" }}>{switchNode}</Box>
      </VrmaToolTip>
    );
  }

  return switchNode;
};

export default VrmaSwitch;
