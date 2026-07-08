import React from "react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { SxProps } from "@mui/system";

interface VrmaButtonProps extends Omit<ButtonProps, "children"> {
  label: string;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "inherit" | "error" | "warning" | "info" | "success";
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
  sx?: SxProps;
}

const VrmaButton = React.forwardRef<HTMLButtonElement, VrmaButtonProps>(({
  label,
  onClick,
  startIcon,
  endIcon,
  size = "medium",
  color = "primary",
  variant = "contained",
  disabled = false,
  fullWidth = false,
  type = "button",
  href,
  sx,
  ...rest
}, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    color={color}
    fullWidth={fullWidth}
    disabled={disabled}
    onClick={onClick}
    startIcon={startIcon}
    endIcon={endIcon}
    type={type}
    href={href}
    sx={sx}
    {...rest}
  >
    {label}
  </Button>
));

VrmaButton.displayName = "VrmaButton";

export default VrmaButton;
