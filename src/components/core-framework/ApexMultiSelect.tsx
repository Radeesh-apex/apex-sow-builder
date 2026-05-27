import { Autocomplete, Chip, TextField } from "@mui/material";
import type { ApexOption } from "../types";

interface Props {
  label?: string;
  options: ApexOption[];
  value: ApexOption[] | null;
  onChange: (value: ApexOption[]) => void;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  color?: "primary" | "secondary";
  labelSize?: number | string;
  width?: number | string;
  placeholder?: string;
}

const ApexMultiSelect = ({
  label,
  options,
  value,
  onChange,
  size = "medium",
  variant = "outlined",
  disabled = false,
  fullWidth = true,
  color = "primary",
  labelSize = 14,
  width = "100%",
  placeholder,
}: Props) => {
  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSize;

  return (
    <Autocomplete<ApexOption, true, false, false>
      multiple
      options={options}
      value={value ?? []}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      onChange={(_, newValue) => onChange(newValue)}
      filterSelectedOptions
      disabled={disabled}
      fullWidth={fullWidth}
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
          placeholder={!value?.length ? placeholder : undefined}
          InputLabelProps={{
            ...params.InputLabelProps,
            sx: { fontSize: resolvedLabelSize },
          }}
          inputProps={{
            ...params.inputProps,
            style: { fontSize: resolvedLabelSize },
          }}
        />
      )}
    />
  );
};

export default ApexMultiSelect;
