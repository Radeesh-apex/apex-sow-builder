import React from "react";
import {
  Tabs,
  Tab,
  Box,
  Divider,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export interface VrmaTabItem {
  /** Unique key */
  key: string;
  label: React.ReactNode;
  /** Content rendered when this tab is active */
  content: React.ReactNode;
  icon?: React.ReactElement;
  /** Position of icon relative to label */
  iconPosition?: "start" | "end" | "top" | "bottom";
  disabled?: boolean;
}

export interface VrmaTabProps {
  items: VrmaTabItem[];
  /** Controlled active tab key */
  value?: string;
  /** Default active key for uncontrolled mode */
  defaultValue?: string;
  onChange?: (key: string) => void;
  /** "standard" = no indicator line; "scrollable" = scroll on overflow */
  variant?: "standard" | "scrollable" | "fullWidth";
  orientation?: "horizontal" | "vertical";
  textColor?: "primary" | "secondary" | "inherit";
  indicatorColor?: "primary" | "secondary";
  /** Show divider between tabs and content */
  divider?: boolean;
  /** Padding inside each tab panel */
  panelPx?: number | string;
  panelPy?: number | string;
  /** Keep all tab panels mounted (avoids remount on switch) */
  keepMounted?: boolean;
  scrollButtons?: "auto" | true | false;
  centered?: boolean;
  sx?: SxProps<Theme>;
  tabsSx?: SxProps<Theme>;
  panelSx?: SxProps<Theme>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  activeKey: string;
  itemKey: string;
  keepMounted: boolean;
  px: number | string;
  py: number | string;
  sx?: SxProps<Theme>;
}

function TabPanel({ children, activeKey, itemKey, keepMounted, px, py, sx }: TabPanelProps) {
  const isActive = activeKey === itemKey;
  if (!keepMounted && !isActive) return null;
  return (
    <Box
      role="tabpanel"
      hidden={!isActive}
      id={`vrma-tabpanel-${itemKey}`}
      aria-labelledby={`vrma-tab-${itemKey}`}
      sx={{ px, py, ...(sx as object) }}
    >
      {children}
    </Box>
  );
}

const VrmaTab: React.FC<VrmaTabProps> = ({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  variant = "standard",
  orientation = "horizontal",
  textColor = "primary",
  indicatorColor = "primary",
  divider = true,
  panelPx = 0,
  panelPy = 2,
  keepMounted = false,
  scrollButtons = "auto",
  centered = false,
  sx,
  tabsSx,
  panelSx,
}) => {
  const firstKey = items[0]?.key ?? "";
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? firstKey);
  const isControlled = valueProp !== undefined;
  const activeKey = isControlled ? valueProp! : internalValue;

  function handleChange(_: React.SyntheticEvent, newKey: string) {
    if (!isControlled) setInternalValue(newKey);
    onChange?.(newKey);
  }

  const isVertical = orientation === "vertical";

  return (
    <Box
      sx={{
        display: isVertical ? "flex" : "block",
        width: "100%",
        ...(sx as object),
      }}
    >
      <Tabs
        value={activeKey}
        onChange={handleChange}
        variant={variant}
        orientation={orientation}
        textColor={textColor}
        indicatorColor={indicatorColor}
        scrollButtons={scrollButtons}
        centered={!isVertical && centered}
        aria-label="vrma tabs"
        sx={{
          ...(isVertical && {
            borderRight: 1,
            borderColor: "divider",
            minWidth: 160,
            flexShrink: 0,
          }),
          ...(tabsSx as object),
        }}
      >
        {items.map((item) => (
          <Tab
            key={item.key}
            value={item.key}
            label={item.label}
            icon={item.icon}
            iconPosition={item.iconPosition ?? "start"}
            disabled={item.disabled}
            id={`vrma-tab-${item.key}`}
            aria-controls={`vrma-tabpanel-${item.key}`}
          />
        ))}
      </Tabs>

      {divider && !isVertical && <Divider />}

      <Box sx={{ flex: 1 }}>
        {items.map((item) => (
          <TabPanel
            key={item.key}
            itemKey={item.key}
            activeKey={activeKey}
            keepMounted={keepMounted}
            px={panelPx}
            py={panelPy}
            sx={panelSx}
          >
            {item.content}
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default VrmaTab;
