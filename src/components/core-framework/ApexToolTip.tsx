import React from "react";
import { Tooltip, useTheme } from "@mui/material";
import type { TooltipProps } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

type TooltipPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

interface ApexToolTipProps {
  children: ReactElement;
  title: ReactNode;
  placement?: TooltipPlacement;
  arrow?: boolean;
  disabled?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  componentsProps?: TooltipProps["componentsProps"];
}

const ApexToolTip: React.FC<ApexToolTipProps> = ({
  children,
  title,
  placement = "top",
  arrow = false,
  disabled = false,
  enterDelay = 100,
  leaveDelay = 0,
  componentsProps,
}) => {
  const theme = useTheme();

  // Use theme-aware colors so the tooltip reflects the active theme preset
  const tooltipBg = theme.palette.primary.dark;
  const tooltipText = theme.palette.primary.contrastText;

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      componentsProps={componentsProps}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: tooltipBg,
            color: tooltipText,
            fontSize: "0.78rem",
            boxShadow: theme.shadows[4],
          },
        },
        arrow: {
          sx: { color: tooltipBg },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default ApexToolTip;
