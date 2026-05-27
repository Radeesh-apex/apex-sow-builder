import { TextField } from "@mui/material";

type ApexTextFieldProps = Omit<React.ComponentProps<typeof TextField>, "onChange" | "onBlur" | "onFocus"> & {
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
};

const ApexTextField = ({
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
  ...props
}: ApexTextFieldProps) => {
  const sizeMap: Record<"small" | "medium" | "large", string> = {
    small: "0.75rem",
    medium: "0.875rem",
    large: "1rem",
  };

  const resolveSize = (val: string | number) =>
    typeof val === "number" ? `${val}px` : sizeMap[val as keyof typeof sizeMap];

  const resolvedLabelSize = resolveSize(labelSize);
  const resolvedInputFontSize = resolveSize(inputFontSize);

  return (
    <TextField
      label={label}
      size={size}
      variant={variant}
      disabled={disabled}
      fullWidth={fullWidth}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={(e) => onBlur?.(e.target.value)}
      onFocus={(e) => onFocus?.(e.target.value)}
      sx={{
        width,
        "& .MuiInputLabel-root": {
          fontSize: resolvedLabelSize,
          color: labelColor,
        },
        "& .MuiInputBase-input": {
          fontSize: resolvedInputFontSize,
          textAlign: textAlign,
          color: fontColor,
        },
      }}
      {...props}
    />
  );
};

export default ApexTextField;
