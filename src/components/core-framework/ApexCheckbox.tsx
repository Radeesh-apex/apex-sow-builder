import React from "react";
import { Checkbox, FormControlLabel, Typography, Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

type ApexCheckboxFieldProps = Omit<React.ComponentProps<typeof Checkbox>, "onChange"> & {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  size?: "small" | "medium"; // ✅ keep MUI defaults
  customSize?: number;       // ✅ new: numeric size for icon
  color?: "primary" | "secondary" | "default" | "success" | "error" | "info" | "warning";
  disabled?: boolean;
  labelPosition?: "left" | "right" | "top" | "bottom"; 
  displayPosition?: "left" | "right" | "center";
  labelSize?: "small" | "medium" | "large" | number;
  labelWeight?: "normal" | "bold" | number;
  labelColor?: string;
  checkedColor?: string;
};

const ApexCheckbox = ({
  label,
  checked,
  onChange,
  size = "medium",
  customSize,
  color = "primary",
  disabled = false,
  labelPosition = "left",
  displayPosition,
  labelSize = "medium",
  labelWeight = "normal",
  labelColor,
  checkedColor,
  ...props
}: ApexCheckboxFieldProps) => {
  const labelSizeMap: Record<"small" | "medium" | "large", string> = {
    small: "0.75rem",
    medium: "0.875rem",
    large: "1rem",
  };

  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSizeMap[labelSize];

  const placementMap: Record<
    "left" | "right" | "top" | "bottom",
    "start" | "end" | "top" | "bottom"
  > = {
    left: "start",
    right: "end",
    top: "top",
    bottom: "bottom",
  };

  const effectivePosition = labelPosition;
  const pageAlignment = displayPosition ?? "left";
  const justifyContent =
    pageAlignment === "right"
      ? "flex-end"
      : pageAlignment === "center"
      ? "center"
      : "flex-start";

  const checkboxSx: Record<string, unknown> = {};

  if (customSize) {
    checkboxSx["& .MuiSvgIcon-root"] = {
      fontSize: `${customSize}px`, // ✅ custom numeric size
    };
  }

  if (checkedColor) {
    checkboxSx["&.Mui-checked"] = {
      color: checkedColor, // ✅ custom checked color
    };
  }

  return (
    <Box sx={{ display: "flex", justifyContent, width: "100%" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            size={size} // ✅ only "small" or "medium"
            color={color}
            disabled={disabled}
            sx={checkboxSx as SxProps<Theme>}
            {...props}
          />
        }
        label={
          <Typography
            sx={{
              fontSize: resolvedLabelSize,
              fontWeight: labelWeight,
              color: labelColor,
            }}
          >
            {label}
          </Typography>
        }
        labelPlacement={placementMap[effectivePosition]}
      />
    </Box>
  );
};

export default ApexCheckbox;
