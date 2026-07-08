import React, { useRef, useEffect } from "react";
import { Box, Typography, Chip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import VrmaCard from "./VrmaCard";
import VrmaAdvancedCard from "./VrmaAdvancedCard";

export type FlashDirection = "left" | "right" | "up" | "down";
export type FlashTemplate =
  | "default"
  | "news"
  | "badge"
  | "alert"
  | "image"
  | "multiline"
  | "card";

export interface FlashItem {
  key: string;
  /** Arbitrary ReactNode — used by "default" template when no renderItem is set */
  content?: React.ReactNode;
  /** Primary label text used by named templates */
  label?: string;
  /** Secondary/subtitle text (multiline, image, card templates) */
  subtitle?: string;
  /** Body description text (card template) */
  description?: string;
  /** Image URL (image and card templates) */
  image?: string;
  /** Secondary value / badge text (badge template) */
  value?: string;
  /** Accent color for this item (MUI token or hex) */
  color?: string;
  /** Icon node (news / alert templates) */
  icon?: React.ReactNode;
  /** Per-item click callback */
  onClick?: () => void;
}

export interface VrmaFlashMessageProps {
  items: FlashItem[];
  direction?: FlashDirection;
  /** Pixels per second */
  speed?: number;
  /** Separator rendered between items (horizontal only) */
  separator?: React.ReactNode;
  /** Gap between items in px */
  gap?: number;
  /** Height of the ticker container */
  height?: number | string;
  /** Pause on mouse hover */
  pauseOnHover?: boolean;
  /** Background color (MUI token or CSS) */
  bgcolor?: string;
  /** Default text color */
  color?: string;
  fontSize?: number | string;
  fontWeight?: React.CSSProperties["fontWeight"];
  borderRadius?: number | string;
  /** Built-in named template applied to all items */
  template?: FlashTemplate;
  /**
   * Fully custom render function. Overrides both `template` and `item.content`.
   * Receives the item and its index within the original array.
   */
  renderItem?: (item: FlashItem, index: number) => React.ReactNode;
  /**
   * Fixed node pinned at the leading edge (left for horizontal, top for vertical).
   * Useful for "LIVE", "BREAKING:", icons, etc.
   */
  prefix?: React.ReactNode;
  /** SxProps applied to every item's wrapper element */
  itemSx?: SxProps<Theme>;
  /** Fixed card width in px used by the "card" template (default 200) */
  cardWidth?: number;
  /** Global click handler — called for every item click (in addition to item.onClick) */
  onItemClick?: (item: FlashItem) => void;
  sx?: SxProps<Theme>;
}

// ─── Built-in templates ──────────────────────────────────────────────────────

function TemplateDefault({
  item, color, fontSize, fontWeight,
}: Pick<VrmaFlashMessageProps, "color" | "fontSize" | "fontWeight"> & { item: FlashItem }) {
  const text = item.content ?? item.label;
  if (text === undefined) return null;
  if (typeof text === "string") {
    return (
      <Typography
        component="span"
        sx={{
          fontSize: fontSize ?? "inherit",
          fontWeight: fontWeight ?? "inherit",
          color: item.color ?? color ?? "inherit",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    );
  }
  return <>{text}</>;
}

function TemplateNews({
  item, color, fontSize, fontWeight,
}: Pick<VrmaFlashMessageProps, "color" | "fontSize" | "fontWeight"> & { item: FlashItem }) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
      {item.icon && (
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", color: item.color ?? "inherit" }}>
          {item.icon}
        </Box>
      )}
      <Typography component="span" sx={{ fontSize: fontSize ?? "inherit", fontWeight: fontWeight ?? 600, color: item.color ?? color ?? "inherit", whiteSpace: "nowrap" }}>
        {item.label ?? (typeof item.content === "string" ? item.content : "")}
      </Typography>
      {item.value && (
        <Typography component="span" sx={{ fontSize: fontSize ?? "inherit", fontWeight: fontWeight ?? 400, color: item.color ?? color ?? "text.secondary", whiteSpace: "nowrap", opacity: 0.8 }}>
          — {item.value}
        </Typography>
      )}
    </Box>
  );
}

function TemplateBadge({
  item, color, fontSize, fontWeight,
}: Pick<VrmaFlashMessageProps, "color" | "fontSize" | "fontWeight"> & { item: FlashItem }) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      {item.value && (
        <Chip label={item.value} size="small" sx={{ height: 18, fontSize: 10, fontWeight: 700, bgcolor: item.color ?? "primary.main", color: "#fff", "& .MuiChip-label": { px: 0.75 } }} />
      )}
      <Typography component="span" sx={{ fontSize: fontSize ?? "inherit", fontWeight: fontWeight ?? "inherit", color: color ?? "inherit", whiteSpace: "nowrap" }}>
        {item.label ?? (typeof item.content === "string" ? item.content : "")}
      </Typography>
    </Box>
  );
}

