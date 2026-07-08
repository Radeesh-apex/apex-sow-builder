import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export interface VrmaMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactElement;
  /** Secondary text shown below the label */
  description?: string;
  disabled?: boolean;
  /** Render a divider above this item */
  dividerAbove?: boolean;
  /** Render a divider below this item */
  dividerBelow?: boolean;
  /** Custom color for the item text */
  color?: string;
  onClick?: () => void;
}

export interface VrmaMenuProps {
  /** The element that triggers the menu */
  trigger: React.ReactElement;
  items: VrmaMenuItem[];
  /** Optional heading shown at the top of the menu */
  heading?: string;
  /** How the menu opens — "click" (default) or "context" (right-click) */
  openOn?: "click" | "context";
  /** Close menu after an item is clicked (default true) */
  closeOnClick?: boolean;
  anchorOrigin?: {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  transformOrigin?: {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  minWidth?: number | string;
  maxHeight?: number | string;
  dense?: boolean;
  sx?: SxProps<Theme>;
}

const VrmaMenu: React.FC<VrmaMenuProps> = ({
  trigger,
  items,
  heading,
  openOn = "click",
  closeOnClick = true,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
  transformOrigin = { vertical: "top", horizontal: "left" },
  minWidth = 180,
  maxHeight,
  dense = false,
  sx,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  function handleOpen(e: React.MouseEvent<HTMLElement>) {
    if (openOn === "context") e.preventDefault();
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const triggerProps =
    openOn === "context"
      ? { onContextMenu: handleOpen }
      : { onClick: handleOpen };

  const clonedTrigger = React.cloneElement(trigger, triggerProps);

  return (
    <>
      {clonedTrigger}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        slotProps={{
          paper: {
            sx: {
              minWidth,
              ...(maxHeight && { maxHeight, overflowY: "auto" }),
              ...(sx as object),
            },
          },
        }}
        disableAutoFocusItem
      >
        {heading && (
          <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
            <Typography variant="caption" color="text.disabled" fontWeight={600} textTransform="uppercase">
              {heading}
            </Typography>
          </Box>
        )}

        {items.flatMap((item) => {
          const nodes: React.ReactNode[] = [];
          if (item.dividerAbove) nodes.push(<Divider key={`${item.key}-da`} />);
          nodes.push(
            <MenuItem
              key={item.key}
              dense={dense}
              disabled={item.disabled}
              onClick={() => {
                item.onClick?.();
                if (closeOnClick) handleClose();
              }}
              sx={{ color: item.color ?? "inherit" }}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: item.color ?? "inherit" }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                secondary={item.description}
                slotProps={{
                  primary: { variant: dense ? "body2" : "body1" },
                  secondary: { variant: "caption" },
                }}
              />
            </MenuItem>
          );
          if (item.dividerBelow) nodes.push(<Divider key={`${item.key}-db`} />);
          return nodes;
        })}
      </Menu>
    </>
  );
};

export default VrmaMenu;
