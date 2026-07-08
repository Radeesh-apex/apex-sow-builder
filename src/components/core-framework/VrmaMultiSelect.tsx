import { Autocomplete, Box, Chip, CircularProgress, TextField, Typography } from "@mui/material";
import type { VrmaOption } from "../types";
import VrmaToolTip from "./VrmaToolTip";

interface Props {
  label?: string;
  options: VrmaOption[];
  value: VrmaOption[] | null;
  onChange: (value: VrmaOption[]) => void;
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
  labelSize?: number | string;
  width?: number | string;
  placeholder?: string;
  /** Show loading spinner in the dropdown */
  isLoading?: boolean;
  /** Message shown while loading (default: "Loading items...") */
  loadingText?: string;
}

const VrmaMultiSelect = ({
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
  labelSize = 14,
  width = "100%",
  placeholder,
  isLoading = false,
  loadingText = "Loading items...",
}: Props) => {
  const resolvedHelperText =
    helperText ??
    (error && required && label
      ? `The ${label.trim().charAt(0).toUpperCase() + label.trim().slice(1)} field is required`
      : "");

  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSize;

  const autocomplete = (
    <Autocomplete<VrmaOption, true, false, false>
      multiple
      options={options}
      value={value ?? []}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      onChange={(_, newValue) => onChange(newValue)}
      filterSelectedOptions
      disabled={disabled}
      fullWidth={fullWidth}
      loading={isLoading}
      noOptionsText={
        isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 0.5 }}>
            <CircularProgress size={18} />
            <Typography variant="body2">{loadingText}</Typography>
          </Box>
        ) : "No options"
      }
      sx={{ width }}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index }) as {
            key?: React.Key;
          } & Record<string, unknown>;
          return (
            <Chip
              key={option.value}
              label={option.label}
              size={size === "small" ? "small" : "small"}
              color={color}
              variant="outlined"
              {...tagProps}
            />
          );
        })
      }
      renderOption={(props, option) => {
        const { key, ...rest } = props as { key?: React.Key } & Record<string, unknown>;
        return (
          <li key={key} {...rest} style={{ fontSize: resolvedLabelSize }}>
            {option.label}
          </li>
        );
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
          placeholder={!value?.length ? placeholder : undefined}
          InputLabelProps={{
            ...params.InputLabelProps,
            sx: { fontSize: resolvedLabelSize },
          }}
          inputProps={{
            ...params.inputProps,
            style: { fontSize: resolvedLabelSize },
          }}
          sx={{
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

export default VrmaMultiSelect;