function TemplateAlert({
  item, color, fontSize, fontWeight,
}: Pick<VrmaFlashMessageProps, "color" | "fontSize" | "fontWeight"> & { item: FlashItem }) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <Box component="span" sx={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", bgcolor: item.color ?? "warning.main", flexShrink: 0 }} />
      {item.icon && (
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", color: item.color ?? "warning.main" }}>
          {item.icon}
        </Box>
      )}
      <Typography component="span" sx={{ fontSize: fontSize ?? "inherit", fontWeight: fontWeight ?? "inherit", color: color ?? "inherit", whiteSpace: "nowrap" }}>
        {item.label ?? (typeof item.content === "string" ? item.content : "")}
      </Typography>
    </Box>
  );
}

/** image template — thumbnail (left) + label + subtitle stacked */
function TemplateImage({
  item, color, fontSize, fontWeight,
}: Pick<VrmaFlashMessageProps, "color" | "fontSize" | "fontWeight"> & { item: FlashItem }) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
      {item.image && (
        <Box
          component="img"
          src={item.image}
          alt={item.label ?? ""}
          sx={{ width: 36, height: 36, borderRadius: 1, objectFit: "cover", flexShrink: 0 }}
        />
      )}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography component="span" sx={{ fontSize: fontSize ?? "0.85rem", fontWeight: fontWeight ?? 600, color: item.color ?? color ?? "inherit", lineHeight: 1.3, whiteSpace: "nowrap" }}>
          {item.label ?? (typeof item.content === "string" ? item.content : "")}
        </Typography>
        {item.subtitle && (
          <Typography component="span" sx={{ fontSize: "0.7rem", color: "text.secondary", lineHeight: 1.2, whiteSpace: "nowrap", opacity: 0.85 }}>
            {item.subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/** multiline template — label (bold) + subtitle stacked vertically */
function TemplateMultiline({
  item, color, fontSize, fontWeight,
}: Pick<VrmaFlashMessageProps, "color" | "fontSize" | "fontWeight"> & { item: FlashItem }) {
  return (
    <Box sx={{ display: "inline-flex", flexDirection: "column", px: 0.25 }}>
      <Typography component="span" sx={{ fontSize: fontSize ?? "0.85rem", fontWeight: fontWeight ?? 600, color: item.color ?? color ?? "inherit", lineHeight: 1.35, whiteSpace: "nowrap" }}>
        {item.label ?? (typeof item.content === "string" ? item.content : "")}
      </Typography>
      {item.subtitle && (
        <Typography component="span" sx={{ fontSize: "0.72rem", color: "text.secondary", lineHeight: 1.25, whiteSpace: "nowrap", opacity: 0.85 }}>
          {item.subtitle}
        </Typography>
      )}
    </Box>
  );
}

/** card template — VrmaCard with optional image, title, subtitle, description */
function TemplateCard({
  item, color, fontSize, fontWeight, cardWidth,
}: Pick<VrmaFlashMessageProps, "color" | "fontSize" | "fontWeight" | "cardWidth"> & { item: FlashItem }) {
  const w = cardWidth ?? 200;
  return (
    <VrmaCard
      outlined
      centerContent={false}
      padding={1.5}
      borderRadius={8}
      sx={{ width: w, flexShrink: 0, display: "flex", flexDirection: "column", height: "auto" }}
      onClick={item.onClick}
    >
      {item.image && (
        <Box
          component="img"
          src={item.image}
          alt={item.label ?? ""}
          sx={{ width: "100%", height: 72, objectFit: "cover", borderRadius: 1, mb: 1, display: "block" }}
        />
      )}
      <Typography sx={{ fontSize: fontSize ?? "0.82rem", fontWeight: fontWeight ?? 700, color: item.color ?? color ?? "text.primary", lineHeight: 1.3, mb: item.subtitle || item.description ? 0.25 : 0 }}>
        {item.label ?? ""}
      </Typography>
      {item.subtitle && (
        <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", lineHeight: 1.2, mb: item.description ? 0.25 : 0 }}>
          {item.subtitle}
        </Typography>
      )}
      {item.description && (
        <Typography sx={{ fontSize: "0.7rem", color: "text.disabled", lineHeight: 1.3, mt: "auto" }}>
          {item.description}
        </Typography>
      )}
    </VrmaCard>
  );
}

/** advanced card template — VrmaAdvancedCard with header slot for image/icon */
function TemplateAdvancedCard({
  item, color, fontSize, fontWeight, cardWidth,
}: Pick<VrmaFlashMessageProps, "color" | "fontSize" | "fontWeight" | "cardWidth"> & { item: FlashItem }) {
  const w = cardWidth ?? 220;
  return (
    <VrmaAdvancedCard
      outlined
      centerContent={false}
      padding={1.25}
      borderRadius={8}
      sx={{ width: w, flexShrink: 0 }}
      header={
        item.image ? (
          <Box
            component="img"
            src={item.image}
            alt={item.label ?? ""}
            sx={{ width: "100%", height: 64, objectFit: "cover", borderRadius: "6px 6px 0 0", display: "block" }}
          />
        ) : item.icon ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ color: item.color ?? "primary.main" }}>{item.icon}</Box>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: item.color ?? color ?? "text.secondary", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {item.value ?? ""}
            </Typography>
          </Box>
        ) : undefined
      }
    >
      <Typography sx={{ fontSize: fontSize ?? "0.82rem", fontWeight: fontWeight ?? 700, color: item.color ?? color ?? "text.primary", lineHeight: 1.3, mb: item.subtitle ? 0.25 : 0 }}>
        {item.label ?? ""}
      </Typography>
      {item.subtitle && (
        <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", lineHeight: 1.2 }}>
          {item.subtitle}
        </Typography>
      )}
    </VrmaAdvancedCard>
  );
}

