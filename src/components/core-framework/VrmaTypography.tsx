import React from "react";
import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";

interface VrmaTypographyProps extends Omit<TypographyProps, "color"> {
  /** Text or JSX content */
  children: React.ReactNode;
  /** Custom text color */
  color?: string;
  /** Custom font size */
  fontSize?: number | string;
  /** Custom font weight */
  fontWeight?: number | string;
  /** Custom background color */
  bgColor?: string;
  /** Border color */
  borderColor?: string;
  /** Border radius */
  borderRadius?: number | string;
  /** Border width */
  borderWidth?: number | string;
  /** Padding */
  padding?: number | string;
  /** Margin */
  margin?: number | string;
  /** Custom width */
  width?: number | string;
}

const VrmaTypography: React.FC<VrmaTypographyProps> = ({
  children,
  color,
  fontSize,
  fontWeight,
  bgColor,
  borderColor,
  borderRadius,
  borderWidth,
  padding,
  margin,
  width,
  ...rest
}) => {
  return (
    <Typography
      {...rest}
      sx={{
        color,
        fontSize,
        fontWeight,
        backgroundColor: bgColor,
        borderColor,
        borderRadius,
        borderWidth,
        borderStyle: borderColor ? "solid" : undefined,
        padding,
        margin,
        width,
        display: "inline-block", // ensures width applies properly
      }}
    >
      {children}
    </Typography>
  );
};

export default VrmaTypography;
