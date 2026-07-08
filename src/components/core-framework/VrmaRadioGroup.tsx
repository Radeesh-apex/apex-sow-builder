import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Stack,
} from "@mui/material";
import type { VrmaOption } from "../types";
import VrmaToolTip from "./VrmaToolTip";

interface Props {
  label: string;
  value: string;
  options: VrmaOption[];
  onChange: (value: string) => void;
  row?: boolean;
  direction?: "row" | "column";
  formLabelDirection?: "row" | "column";
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  /** "helperText" shows error below the group (default); "tooltip" shows it as a red tooltip */
  errorVariant?: "helperText" | "tooltip";
  /** Tooltip placement when errorVariant="tooltip" (default: "right") */
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
  size?: "small" | "medium";
  customSize?: number;
  color?: "primary" | "secondary" | "default";
  spacing?: number;
  labelSize?: "small" | "medium" | "large" | number;
  labelPlacement?: "start" | "end" | "top" | "bottom";
  labelPosition?: "start" | "end" | "top" | "bottom";
  radioColor?: string;
  labelColor?: string;
  columns?: number;
}

const VrmaRadioGroup = ({
  label,
  value,
  options = [],
  onChange,
  row,
  direction = "column",
  formLabelDirection = "column",
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorVariant = "helperText",
  tooltipPlacement = "right",
  size = "medium",
  customSize,
  color = "primary",
  spacing = 0.5,
  labelSize = "medium",
  labelPlacement,
  labelPosition = "end",
  radioColor,
  labelColor,
  columns = 1,
}: Props) => {
  const resolvedHelperText =
    helperText ??
    (error && required && label
      ? `The ${label.trim().charAt(0).toUpperCase() + label.trim().slice(1)} field is required`
      : "");

  const resolvedLabelPlacement = labelPlacement ?? labelPosition;
  const resolvedDirection: "row" | "column" = row ? "row" : direction;
  const isRow = resolvedDirection === "row";

  const labelSizeMap: Record<"small" | "medium" | "large", string> = {
    small: "0.75rem",
    medium: "0.875rem",
    large: "1rem",
  };

  const resolvedLabelSize =
    typeof labelSize === "number" ? `${labelSize}px` : labelSizeMap[labelSize];

  const radioSx = {
    ...(customSize && { "& .MuiSvgIcon-root": { fontSize: `${customSize}px` } }),
    ...(radioColor && { "&.Mui-checked": { color: radioColor } }),
  };

  const buildOption = (opt: VrmaOption, key: string) => (
    <FormControlLabel
      key={key}
      value={opt.value}
      labelPlacement={resolvedLabelPlacement}
      sx={{ m: 0 }}
      control={
        <Radio size={size} color={color} disabled={disabled} sx={radioSx} />
      }
      label={
        <Typography sx={{ fontSize: resolvedLabelSize, color: labelColor }}>
          {opt.label}
        </Typography>
      }
    />
  );

  const renderOptions = () => {
    if (columns > 1) {
      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: spacing,
          }}
        >
          {options.map((opt) => buildOption(opt, String(opt.value)))}
        </Box>
      );
    }
    return options.map((opt, idx) => buildOption(opt, `${opt.value}-${idx}`));
  };

  const content = (
    <FormControl error={error} required={required} sx={{ m: 0, p: 0, "& .MuiFormLabel-asterisk": { color: "error.main" } }}>
      <Stack
        direction={formLabelDirection}
        alignItems={formLabelDirection === "row" ? "center" : "flex-start"}
        spacing={1}
      >
        <FormLabel
          sx={{ fontSize: resolvedLabelSize, color: labelColor, display: "flex", alignItems: "flex-start" }}
        >
          {label}
        </FormLabel>

        <RadioGroup
          value={value}
          onChange={(e) => onChange(e.target.value)}
          row={columns === 1 ? isRow : undefined}
          sx={
            columns > 1
              ? undefined
              : isRow
              ? { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: spacing }
              : { display: "flex", flexDirection: "column", gap: spacing }
          }
        >
          {renderOptions()}
        </RadioGroup>
      </Stack>

      {errorVariant === "helperText" && resolvedHelperText && (
        <FormHelperText sx={{ mt: 0.5, textAlign: "left", marginLeft: 0 }}>
          {resolvedHelperText}
        </FormHelperText>
      )}
    </FormControl>
  );

  if (errorVariant === "tooltip") {
    return (
      <VrmaToolTip
        title={resolvedHelperText}
        severity="error"
        open={error && Boolean(resolvedHelperText)}
        placement={tooltipPlacement}
        arrow
      >
        <Box sx={{ display: "inline-flex" }}>{content}</Box>
      </VrmaToolTip>
    );
  }

  return content;
};

export default VrmaRadioGroup;
