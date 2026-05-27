import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

type LabelPlacement = "start" | "end" | "top" | "bottom";

interface ApexSwitchProps {
  label?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  // MUI-style placement: end=right (default), start=left, top, bottom
  labelPlacement?: LabelPlacement;
  // Alias: right→end, left→start; top/bottom pass through
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
}

const labelSizeMap: Record<"small" | "medium" | "large", string> = {
  small: "0.75rem",
  medium: "0.875rem",
  large: "1rem",
};

const ApexSwitch: React.FC<ApexSwitchProps> = ({
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
}) => {
  // Resolve placement: labelPlacement wins; labelPosition is the alias
  const resolvedPlacement: LabelPlacement = (() => {
    if (labelPlacement) return labelPlacement;
    if (labelPosition === "left") return "start";
    if (labelPosition === "right") return "end";
    if (labelPosition === "top") return "top";
    if (labelPosition === "bottom") return "bottom";
    return "end";
  })();

  const resolvedLabelSize =
    typeof labelSize === "number"
      ? `${labelSize}px`
      : labelSizeMap[labelSize];

  const switchSx: Record<string, unknown> = {};

  if (customSize) {
    const trackH = Math.round(customSize * 0.6);
    const trackW = Math.round(customSize * 2);
    switchSx["& .MuiSwitch-thumb"] = { width: customSize, height: customSize };
    switchSx["& .MuiSwitch-track"] = {
      width: trackW, height: trackH, borderRadius: trackH / 2,
    };
  }
  if (customThumbColor) {
    switchSx["& .Mui-checked"] = { color: customThumbColor };
  }
  if (trackColorOn) {
    switchSx["& .Mui-checked + .MuiSwitch-track"] = { backgroundColor: trackColorOn };
  }
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

  if (!label) return switchEl;

  return (
    <FormControlLabel
      control={switchEl}
      label={label}
      labelPlacement={resolvedPlacement}
      disabled={disabled}
      sx={{
        m: 0,
        "& .MuiFormControlLabel-label": {
          fontSize: resolvedLabelSize,
          color: labelColor,
        },
      }}
    />
  );
};

export default ApexSwitch;