// ─── Renderer resolver ───────────────────────────────────────────────────────

function resolveItemNode(
  item: FlashItem,
  index: number,
  opts: {
    renderItem?: VrmaFlashMessageProps["renderItem"];
    template: FlashTemplate;
    color?: string;
    fontSize?: number | string;
    fontWeight?: React.CSSProperties["fontWeight"];
    cardWidth?: number;
  },
): React.ReactNode {
  if (opts.renderItem) return opts.renderItem(item, index);
  const p = { item, color: opts.color, fontSize: opts.fontSize, fontWeight: opts.fontWeight };
  switch (opts.template) {
    case "news":          return <TemplateNews          {...p} />;
    case "badge":         return <TemplateBadge         {...p} />;
    case "alert":         return <TemplateAlert         {...p} />;
    case "image":         return <TemplateImage         {...p} />;
    case "multiline":     return <TemplateMultiline     {...p} />;
    case "card":          return <TemplateCard          {...p} cardWidth={opts.cardWidth} />;
    case "advanced-card" as FlashTemplate:
                          return <TemplateAdvancedCard  {...p} cardWidth={opts.cardWidth} />;
    default:              return <TemplateDefault       {...p} />;
  }
}

// ─── Animation pause hook ────────────────────────────────────────────────────

function useAnimationPause(ref: React.RefObject<HTMLDivElement | null>, paused: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.animationPlayState = paused ? "paused" : "running";
  }, [ref, paused]);
}

// ─── Prefix wrapper ──────────────────────────────────────────────────────────

function PrefixNode({ node }: { node: React.ReactNode }) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", flexShrink: 0, px: 1, zIndex: 1 }}>
      {node}
    </Box>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const HORIZONTAL: FlashDirection[] = ["left", "right"];
const CARD_TEMPLATES: FlashTemplate[] = ["card"];

