import React from "react";
import { Button } from "@mui/material";
import type { SxProps } from "@mui/system";

interface ApexButtonProps {
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

const ApexButton: React.FC<ApexButtonProps> = ({
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
}) => (
  <Button
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
  >
    {label}
  </Button>
);

export default ApexButton;
