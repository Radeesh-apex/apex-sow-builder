import React from "react";
import { Box, Rating, Typography, FormHelperText, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import VrmaToolTip from "./VrmaToolTip";

export interface VrmaRatingProps {
  value: number | null;
  onChange?: (value: number | null) => void;
  label?: string;
  max?: number;
  precision?: number;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  readOnly?: boolean;
  color?: string;
  emptyColor?: string;
  showValue?: boolean;
  highlightSelectedOnly?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorVariant?: "helperText" | "tooltip";
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
  labelSize?: "small" | "medium" | "large" | number;
  labelColor?: string;
  labelPosition?: "top" | "bottom" | "left" | "right";
}

const labelSizeMap: Record<"small" | "medium" | "large", string> = {
  small: "0.75rem",
  medium: "0.875rem",
  large: "1rem",
};

const VrmaRating: React.FC<VrmaRatingProps> = ({
  value,
  onChange,
  label,
  max = 5,
  precision = 1,
  size = "medium",
  disabled = false,
  readOnly = false,
  color,
  emptyColor,
  showValue = false,
  highlightSelectedOnly = false,
  required = false,
  error = false,
  helperText,
  errorVariant = "helperText",
  tooltipPlacement = "right",
  labelSize = "medium",
  labelColor,
  labelPosition = "top",
}) => {
  const theme = useTheme();

  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSizeMap[labelSize];

  const resolvedHelperText =
    helperText ??
    (error && required && label ? `${label.trim()} is required` : "");

  const starSx: Record<string, unknown> = {};
  if (color) starSx["& .MuiRating-iconFilled"] = { color };
  if (color) starSx["& .MuiRating-iconHover"] = { color };
  if (emptyColor) starSx["& .MuiRating-iconEmpty"] = { color: emptyColor };

  const ratingEl = (
    <Rating
      value={value}
      onChange={(_, v) => onChange?.(v)}
      max={max}
      precision={precision}
      size={size}
      disabled={disabled}
      readOnly={readOnly}
      highlightSelectedOnly={highlightSelectedOnly}
      emptyIcon={<StarIcon style={{ opacity: 0.35 }} fontSize="inherit" />}
      sx={starSx}
    />
  );

  const valueDisplay = showValue && value !== null && (
    <Typography
      variant="body2"
      sx={{ color: "text.secondary", minWidth: 28, textAlign: "center", fontVariantNumeric: "tabular-nums" }}
    >
      {value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}
    </Typography>
  );

  const labelEl = label && (
    <Typography
      component="label"
      sx={{ fontSize: resolvedLabelSize, color: labelColor ?? "text.primary", fontWeight: 500 }}
    >
      {label}
      {required && <span style={{ color: theme.palette.error.main, marginLeft: 3 }}>*</span>}
    </Typography>
  );

  const isHorizontal = labelPosition === "left" || labelPosition === "right";

  const content = isHorizontal ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {labelPosition === "left" && labelEl}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {ratingEl}
        {valueDisplay}
      </Box>
      {labelPosition === "right" && labelEl}
    </Box>
  ) : (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5 }}>
      {labelPosition === "top" && labelEl}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {ratingEl}
        {valueDisplay}
      </Box>
      {labelPosition === "bottom" && labelEl}
    </Box>
  );

  const wrapped =
    errorVariant === "tooltip" ? (
      <VrmaToolTip
        title={resolvedHelperText}
        severity="error"
        open={error && Boolean(resolvedHelperText)}
        placement={tooltipPlacement}
        arrow
      >
        <Box sx={{ display: "inline-flex" }}>{content}</Box>
      </VrmaToolTip>
    ) : (
      content
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5 }}>
      {wrapped}
      {errorVariant === "helperText" && resolvedHelperText && (
        <FormHelperText error={error} sx={{ mx: 0, mt: 0 }}>
          {resolvedHelperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default VrmaRating;
