import React from "react";
import { Card, CardContent } from "@mui/material";
import type { SxProps } from "@mui/system";

interface ApexCardProps {
  children: React.ReactNode;
  elevation?: number;
  padding?: number | string;
  /** Explicit background override — omit to inherit theme's background.paper */
  backgroundColor?: string;
  borderRadius?: number | string;
  outlined?: boolean;
  hoverEffect?: boolean;
  centerContent?: boolean;
  align?: "flex-start" | "center" | "flex-end";
  justify?: "flex-start" | "center" | "flex-end";
  sx?: SxProps;
}

const ApexCard: React.FC<ApexCardProps> = ({
  children,
  elevation = 1,
  padding = 2,
  backgroundColor,
  borderRadius = 8,
  outlined = false,
  hoverEffect = false,
  centerContent = true,
  align = "center",
  justify = "center",
  sx,
}) => {
  return (
    <Card
      elevation={outlined ? 0 : elevation}
      variant={outlined ? "outlined" : "elevation"}
      sx={{
        ...(backgroundColor ? { backgroundColor } : {}),
        borderRadius,
        transition: hoverEffect ? "all 0.2s ease-in-out" : undefined,
        "&:hover": hoverEffect
          ? { boxShadow: 4, transform: "translateY(-2px)" }
          : undefined,
        ...sx,
      }}
    >
      <CardContent
        sx={{
          p: padding,
          display: centerContent ? "flex" : "block",
          alignItems: centerContent ? align : undefined,
          justifyContent: centerContent ? justify : undefined,
          height: "100%",
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default ApexCard;
