import React from "react";
import { Box, Chip, Typography, Avatar } from "@mui/material";
import type { ChipProps } from "@mui/material";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VrmaAdvancedChipItem {
  id: string | number;
  label: string;
  color?: ChipProps["color"];
  icon?: React.ReactNode;
  avatar?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface VrmaAdvancedChipProps<T extends VrmaAdvancedChipItem = VrmaAdvancedChipItem> {
  items: T[];
  /** Full custom chip renderer — receives the item and optional onDelete handler */
  template?: (item: T, onDelete?: () => void) => React.ReactNode;
  /** Custom label content inside the chip (icon + text etc.) */
  labelTemplate?: (item: T) => React.ReactNode;
  /** Global color applied to all chips unless overridden per item */
  color?: ChipProps["color"];
  size?: ChipProps["size"];
  variant?: ChipProps["variant"];
  /** Called when a chip's delete icon is clicked */
  onDelete?: (item: T) => void;
  /** Called when a chip is clicked */
  onClick?: (item: T) => void;
  /** Gap between chips (MUI spacing unit) */
  gap?: number;
  /** Wrap chips to the next line */
  wrap?: boolean;
  /** Show at most N chips; display "+M more" for the rest */
  maxItems?: number;
  /** sx forwarded to the wrapping Box */
  sx?: object;
}

// ─── Component ────────────────────────────────────────────────────────────────

function VrmaAdvancedChipInner<T extends VrmaAdvancedChipItem>(
  {
    items,
    template,
    labelTemplate,
    color = "default",
    size = "medium",
    variant = "filled",
    onDelete,
    onClick,
    gap = 1,
    wrap = true,
    maxItems,
    sx = {},
  }: VrmaAdvancedChipProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const shown = maxItems != null && maxItems < items.length ? items.slice(0, maxItems) : items;
  const overflow = maxItems != null ? Math.max(0, items.length - shown.length) : 0;

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexWrap: wrap ? "wrap" : "nowrap",
        gap,
        alignItems: "center",
        ...sx,
      }}
    >
      {shown.map((item) => {
        const handleDelete = onDelete ? () => onDelete(item) : undefined;
        const handleClick = onClick ? () => onClick(item) : undefined;

        // Full custom template — caller is responsible for the entire chip UI
        if (template) {
          return (
            <React.Fragment key={item.id}>
              {template(item, handleDelete)}
            </React.Fragment>
          );
        }

        // Resolved avatar / icon
        const resolvedAvatar =
          item.avatar != null ? (
            <Avatar src={item.avatar} sx={{ width: 20, height: 20 }} />
          ) : item.icon != null ? (
            <Avatar sx={{ bgcolor: "transparent", width: 20, height: 20 }}>
              {item.icon}
            </Avatar>
          ) : undefined;

        // Custom label template — controls the content inside the chip
        const resolvedLabel = labelTemplate ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {labelTemplate(item)}
          </Box>
        ) : (
          item.label
        );

        return (
          <Chip
            key={item.id}
            label={resolvedLabel}
            avatar={resolvedAvatar}
            color={item.color ?? color}
            size={size}
            variant={variant}
            disabled={item.disabled}
            onDelete={handleDelete}
            onClick={handleClick}
            clickable={!!onClick}
            sx={{ maxWidth: 280, "& .MuiChip-label": { overflow: "visible" } }}
          />
        );
      })}

      {overflow > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
          +{overflow} more
        </Typography>
      )}
    </Box>
  );
}

const VrmaAdvancedChip = React.forwardRef(VrmaAdvancedChipInner) as <
  T extends VrmaAdvancedChipItem = VrmaAdvancedChipItem,
>(
  props: VrmaAdvancedChipProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export default VrmaAdvancedChip;
