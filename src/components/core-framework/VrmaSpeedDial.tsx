import React from "react";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Backdrop,
  Box,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export interface SpeedDialActionItem {
  icon: React.ReactElement;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  tooltipOpen?: boolean;
}

export interface VrmaSpeedDialProps {
  actions: SpeedDialActionItem[];
  /** Custom open icon (default: SpeedDialIcon) */
  icon?: React.ReactElement;
  /** Custom close icon */
  openIcon?: React.ReactElement;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  direction?: "up" | "down" | "left" | "right";
  /** "fixed" = fixed to viewport; "absolute" = positioned within container */
  position?: "fixed" | "absolute";
  bottom?: number | string;
  right?: number | string;
  top?: number | string;
  left?: number | string;
  size?: "small" | "medium" | "large";
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  disabled?: boolean;
  showLabels?: boolean;
  /**
   * Placement of the action labels when showLabels=true.
   * Defaults to "left" for up/down and "bottom" for left/right.
   */
  labelPlacement?: "left" | "right" | "top" | "bottom";
  /** Show a backdrop behind the speed dial when open */
  backdrop?: boolean;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

const fabSizeMap: Record<"small" | "medium" | "large", number> = {
  small: 40,
  medium: 56,
  large: 68,
};

const VrmaSpeedDial: React.FC<VrmaSpeedDialProps> = ({
  actions,
  icon,
  openIcon,
  open: openProp,
  onOpen,
  onClose,
  direction = "up",
  position = "fixed",
  bottom = 24,
  right = 24,
  top,
  left,
  size = "medium",
  color = "primary",
  disabled = false,
  showLabels = false,
  labelPlacement,
  backdrop = false,
  ariaLabel = "Speed dial",
  sx,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp : internalOpen;

  function handleOpen() {
    if (!isControlled) setInternalOpen(true);
    onOpen?.();
  }

  function handleClose() {
    if (!isControlled) setInternalOpen(false);
    onClose?.();
  }

  const fabSize = fabSizeMap[size];

  // Labels shown to the side make sense for up/down; top/bottom make sense
  // when actions expand horizontally (left/right direction).
  const resolvedLabelPlacement: "left" | "right" | "top" | "bottom" =
    labelPlacement ??
    (direction === "left" || direction === "right" ? "bottom" : "left");

  const positionSx: SxProps<Theme> = {
    position,
    ...(bottom !== undefined && { bottom }),
    ...(right !== undefined && { right }),
    ...(top !== undefined && { top }),
    ...(left !== undefined && { left }),
  };

  const colorMap: Record<string, string> = {
    primary: "primary.main",
    secondary: "secondary.main",
    error: "error.main",
    info: "info.main",
    success: "success.main",
    warning: "warning.main",
  };

  const fabBgColor = color === "default" ? undefined : colorMap[color];

  return (
    <Box sx={{ position: "relative", zIndex: 1050 }}>
      {backdrop && (
        <Backdrop open={isOpen} sx={{ zIndex: 1049 }} onClick={handleClose} />
      )}
      <SpeedDial
        ariaLabel={ariaLabel}
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        direction={direction}
        icon={icon ? <SpeedDialIcon icon={icon} openIcon={openIcon} /> : <SpeedDialIcon openIcon={openIcon} />}
        FabProps={{
          disabled,
          sx: {
            width: fabSize,
            height: fabSize,
            minHeight: fabSize,
            ...(fabBgColor && {
              bgcolor: fabBgColor,
              "&:hover": { bgcolor: fabBgColor, filter: "brightness(0.9)" },
            }),
          },
        }}
        sx={{
          ...positionSx,
          ...(sx as object),
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.label}
            icon={action.icon}
            tooltipTitle={action.label}
            tooltipOpen={showLabels || action.tooltipOpen}
            tooltipPlacement={resolvedLabelPlacement}
            onClick={() => {
              action.onClick?.();
              handleClose();
            }}
            FabProps={{ disabled: action.disabled }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default VrmaSpeedDial;
