import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";
import type { ApexOption } from "../types";

interface Props {
  label?: string;
  value: string | number;
  options: ApexOption[];
  onChange: (value: string | number) => void;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  color?: "primary" | "secondary";
  labelSize?: "small" | "medium" | "large" | number;
  width?: string | number;
  align?: "left" | "center" | "right"; // ✅ new: control alignment of selected value
}

const ApexSelect = ({
  label,
  value,
  options,
  onChange,
  size = "small",
  variant = "outlined",
  disabled = false,
  fullWidth = true,
  color = "primary",
  labelSize = "medium",
  width,
  align = "left", // ✅ default: left
}: Props) => {
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

  return (
    <FormControl
      fullWidth={fullWidth}
      disabled={disabled}
      variant={variant}
      sx={{ width }}
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
    </FormControl>
  );
};

export default ApexSelect;
