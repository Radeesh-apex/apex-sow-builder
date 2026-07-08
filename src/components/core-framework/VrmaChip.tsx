import React from "react";
import { Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";

interface VrmaChipProps extends ChipProps {
  /** Custom font size override */
  fontSize?: number | string;
  /** Custom background color (overrides color prop) */
  bgColor?: string;
  /** Custom text color (overrides color prop) */
  textColor?: string;
  /** Custom border radius */
  borderRadius?: number | string;
}

const VrmaChip = React.forwardRef<HTMLDivElement, VrmaChipProps>(({
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
  ...rest
}, ref) => (
  <Chip
    ref={ref}
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
    {...rest}
  />
));

VrmaChip.displayName = "VrmaChip";

export default VrmaChip;
