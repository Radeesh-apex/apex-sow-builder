import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import type {
  AppBarProps,
  ToolbarProps,
  TypographyProps,
  ButtonProps,
  IconButtonProps,
  BoxProps,
  SxProps,
  Theme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
}

type VrmaNavBarSize = "small" | "medium" | "large" | "dense";

interface VrmaNavBarProps {
  brand?: string;
  logo?: React.ReactNode;
  items?: NavItem[];
  position?: AppBarProps["position"];
  appBarProps?: Omit<AppBarProps, "position">;
  toolbarProps?: ToolbarProps;
  logoContainerProps?: BoxProps;
  navContainerProps?: BoxProps;
  brandTypographyProps?: TypographyProps;
  itemButtonProps?: ButtonProps;
  menuIconButtonProps?: Omit<IconButtonProps, "onClick">;
  bgColor?: string;
  textColor?: string;
  fontSize?: string | number;
  brandFontSize?: string | number;
  itemFontSize?: string | number;
  size?: VrmaNavBarSize;
  toolbarMinHeight?: number | string;
  toolbarPaddingY?: number | string;
  logoGap?: number | string;
  navGap?: number | string;
  showMenuIcon?: boolean;
  onMenuClick?: () => void;
  activeHref?: string;
  sx?: SxProps<Theme>;
}

const sizePresets: Record<VrmaNavBarSize, { toolbarMinHeight: number; toolbarPaddingY: number; navGap: number; brandFontSize: string; itemFontSize: string }> = {
  small: {
    toolbarMinHeight: 52,
    toolbarPaddingY: 0.5,
    navGap: 1,
    brandFontSize: "1rem",
    itemFontSize: "0.9rem",
  },
  medium: {
    toolbarMinHeight: 64,
    toolbarPaddingY: 1,
    navGap: 2,
    brandFontSize: "1.125rem",
    itemFontSize: "1rem",
  },
  large: {
    toolbarMinHeight: 72,
    toolbarPaddingY: 1.25,
    navGap: 2.5,
    brandFontSize: "1.25rem",
    itemFontSize: "1.1rem",
  },
  dense: {
    toolbarMinHeight: 48,
    toolbarPaddingY: 0.5,
    navGap: 1,
    brandFontSize: "1rem",
    itemFontSize: "0.85rem",
  },
};

const VrmaNavBar: React.FC<VrmaNavBarProps> = ({
  brand = "VrmaNavBar",
  logo,
  items = [],
  position = "static",
  appBarProps,
  toolbarProps,
  logoContainerProps,
  navContainerProps,
  brandTypographyProps,
  itemButtonProps,
  menuIconButtonProps,
  bgColor = "#1976d2",
  textColor = "#fff",
  fontSize,
  brandFontSize,
  itemFontSize,
  size = "medium",
  toolbarMinHeight,
  toolbarPaddingY,
  logoGap,
  navGap,
  showMenuIcon = false,
  onMenuClick,
  activeHref,
  sx,
}) => {
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );

  const {
    sx: appBarSx,
    ...restAppBarProps
  } = appBarProps || {};
  const {
    sx: toolbarSx,
    ...restToolbarProps
  } = toolbarProps || {};
  const {
    sx: logoContainerSx,
    ...restLogoContainerProps
  } = logoContainerProps || {};
  const {
    sx: navContainerSx,
    ...restNavContainerProps
  } = navContainerProps || {};
  const {
    sx: brandTypographySx,
    ...restBrandTypographyProps
  } = brandTypographyProps || {};
  const {
    sx: itemButtonSx,
    ...restItemButtonProps
  } = itemButtonProps || {};
  const {
    sx: menuIconButtonSx,
    ...restMenuIconButtonProps
  } = menuIconButtonProps || {};

  const preset = sizePresets[size];
  const resolvedBrandFontSize = brandFontSize ?? fontSize ?? preset.brandFontSize;
  const resolvedItemFontSize = itemFontSize ?? fontSize ?? preset.itemFontSize;
  const resolvedToolbarMinHeight = toolbarMinHeight ?? preset.toolbarMinHeight;
  const resolvedToolbarPaddingY = toolbarPaddingY ?? preset.toolbarPaddingY;
  const resolvedNavGap = navGap ?? preset.navGap;
  const resolvedLogoGap = logoGap ?? 1;

  return (
    <AppBar
      position={position}
      sx={{
        backgroundColor: bgColor,
        ...sx,
        ...(appBarSx as object),
      }}
      {...restAppBarProps}
    >
      <Toolbar
        sx={{
          minHeight: resolvedToolbarMinHeight,
          py: resolvedToolbarPaddingY,
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: isSmallScreen ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isSmallScreen ? 1 : 0,
          ...(toolbarSx as object),
        }}
        {...restToolbarProps}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: resolvedLogoGap, ...(logoContainerSx as object) }}
          {...restLogoContainerProps}
        >
          {logo}
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontSize: resolvedBrandFontSize,
              fontWeight: 600,
              ...(brandTypographySx as object),
            }}
            {...restBrandTypographyProps}
          >
            {brand}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: isSmallScreen ? "flex-start" : "center",
            gap: resolvedNavGap,
            width: isSmallScreen ? "100%" : "auto",
            ...(navContainerSx as object),
          }}
          {...restNavContainerProps}
        >
          {items.map((item, idx) => {
            const extraAnchorProps: Record<string, string> = {};
            if (item.target) extraAnchorProps.target = item.target;
            if (item.rel) extraAnchorProps.rel = item.rel;
            const isActive = activeHref !== undefined && item.href === activeHref;

            return (
              <Button
                key={idx}
                href={item.href}
                component={item.href ? "a" : undefined}
                onClick={item.onClick}
                startIcon={item.icon}
                sx={{
                  color: textColor,
                  fontSize: resolvedItemFontSize,
                  textTransform: "none",
                  fontWeight: isActive ? 700 : 500,
                  opacity: isActive ? 1 : 0.85,
                  borderBottom: isActive ? `2px solid ${textColor}` : "2px solid transparent",
                  borderRadius: 0,
                  justifyContent: isSmallScreen ? "flex-start" : "center",
                  width: isSmallScreen ? "100%" : "auto",
                  ...(itemButtonSx as object),
                }}
                {...extraAnchorProps}
                {...restItemButtonProps}
              >
                {item.label}
              </Button>
            );
          })}

          {showMenuIcon && (
            <IconButton
              edge="end"
              aria-label="menu"
              onClick={onMenuClick}
              sx={{ color: textColor, ...(menuIconButtonSx as object) }}
              {...restMenuIconButtonProps}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default VrmaNavBar;