const VrmaFlashMessage: React.FC<VrmaFlashMessageProps> = ({
  items,
  direction = "left",
  speed = 60,
  separator,
  gap = 48,
  height = 40,
  pauseOnHover = true,
  bgcolor,
  color,
  fontSize,
  fontWeight,
  borderRadius = 0,
  template = "default",
  renderItem,
  prefix,
  itemSx,
  cardWidth,
  onItemClick,
  sx,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = React.useState(false);
  const isHorizontal = HORIZONTAL.includes(direction);
  const isCardTemplate = CARD_TEMPLATES.includes(template);

  useAnimationPause(trackRef, paused);

  const renderOpts = { renderItem, template, color, fontSize, fontWeight, cardWidth };

  const handleItemClick = (item: FlashItem) => {
    item.onClick?.();
    onItemClick?.(item);
  };

  if (items.length === 0) return null;

  // Card templates use no text separator — items have their own spacing via mx
  const defaultSep = isCardTemplate ? null : (
    <Box component="span" sx={{ display: "inline-block", mx: `${gap / 2}px`, color: "text.disabled", userSelect: "none" }}>
      •
    </Box>
  );
  const resolvedSep = separator !== undefined ? separator : defaultSep;

  if (isHorizontal) {
    const strip = (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: isCardTemplate ? "stretch" : "center",
          whiteSpace: "nowrap",
          gap: isCardTemplate ? `${gap / 2}px` : 0,
        }}
      >
        {items.map((item, i) => (
          <React.Fragment key={item.key}>
            <Box
              component="span"
              onClick={() => handleItemClick(item)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                cursor: (item.onClick || onItemClick) ? "pointer" : "default",
                ...(isCardTemplate && { mx: `${gap / 4}px`, my: "4px" }),
                ...(itemSx as object),
              }}
            >
              {resolveItemNode(item, i, renderOpts)}
            </Box>
            {!isCardTemplate && i < items.length - 1 && resolvedSep}
          </React.Fragment>
        ))}
        {!isCardTemplate && resolvedSep}
      </Box>
    );

    const animName = `vrma-flash-${direction}`;
    const keyframes = direction === "left"
      ? `@keyframes ${animName} { from { transform: translateX(0); } to { transform: translateX(-50%); } }`
      : `@keyframes ${animName} { from { transform: translateX(-50%); } to { transform: translateX(0); } }`;

    // Duration: for card templates base on card width, for text base on item count
    const baseDuration = isCardTemplate
      ? ((cardWidth ?? 200) + gap / 2) * items.length / speed
      : (items.length * 160) / speed;

    return (
      <Box
        sx={{
          overflow: "hidden",
          height,
          display: "flex",
          alignItems: "center",
          borderRadius,
          ...(bgcolor && { bgcolor }),
          ...(sx as object),
        }}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
      >
        <style>{keyframes}</style>
        {prefix && <PrefixNode node={prefix} />}
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
          <Box
            ref={trackRef}
            sx={{ display: "inline-flex", whiteSpace: "nowrap", animation: `${animName} linear infinite` }}
            style={{ animationDuration: `${baseDuration}s` }}
          >
            {strip}
            {strip}
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Vertical ───────────────────────────────────────────────────────────────
  const vStrip = (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {items.map((item, i) => (
        <Box
          key={item.key}
          onClick={() => handleItemClick(item)}
          sx={{
            display: "flex",
            alignItems: "center",
            height,
            px: 1,
            flexShrink: 0,
            cursor: (item.onClick || onItemClick) ? "pointer" : "default",
            ...(itemSx as object),
          }}
        >
          {resolveItemNode(item, i, renderOpts)}
        </Box>
      ))}
    </Box>
  );

  const vAnimName = `vrma-flash-${direction}`;
  const totalHeight = items.length * (typeof height === "number" ? height : 40);
  const vKeyframes = direction === "up"
    ? `@keyframes ${vAnimName} { from { transform: translateY(0); } to { transform: translateY(-50%); } }`
    : `@keyframes ${vAnimName} { from { transform: translateY(-50%); } to { transform: translateY(0); } }`;

  return (
    <Box
      sx={{ overflow: "hidden", height, borderRadius, ...(bgcolor && { bgcolor }), ...(sx as object) }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <style>{vKeyframes}</style>
      {prefix && (
        <Box sx={{ display: "flex", alignItems: "center", px: 1, flexShrink: 0 }}>
          {prefix}
        </Box>
      )}
      <Box
        ref={trackRef}
        sx={{ display: "flex", flexDirection: "column", animation: `${vAnimName} linear infinite` }}
        style={{ animationDuration: `${(totalHeight * 2) / speed}s` }}
      >
        {vStrip}
        {vStrip}
      </Box>
    </Box>
  );
};

export default VrmaFlashMessage;
