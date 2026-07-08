import React from "react";
import { Tooltip, useTheme } from "@mui/material";
import type { TooltipProps } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

type TooltipPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

type TooltipSeverity = "default" | "error" | "success" | "warning" | "info";

interface VrmaToolTipProps {
  children: ReactElement;
  title: ReactNode;
  placement?: TooltipPlacement;
  arrow?: boolean;
  disabled?: boolean;
  /** Controlled open state — omit for hover/focus behaviour */
  open?: boolean;
  /** Colour variant of the tooltip */
  severity?: TooltipSeverity;
  enterDelay?: number;
  leaveDelay?: number;
  componentsProps?: TooltipProps["componentsProps"];
}

const VrmaToolTip: React.FC<VrmaToolTipProps> = ({
  children,
  title,
  placement = "top",
  arrow = false,
  disabled = false,
  open,
  severity = "default",
  enterDelay = 100,
  leaveDelay = 0,
  componentsProps,
}) => {
  const theme = useTheme();

  const severityColors: Record<TooltipSeverity, { bg: string; text: string }> = {
    default: { bg: theme.palette.primary.dark,   text: theme.palette.primary.contrastText },
    error:   { bg: theme.palette.error.main,     text: theme.palette.error.contrastText },
    success: { bg: theme.palette.success.main,   text: theme.palette.success.contrastText },
    warning: { bg: theme.palette.warning.main,   text: theme.palette.warning.contrastText },
    info:    { bg: theme.palette.info.main,      text: theme.palette.info.contrastText },
  };

  const { bg: tooltipBg, text: tooltipText } = severityColors[severity];

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
      open={open}
      componentsProps={componentsProps}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: { offset: [0, 8] },
            },
            {
              name: "flip",
              options: {
                // Prefer top/bottom over left so full-width controls don't flip to the far left
                fallbackPlacements: ["top", "bottom", "left", "right"],
              },
            },
            {
              name: "preventOverflow",
              options: { altAxis: true },
            },
          ],
        },
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

export default VrmaToolTip;
