import { Box, TextField } from "@mui/material";
import VrmaToolTip from "./VrmaToolTip";

type VrmaTextFieldProps = Omit<React.ComponentProps<typeof TextField>, "onChange" | "onBlur" | "onFocus"> & {
  label?: string;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  labelSize?: "small" | "medium" | "large" | number;
  inputFontSize?: "small" | "medium" | "large" | number;
  width?: string | number;
  textAlign?: "left" | "center" | "right";
  labelColor?: string;
  fontColor?: string;
  /** "helperText" shows the error below the field (default); "tooltip" shows it in a red tooltip */
  errorVariant?: "helperText" | "tooltip";
  /** Tooltip placement when errorVariant="tooltip" (default: "right") */
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
};

const VrmaTextField = ({
  label,
  size = "medium",
  variant = "outlined",
  disabled = false,
  fullWidth = true,
  onChange,
  onBlur,
  onFocus,
  labelSize = "medium",
  inputFontSize = "medium",
  width,
  textAlign = "left",
  labelColor,
  fontColor,
  errorVariant = "helperText",
  tooltipPlacement = "right",
  helperText,
  error,
  required,
  ...props
}: VrmaTextFieldProps) => {
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

  const resolveSize = (val: string | number) =>
    typeof val === "number" ? `${val}px` : sizeMap[val as keyof typeof sizeMap];

  const resolvedLabelSize = resolveSize(labelSize);
  const resolvedInputFontSize = resolveSize(inputFontSize);

  const field = (
    <TextField
      label={label}
      size={size}
      variant={variant}
      disabled={disabled}
      fullWidth={fullWidth}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={(e) => onBlur?.(e.target.value)}
      onFocus={(e) => onFocus?.(e.target.value)}
      required={required}
      error={error}
      helperText={errorVariant === "helperText" ? resolvedHelperText : undefined}
      sx={{
        width,
        "& .MuiInputLabel-root": {
          fontSize: resolvedLabelSize,
          color: labelColor,
        },
        "& .MuiFormLabel-asterisk": {
          color: "error.main",
        },
        "& .MuiInputBase-input": {
          fontSize: resolvedInputFontSize,
          textAlign: textAlign,
          color: fontColor,
        },
        "& .MuiFormHelperText-root": {
          textAlign: "left",
        },
      }}
      {...props}
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

export default VrmaTextField;
