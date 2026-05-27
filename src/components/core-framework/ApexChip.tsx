import React from "react";
import { Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";

interface ApexChipProps {
  label: React.ReactNode;
  variant?: "filled" | "outlined";
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium";
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactElement;
  avatar?: React.ReactElement;
  /** Custom font size override */
  fontSize?: number | string;
  /** Custom background color (overrides color prop) */
  bgColor?: string;
  /** Custom text color (overrides color prop) */
  textColor?: string;
  /** Custom border radius */
  borderRadius?: number | string;
  sx?: ChipProps["sx"];
}

const ApexChip: React.FC<ApexChipProps> = ({
  label,
  variant = "filled",
  color = "default",
  size = "medium",
  onDelete,
  onClick,
  disabled = false,
  icon,
  avatar,
  fontSize,
  bgColor,
  textColor,
  borderRadius,
  sx,
}) => {
  return (
    <Chip
      label={label}
      variant={variant}
      color={color}
      size={size}
      onDelete={onDelete}
      onClick={onClick}
      disabled={disabled}
      icon={icon}
      avatar={avatar}
      sx={[
        {
          ...(fontSize !== undefined && { fontSize }),
          ...(bgColor !== undefined && { backgroundColor: bgColor }),
          ...(textColor !== undefined && { color: textColor }),
          ...(borderRadius !== undefined && { borderRadius }),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
};

export default ApexChip;
