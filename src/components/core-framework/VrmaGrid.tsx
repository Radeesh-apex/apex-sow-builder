import React from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme, Breakpoint } from "@mui/material";

type Spacing = number | string;
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export interface VrmaGridProps {
  children?: React.ReactNode;
  /**
   * Number of columns or a CSS grid-template-columns value.
   * Also accepts responsive object: { xs: 1, sm: 2, md: 4 }
   */
  cols?: ResponsiveValue<number | string>;
  /** Uniform gap between cells */
  gap?: Spacing;
  rowGap?: Spacing;
  colGap?: Spacing;
  /** Align all cells along the block axis */
  alignItems?: React.CSSProperties["alignItems"];
  /** Justify all cells along the inline axis */
  justifyItems?: React.CSSProperties["justifyItems"];
  /** Stretch grid to full width (default true) */
  fullWidth?: boolean;
  /** min/max for auto-fit columns, e.g. "200px" */
  minColWidth?: string;
  /** auto-fill instead of auto-fit */
  autoFill?: boolean;
  p?: Spacing;
  px?: Spacing;
  py?: Spacing;
  sx?: SxProps<Theme>;
  component?: React.ElementType;
  className?: string;
}

function buildTemplateColumns(
  cols: ResponsiveValue<number | string> | undefined,
  minColWidth: string | undefined,
  autoFill: boolean
): SxProps<Theme> {
  if (minColWidth) {
    const fn = autoFill ? "auto-fill" : "auto-fit";
    return { gridTemplateColumns: `repeat(${fn}, minmax(${minColWidth}, 1fr))` };
  }

  if (cols === undefined) return {};

  if (typeof cols === "number") {
    return { gridTemplateColumns: `repeat(${cols}, 1fr)` };
  }

  if (typeof cols === "string") {
    return { gridTemplateColumns: cols };
  }

  // Responsive object
  const result: Record<string, string> = {};
  const breakpoints = ["xs", "sm", "md", "lg", "xl"] as const;
  for (const bp of breakpoints) {
    const val = (cols as Partial<Record<Breakpoint, number | string>>)[bp];
    if (val === undefined) continue;
    result[bp] = typeof val === "number" ? `repeat(${val}, 1fr)` : val;
  }
  // Build MUI sx responsive syntax
  const responsiveSx: SxProps<Theme> = {};
  for (const bp of breakpoints) {
    const val = (cols as Partial<Record<Breakpoint, number | string>>)[bp];
    if (val === undefined) continue;
    const templateValue = typeof val === "number" ? `repeat(${val}, 1fr)` : val;
    // @ts-expect-error MUI responsive sx
    responsiveSx[`gridTemplateColumns`] = responsiveSx[`gridTemplateColumns`] ?? {};
    // @ts-expect-error MUI responsive sx
    (responsiveSx[`gridTemplateColumns`] as Record<string, string>)[bp] = templateValue;
  }
  return responsiveSx;
}

const VrmaGrid: React.FC<VrmaGridProps> = ({
  children,
  cols,
  gap,
  rowGap,
  colGap,
  alignItems,
  justifyItems,
  fullWidth = true,
  minColWidth,
  autoFill = false,
  p,
  px,
  py,
  sx,
  component,
  className,
}) => {
  const templateSx = buildTemplateColumns(cols, minColWidth, autoFill);

  const componentProp = component ? { component } : {};

  return (
    <Box
      {...componentProp}
      className={className}
      sx={{
        display: "grid",
        ...templateSx,
        ...(gap !== undefined && { gap }),
        ...(rowGap !== undefined && { rowGap }),
        ...(colGap !== undefined && { columnGap: colGap }),
        ...(alignItems && { alignItems }),
        ...(justifyItems && { justifyItems }),
        ...(fullWidth && { width: "100%" }),
        ...(p !== undefined && { p }),
        ...(px !== undefined && { px }),
        ...(py !== undefined && { py }),
        ...(sx as object),
      }}
    >
      {children}
    </Box>
  );
};

export default VrmaGrid;
