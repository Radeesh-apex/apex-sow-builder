import { Autocomplete, TextField } from "@mui/material";
import type { ApexOption } from "../types";

interface Props {
  label?: string;
  options: ApexOption[];
  value: ApexOption | null;
  onChange: (value: ApexOption | null) => void;
  size?: "small" | "medium"; // still supports MUI defaults
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  color?: "primary" | "secondary";
  labelSize?: "small" | "medium" | "large" | number;
  optionFontSize?: "small" | "medium" | "large" | number;
  inputFontSize?: "small" | "medium" | "large" | number; // ✅ new
  width?: string | number;
}

const ApexSearchSelect = ({
  label,
  options,
  value,
  onChange,
  size = "medium",
  variant = "outlined",
  disabled = false,
  fullWidth = true,
  color = "primary",
  labelSize = "medium",
  optionFontSize = "medium",
  inputFontSize = "medium",
  width,
}: Props) => {
  const sizeMap: Record<"small" | "medium" | "large", string> = {
    small: "0.75rem", // 12px
    medium: "0.875rem", // 14px
    large: "1rem", // 16px
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

  return (
    <Autocomplete
      options={options}
      value={value}
      getOptionLabel={(o) => o.label}
      onChange={(_, val) => onChange(val)}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        width,
        "& .MuiInputLabel-root": {
          fontSize: resolvedLabelSize, // ✅ label font size
        },
      }}
      slotProps={{
        popper: {
          sx: {
            "& .MuiAutocomplete-option": {
              fontSize: resolvedOptionFontSize, // ✅ dropdown options font size
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
          sx={{
            "& .MuiInputBase-input, & .MuiAutocomplete-input": {
              fontSize: `${resolvedInputFontSize} !important`,
            },
          }}
        />
      )}
    />
  );
};

export default ApexSearchSelect;
