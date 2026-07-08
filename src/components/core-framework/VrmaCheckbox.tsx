import React from "react";
import { Box, Checkbox, FormControlLabel, FormHelperText, Typography, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import VrmaToolTip from "./VrmaToolTip";

type VrmaCheckboxFieldProps = Omit<React.ComponentProps<typeof Checkbox>, "onChange" | "required"> & {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  size?: "small" | "medium";
  customSize?: number;
  color?: "primary" | "secondary" | "default" | "success" | "error" | "info" | "warning";
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  /** "helperText" shows the error below the checkbox (default); "tooltip" shows it in a red tooltip */
  errorVariant?: "helperText" | "tooltip";
  /** Tooltip placement when errorVariant="tooltip" (default: "right") */
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
  labelPosition?: "left" | "right" | "top" | "bottom";
  displayPosition?: "left" | "right" | "center";
  labelSize?: "small" | "medium" | "large" | number;
  labelWeight?: "normal" | "bold" | number;
  labelColor?: string;
  checkedColor?: string;
};

const VrmaCheckbox = ({
  label,
  checked,
  onChange,
  size = "medium",
  customSize,
  color = "primary",
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorVariant = "helperText",
  tooltipPlacement = "right",
  labelPosition = "right",
  displayPosition,
  labelSize = "medium",
  labelWeight = "normal",
  labelColor,
  checkedColor,
  ...props
}: VrmaCheckboxFieldProps) => {
  const theme = useTheme();

  const resolvedHelperText =
    helperText ??
    (error && required && label
      ? `The ${label.trim().charAt(0).toUpperCase() + label.trim().slice(1)} field is required`
      : "");

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

  const pageAlignment = displayPosition ?? "left";
  const justifyContent =
    pageAlignment === "right"
      ? "flex-end"
      : pageAlignment === "center"
      ? "center"
      : "flex-start";
  const outerAlignItems =
    pageAlignment === "right"
      ? "flex-end"
      : pageAlignment === "center"
      ? "center"
      : "flex-start";

  // helperText indent: align with the label when label is beside the checkbox (right/left labelPosition)
  const helperIndent =
    pageAlignment !== "left"
      ? {}
      : labelPosition === "right"
      ? { ml: "42px" }   // indent past the checkbox icon
      : labelPosition === "left"
      ? { mr: "42px" }   // mirror indent for label-on-left layout
      : {};              // top/bottom: no indent

  const helperTextSx = {
    mt: 0.5,
    textAlign: pageAlignment as "left" | "center" | "right",
    ...helperIndent,
  };

  const checkboxSx: Record<string, unknown> = {};

  if (customSize) {
    checkboxSx["& .MuiSvgIcon-root"] = { fontSize: `${customSize}px` };
  }

  if (checkedColor) {
    checkboxSx["&.Mui-checked"] = { color: checkedColor };
  }

  const controlLabel = (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          size={size}
          color={color}
          disabled={disabled}
          slotProps={{
            input: {
              "aria-invalid": error ? true : undefined,
              "aria-required": required ? true : undefined,
            } as React.InputHTMLAttributes<HTMLInputElement>,
          }}
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
            textAlign: pageAlignment,
          }}
        >
          {label}
          {required && (
            <span style={{ color: theme.palette.error.main, marginLeft: 3 }}>*</span>
          )}
        </Typography>
      }
      labelPlacement={placementMap[labelPosition]}
    />
  );

  // Wrap tooltip tightly around the FormControlLabel so it anchors next to the visible control
  const wrappedControlLabel =
    errorVariant === "tooltip" ? (
      <VrmaToolTip
        title={resolvedHelperText}
        severity="error"
        open={error && Boolean(resolvedHelperText)}
        placement={tooltipPlacement}
        arrow
      >
        <Box sx={{ display: "inline-flex" }}>{controlLabel}</Box>
      </VrmaToolTip>
    ) : (
      controlLabel
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: outerAlignItems, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent, width: "100%" }}>
        {wrappedControlLabel}
      </Box>
      {errorVariant === "helperText" && resolvedHelperText && (
        <FormHelperText error={error} sx={helperTextSx}>
          {resolvedHelperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default VrmaCheckbox;
