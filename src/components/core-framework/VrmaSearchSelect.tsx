import { Autocomplete, Box, CircularProgress, TextField, Typography } from "@mui/material";
import type { VrmaOption } from "../types";
import VrmaToolTip from "./VrmaToolTip";

interface Props {
  label?: string;
  options: VrmaOption[];
  value: VrmaOption | null;
  onChange: (value: VrmaOption | null) => void;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  /** "helperText" shows error below the field (default); "tooltip" shows it in a red tooltip */
  errorVariant?: "helperText" | "tooltip";
  /** Tooltip placement when errorVariant="tooltip" (default: "right") */
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
  color?: "primary" | "secondary";
  labelSize?: "small" | "medium" | "large" | number;
  optionFontSize?: "small" | "medium" | "large" | number;
  inputFontSize?: "small" | "medium" | "large" | number;
  width?: string | number;
  /** Show loading spinner in the dropdown */
  isLoading?: boolean;
  /** Message shown while loading (default: "Loading items...") */
  loadingText?: string;
}

const VrmaSearchSelect = ({
  label,
  options,
  value,
  onChange,
  size = "medium",
  variant = "outlined",
  disabled = false,
  fullWidth = true,
  required = false,
  error = false,
  helperText,
  errorVariant = "helperText",
  tooltipPlacement = "right",
  color = "primary",
  labelSize = "medium",
  optionFontSize = "medium",
  inputFontSize = "medium",
  width,
  isLoading = false,
  loadingText = "Loading items...",
}: Props) => {
  const resolvedHelperText =
    helperText ??
    (error && required && label
      ? `The ${label.trim().charAt(0).toUpperCase() + label.trim().slice(1)} field is required`
      : "");

  const sizeMap: Record<"small" | "medium" | "large", string> = {
    small: "0.75rem",
    medium: "0.875rem",
    large: "1rem",
  };

  const resolve = (
    val:
      | Props["labelSize"]
      | Props["optionFontSize"]
      | Props["inputFontSize"]
      | undefined,
  ) => (typeof val === "number" ? `${val}px` : val ? sizeMap[val] : undefined);

  const resolvedLabelSize = resolve(labelSize);
  const resolvedOptionFontSize = resolve(optionFontSize);
  const resolvedInputFontSize = resolve(inputFontSize);

  const autocomplete = (
    <Autocomplete
      options={options}
      value={value}
      getOptionLabel={(o) => o.label}
      onChange={(_, val) => onChange(val)}
      fullWidth={fullWidth}
      disabled={disabled}
      loading={isLoading}
      noOptionsText={
        isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 0.5 }}>
            <CircularProgress size={18} />
            <Typography variant="body2">{loadingText}</Typography>
          </Box>
        ) : "No options"
      }
      sx={{
        width,
        "& .MuiInputLabel-root": {
          fontSize: resolvedLabelSize,
        },
      }}
      slotProps={{
        popper: {
          sx: {
            "& .MuiAutocomplete-option": {
              fontSize: resolvedOptionFontSize,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size={size}
          variant={variant}
          color={color}
          required={required}
          error={error}
          helperText={errorVariant === "helperText" ? resolvedHelperText : undefined}
          sx={{
            "& .MuiInputBase-input, & .MuiAutocomplete-input": {
              fontSize: `${resolvedInputFontSize} !important`,
            },
            "& .MuiFormLabel-asterisk": { color: "error.main" },
            "& .MuiFormHelperText-root": { textAlign: "left" },
          }}
        />
      )}
    />
  );

  if (errorVariant === "tooltip") {
    return (
      <Box sx={{ position: "relative", width: fullWidth ? "100%" : width, "& .MuiFormControl-root": { width: "100%" } }}>
        {autocomplete}
        <VrmaToolTip
          title={resolvedHelperText}
          severity="error"
          open={error && Boolean(resolvedHelperText)}
          placement={tooltipPlacement}
          arrow
        >
          <Box
            component="span"
            sx={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, pointerEvents: "none" }}
          />
        </VrmaToolTip>
      </Box>
    );
  }

  return autocomplete;
};

export default VrmaSearchSelect;
