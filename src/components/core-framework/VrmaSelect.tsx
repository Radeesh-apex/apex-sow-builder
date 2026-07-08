import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import VrmaToolTip from "./VrmaToolTip";

import type { SelectChangeEvent } from "@mui/material";
import type { VrmaOption } from "../types";

interface Props {
  label?: string;
  value: string | number;
  options: VrmaOption[];
  onChange: (value: string | number) => void;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  /** "helperText" shows the error below the field (default); "tooltip" shows it in a red tooltip */
  errorVariant?: "helperText" | "tooltip";
  /** Tooltip placement when errorVariant="tooltip" (default: "right") */
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
  color?: "primary" | "secondary";
  labelSize?: "small" | "medium" | "large" | number;
  width?: string | number;
  align?: "left" | "center" | "right";
}

const VrmaSelect = ({
  label,
  value,
  options,
  onChange,
  size = "small",
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
  width,
  align = "left",
}: Props) => {
  const resolvedHelperText =
    helperText ??
    (error && required && label
      ? `The ${label.trim().charAt(0).toUpperCase() + label.trim().slice(1)} field is required`
      : "");

  const labelId = label ? `${label.replace(/\s+/g, "-").toLowerCase()}-label` : undefined;

  const handleChange = (e: SelectChangeEvent<string | number>) => {
    onChange(e.target.value as string | number);
  };

  const labelSizeMap: Record<"small" | "medium" | "large", string> = {
    small: "0.75rem",
    medium: "0.875rem",
    large: "1rem",
  };

  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSizeMap[labelSize];

  const control = (
    <FormControl
      fullWidth={fullWidth}
      disabled={disabled}
      variant={variant}
      required={required}
      error={error}
      sx={{
        width,
        "& .MuiFormLabel-asterisk": {
          color: "error.main",
        },
        "& .MuiFormHelperText-root": {
          textAlign: "left",
        },
      }}
    >
      {label && (
        <InputLabel
          id={labelId}
          shrink
          sx={{ fontSize: resolvedLabelSize }}
        >
          {label}
        </InputLabel>
      )}

      <Select
        labelId={labelId}
        id={labelId ? `${labelId}-select` : undefined}
        value={value}
        label={label}
        onChange={handleChange}
        size={size}
        color={color}
        displayEmpty
        sx={{
          fontSize: resolvedLabelSize,
          textAlign: align,
        }}
        renderValue={(selected) => {
          if (selected === "" || selected === undefined || selected === null) {
            return (
              <span style={{ color: "rgba(0,0,0,0.38)", display: "inline-block", width: "100%", textAlign: align }}>
                Select…
              </span>
            );
          }
          const selectedOption = options.find((opt) => opt.value === selected);
          return selectedOption ? selectedOption.label : String(selected);
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            sx={{ fontSize: resolvedLabelSize }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      {errorVariant === "helperText" && resolvedHelperText && (
        <FormHelperText sx={{ fontSize: resolvedLabelSize }}>
          {resolvedHelperText}
        </FormHelperText>
      )}
    </FormControl>
  );

  if (errorVariant === "tooltip") {
    return (
      <Box sx={{ position: "relative", width: fullWidth ? "100%" : width }}>
        {control}
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

  return control;
};

export default VrmaSelect;
