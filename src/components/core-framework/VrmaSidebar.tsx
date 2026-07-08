import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export interface SidebarSubItem {
  key: string;
  label: string;
  icon?: React.ReactElement;
  badge?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface SidebarItem {
  key: string;
  label: string;
  icon?: React.ReactElement;
  badge?: React.ReactNode;
  disabled?: boolean;
  /** Expandable children */
  children?: SidebarSubItem[];
  /** Divider rendered above this item */
  dividerAbove?: boolean;
  onClick?: () => void;
}

export interface SidebarSection {
  key: string;
  title?: string;
  items: SidebarItem[];
}

export interface VrmaSidebarProps {
  sections: SidebarSection[];
  /** Currently active item key */
  activeKey?: string;
  onSelect?: (key: string) => void;
  /** Controlled collapsed state */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Width when expanded */
  width?: number | string;
  /** Width when collapsed (icon rail) */
  collapsedWidth?: number | string;
  /** Header / logo area */
  header?: React.ReactNode;
  /** Footer area */
  footer?: React.ReactNode;
  /** Show collapse toggle button */
  showToggle?: boolean;
  anchor?: "left" | "right";
  /** "permanent" = always visible; "temporary" = overlays; "persistent" = pushes content */
  variant?: "permanent" | "temporary" | "persistent";
  /** open/close for temporary/persistent variant */
  open?: boolean;
  onClose?: () => void;
  dense?: boolean;
  sx?: SxProps<Theme>;
}

const VrmaSidebar: React.FC<VrmaSidebarProps> = ({
  sections,
  activeKey,
  onSelect,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  width = 240,
  collapsedWidth = 56,
  header,
  footer,
  showToggle = true,
  anchor = "left",
  variant = "permanent",
  open = true,
  onClose,
  dense = false,
  sx,
}) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const isControlled = collapsedProp !== undefined;
  const collapsed = isControlled ? collapsedProp! : internalCollapsed;

  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(new Set());

  function toggleCollapsed() {
    const next = !collapsed;
    if (!isControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
    if (next) setExpandedKeys(new Set());
  }

  function toggleExpand(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const resolvedWidth = collapsed ? collapsedWidth : width;

  const drawerContent = (
    <Box
      sx={{
        width: resolvedWidth,
        transition: "width 0.2s ease",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      {(header || showToggle) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: collapsed ? 0 : 1.5,
            py: 1,
            minHeight: 52,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {!collapsed && header && (
            <Box sx={{ flex: 1, overflow: "hidden" }}>{header}</Box>
          )}
          {showToggle && (
            <IconButton size="small" onClick={toggleCollapsed} sx={{ flexShrink: 0 }}>
              {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>
      )}

      {/* Sections */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {sections.map((section, si) => (
          <React.Fragment key={section.key}>
            {si > 0 && <Divider sx={{ my: 0.5 }} />}
            {section.title && !collapsed && (
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ px: 2, pt: 1.5, pb: 0.25, display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {section.title}
              </Typography>
            )}
            <List dense={dense} disablePadding>
              {section.items.map((item) => {
                const isActive = activeKey === item.key;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedKeys.has(item.key);
                const isChildActive = item.children?.some((c) => c.key === activeKey);

                const mainButton = (
                  <ListItemButton
                    disabled={item.disabled}
                    selected={isActive || (isChildActive && collapsed)}
                    onClick={() => {
                      if (hasChildren && !collapsed) {
                        toggleExpand(item.key);
                      } else {
                        item.onClick?.();
                        onSelect?.(item.key);
                      }
                    }}
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      px: collapsed ? 1 : 1.5,
                      justifyContent: collapsed ? "center" : "flex-start",
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                        "&:hover": { bgcolor: "primary.dark" },
                      },
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon
                        sx={{
                          minWidth: collapsed ? "unset" : 36,
                          justifyContent: "center",
                          color: isActive ? "inherit" : "action.active",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    )}
                    {!collapsed && (
                      <>
                        <ListItemText
                          primary={item.label}
                          slotProps={{ primary: { variant: dense ? "body2" : "body1", noWrap: true } }}
                        />
                        {item.badge && <Box sx={{ ml: 0.5 }}>{item.badge}</Box>}
                        {hasChildren && (
                          isExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />
                        )}
                      </>
                    )}
                  </ListItemButton>
                );

                return (
                  <React.Fragment key={item.key}>
                    {item.dividerAbove && <Divider sx={{ my: 0.5 }} />}
                    <ListItem disablePadding sx={{ display: "block" }}>
                      {collapsed && item.icon ? (
                        <Tooltip title={item.label} placement={anchor === "left" ? "right" : "left"}>
                          {mainButton}
                        </Tooltip>
                      ) : (
                        mainButton
                      )}
                    </ListItem>

                    {hasChildren && !collapsed && (
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List dense={dense} disablePadding sx={{ pl: 2 }}>
                          {item.children!.map((child) => (
                            <ListItem key={child.key} disablePadding>
                              <ListItemButton
                                disabled={child.disabled}
                                selected={activeKey === child.key}
                                onClick={() => {
                                  child.onClick?.();
                                  onSelect?.(child.key);
                                }}
                                sx={{
                                  borderRadius: 1,
                                  mx: 0.5,
                                  px: 1.5,
                                  "&.Mui-selected": {
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                                    "&:hover": { bgcolor: "primary.dark" },
                                  },
                                }}
                              >
                                {child.icon && (
                                  <ListItemIcon sx={{ minWidth: 32 }}>{child.icon}</ListItemIcon>
                                )}
                                <ListItemText
                                  primary={child.label}
                                  slotProps={{ primary: { variant: "body2", noWrap: true } }}
                                />
                                {child.badge && <Box sx={{ ml: 0.5 }}>{child.badge}</Box>}
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </React.Fragment>
        ))}
      </Box>

      {/* Footer */}
      {footer && !collapsed && (
        <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: 1.5 }}>
          {footer}
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      anchor={anchor}
      open={variant === "permanent" ? true : open}
      onClose={onClose}
      sx={{
        width: resolvedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: resolvedWidth,
          transition: "width 0.2s ease",
          overflowX: "hidden",
          boxSizing: "border-box",
        },
        ...(sx as object),
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default VrmaSidebar;
