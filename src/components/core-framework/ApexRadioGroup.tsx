import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import type { ApexOption } from "../types";

interface Props {
  label: string;
  value: string;
  options: ApexOption[];
  onChange: (value: string) => void;
  /** Shorthand for direction="row" — matches MUI RadioGroup API */
  row?: boolean;
  direction?: "row" | "column";
  formLabelDirection?: "row" | "column";
  disabled?: boolean;
  size?: "small" | "medium";
  customSize?: number;
  color?: "primary" | "secondary" | "default";
  spacing?: number;
  labelSize?: "small" | "medium" | "large" | number;
  /** Label placement relative to the radio button — matches Checkbox behavior */
  labelPlacement?: "start" | "end" | "top" | "bottom";
  /** Alias for labelPlacement */
  labelPosition?: "start" | "end" | "top" | "bottom";
  radioColor?: string;
  labelColor?: string;
  columns?: number;
}

const ApexRadioGroup = ({
  label,
  value,
  options = [],
  onChange,
  row,
  direction = "column",
  formLabelDirection = "column",
  disabled = false,
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

  const buildOption = (opt: ApexOption, key: string) => (
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

    // Single column or row — let MUI RadioGroup handle the flex direction natively
    return options.map((opt, idx) => buildOption(opt, `${opt.value}-${idx}`));
  };

  return (
    <FormControl sx={{ m: 0, p: 0 }}>
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

        {/* Pass row to RadioGroup so MUI applies flex-direction:row natively */}
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
    </FormControl>
  );
};

export default ApexRadioGroup;
