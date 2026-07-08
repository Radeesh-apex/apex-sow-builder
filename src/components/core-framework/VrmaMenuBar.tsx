import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface MenuBarSubItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactElement;
  shortcut?: string;
  disabled?: boolean;
  dividerAbove?: boolean;
  onClick?: () => void;
}

export interface MenuBarItem {
  key: string;
  label: React.ReactNode;
  /** Sub-items shown in the dropdown */
  items?: MenuBarSubItem[];
  /** Called for top-level items that have no dropdown */
  onClick?: () => void;
  disabled?: boolean;
}

export interface VrmaMenuBarProps {
  /** Branding displayed on the left */
  brand?: React.ReactNode;
  menus: MenuBarItem[];
  /** Elements placed on the right side of the bar */
  trailing?: React.ReactNode;
  position?: "fixed" | "sticky" | "static" | "relative" | "absolute";
  color?: "default" | "primary" | "secondary" | "transparent" | "inherit";
  elevation?: number;
  dense?: boolean;
  sx?: SxProps<Theme>;
}

const VrmaMenuBar: React.FC<VrmaMenuBarProps> = ({
  brand,
  menus,
  trailing,
  position = "static",
  color = "default",
  elevation = 1,
  dense = false,
  sx,
}) => {
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const [anchorEls, setAnchorEls] = React.useState<Record<string, HTMLElement | null>>({});

  function handleOpen(key: string, el: HTMLElement) {
    setAnchorEls((prev) => ({ ...prev, [key]: el }));
    setOpenKey(key);
  }

  function handleClose() {
    setOpenKey(null);
    setAnchorEls({});
  }

  return (
    <AppBar position={position} color={color} elevation={elevation} sx={sx}>
      <Toolbar variant={dense ? "dense" : "regular"} sx={{ gap: 0 }}>
        {brand && (
          <Box sx={{ mr: 2, display: "flex", alignItems: "center", flexShrink: 0, color: "inherit" }}>
            {typeof brand === "string" ? (
              <Typography variant="h6" component="span" noWrap color="inherit">
                {brand}
              </Typography>
            ) : (
              brand
            )}
          </Box>
        )}

        {menus.map((menu) => {
          const hasDropdown = menu.items && menu.items.length > 0;
          return (
            <React.Fragment key={menu.key}>
              <Button
                color="inherit"
                disabled={menu.disabled}
                size={dense ? "small" : "medium"}
                endIcon={hasDropdown ? <KeyboardArrowDownIcon /> : undefined}
                onClick={(e) => {
                  if (hasDropdown) {
                    handleOpen(menu.key, e.currentTarget);
                  } else {
                    menu.onClick?.();
                  }
                }}
                sx={{
                  borderRadius: 0,
                  textTransform: "none",
                  px: 1.5,
                  minWidth: "unset",
                  "&:hover": { bgcolor: "action.hover" },
                  ...(openKey === menu.key && { bgcolor: "action.selected" }),
                }}
              >
                {menu.label}
              </Button>

              {hasDropdown && (
                <Menu
                  anchorEl={anchorEls[menu.key]}
                  open={openKey === menu.key}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  slotProps={{ paper: { sx: { minWidth: 200 } } }}
                >
                  {menu.items!.flatMap((sub) => {
                    const nodes: React.ReactNode[] = [];
                    if (sub.dividerAbove) nodes.push(<Divider key={`${sub.key}-da`} />);
                    nodes.push(
                      <MenuItem
                        key={sub.key}
                        dense
                        disabled={sub.disabled}
                        onClick={() => {
                          sub.onClick?.();
                          handleClose();
                        }}
                      >
                        {sub.icon && (
                          <ListItemIcon sx={{ minWidth: 32 }}>{sub.icon}</ListItemIcon>
                        )}
                        <ListItemText primary={sub.label} />
                        {sub.shortcut && (
                          <Typography variant="caption" color="text.disabled" sx={{ ml: 3 }}>
                            {sub.shortcut}
                          </Typography>
                        )}
                      </MenuItem>
                    );
                    return nodes;
                  })}
                </Menu>
              )}
            </React.Fragment>
          );
        })}

        <Box sx={{ flex: 1 }} />
        {trailing && <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{trailing}</Box>}
      </Toolbar>
    </AppBar>
  );
};

export default VrmaMenuBar;
