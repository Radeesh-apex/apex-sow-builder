import React from "react";
import { Card, CardContent, CardActions, Box } from "@mui/material";
import type { SxProps } from "@mui/system";

interface VrmaAdvancedCardProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
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
  height?: number | string;
  sx?: SxProps;
}

const VrmaAdvancedCard: React.FC<VrmaAdvancedCardProps> = ({
  header,
  children,
  footer,
  elevation = 1,
  padding = 2,
  backgroundColor,
  borderRadius = 8,
  outlined = false,
  hoverEffect = false,
  centerContent = false,
  align = "center",
  justify = "center",
  height = "auto",
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
        height,
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      {header && (
        <Box
          sx={{
            p: padding,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {header}
        </Box>
      )}

      <CardContent
        sx={{
          p: padding,
          flex: 1,
          display: centerContent ? "flex" : "block",
          alignItems: centerContent ? align : undefined,
          justifyContent: centerContent ? justify : undefined,
        }}
      >
        {children}
      </CardContent>

      {footer && (
        <CardActions
          sx={{
            p: padding,
            borderTop: "1px solid",
            borderColor: "divider",
            justifyContent: "flex-end",
          }}
        >
          {footer}
        </CardActions>
      )}
    </Card>
  );
};

export default VrmaAdvancedCard;
