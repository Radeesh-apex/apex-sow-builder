import React from "react";
import { Box, FormHelperText, Typography, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export interface VrmaFormFieldProps {
  /** Field label */
  label: string;
  /**
   * "top"  — label above the control (default)
   * "side" — label on the left, control on the right
   */
  labelPlacement?: "top" | "side";
  /** Width of the label column when labelPlacement="side". Default 140 */
  labelWidth?: number | string;
  /** Marks field required — shows red * after the label */
  required?: boolean;
  /** When true, shows the optional badge next to the label */
  optional?: boolean;
  /**
   * Text shown in the optional badge. Default: "Optional".
   * Pass your i18n value (e.g. t.common.optional) to localize it.
   */
  optionalText?: string;
  /** Show a colon after the label. Default true for "side", false for "top" */
  colon?: boolean;
  /** Vertical alignment of the label in side mode. Default "center" */
  labelAlign?: "flex-start" | "center";
  /** Font size of the label. Default "0.875rem" */
  labelSize?: number | string;
  /** Helper / error text shown below the field */
  helperText?: string;
  /** When true helperText renders in error (red) color */
  error?: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const VrmaFormField: React.FC<VrmaFormFieldProps> = ({
  label,
  labelPlacement = "top",
  labelWidth = 140,
  required = false,
  optional = false,
  optionalText = "Optional",
  colon,
  labelAlign = "center",
  labelSize = "0.875rem",
  helperText,
  error = false,
  children,
  sx,
}) => {
  const theme = useTheme();
  const showColon = colon ?? labelPlacement === "side";
  const resolvedLabelSize = typeof labelSize === "number" ? `${labelSize}px` : labelSize;

  const labelNode = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.75,
        flexShrink: 0,
        ...(labelPlacement === "side" && {
          width: labelWidth,
          minWidth: labelWidth,
        }),
      }}
    >
      <Typography
        component="label"
        sx={{
          fontSize: resolvedLabelSize,
          fontWeight: 500,
          color: error ? "error.main" : "text.primary",
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {label}
        {showColon && ":"}
        {required && (
          <Typography
            component="span"
            sx={{ color: "error.main", ml: 0.25, fontWeight: 600, fontSize: resolvedLabelSize }}
          >
            *
          </Typography>
        )}
      </Typography>

      {optional && (
        <Typography
          component="span"
          sx={{
            fontSize: "0.7rem",
            color: "text.disabled",
            bgcolor: "action.hover",
            px: 0.75,
            py: 0.1,
            borderRadius: 0.75,
            border: `1px solid ${theme.palette.divider}`,
            lineHeight: 1.6,
          }}
        >
          {optionalText}
        </Typography>
      )}
    </Box>
  );

  if (labelPlacement === "side") {
    return (
      <Box sx={{ ...(sx as object) }}>
        <Box sx={{ display: "flex", alignItems: labelAlign, gap: 2, width: "100%" }}>
          {labelNode}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {children}
          </Box>
        </Box>
        {helperText && (
          <Box sx={{ pl: `calc(${typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth} + 16px)` }}>
            <FormHelperText error={error} sx={{ mx: 0, mt: 0.25 }}>
              {helperText}
            </FormHelperText>
          </Box>
        )}
      </Box>
    );
  }

  // top layout
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ...(sx as object) }}>
      {labelNode}
      {children}
      {helperText && (
        <FormHelperText error={error} sx={{ mx: 0, mt: 0 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default VrmaFormField;
