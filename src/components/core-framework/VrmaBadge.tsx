import React from "react";
import { Badge, Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export interface VrmaBadgeProps {
  children: React.ReactNode;
  /** Badge content — number, string, or any ReactNode */
  content?: React.ReactNode;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  /** "standard" = rounded pill; "dot" = small dot with no content */
  variant?: "standard" | "dot";
  /** Maximum number shown before "+" is appended */
  max?: number;
  /** Show zero value */
  showZero?: boolean;
  invisible?: boolean;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "right";
  };
  overlap?: "rectangular" | "circular";
  /** Pixel size of the badge circle (standard variant) */
  size?: number;
  /** Custom hex/CSS background color (overrides color prop) */
  bgColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Animate a pulse ring when badge has content */
  pulse?: boolean;
  sx?: SxProps<Theme>;
}

const VrmaBadge: React.FC<VrmaBadgeProps> = ({
  children,
  content,
  color = "error",
  variant = "standard",
  max = 99,
  showZero = false,
  invisible = false,
  anchorOrigin = { vertical: "top", horizontal: "right" },
  overlap = "rectangular",
  size,
  bgColor,
  textColor,
  pulse = false,
  sx,
}) => {
  const customColorSx: SxProps<Theme> =
    bgColor || textColor || size
      ? {
          "& .MuiBadge-badge": {
            ...(bgColor && { backgroundColor: bgColor, color: textColor ?? "#fff" }),
            ...(textColor && !bgColor && { color: textColor }),
            ...(size && {
              width: size,
              height: size,
              minWidth: size,
              fontSize: size * 0.45,
              borderRadius: size / 2,
            }),
            ...(pulse && {
              "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "vrma-badge-ripple 1.2s infinite ease-in-out",
                border: "2px solid currentColor",
                content: '""',
              },
            }),
          },
          "@keyframes vrma-badge-ripple": {
            "0%": { transform: "scale(1)", opacity: 1 },
            "100%": { transform: "scale(2.2)", opacity: 0 },
          },
        }
      : {};

  return (
    <Box sx={{ display: "inline-flex", ...((sx as object) ?? {}) }}>
      <Badge
        badgeContent={content}
        color={bgColor ? undefined : color}
        variant={variant}
        max={max}
        showZero={showZero}
        invisible={invisible}
        anchorOrigin={anchorOrigin}
        overlap={overlap}
        sx={customColorSx}
      >
        {children}
      </Badge>
    </Box>
  );
};

export default VrmaBadge;
