import React from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

type Spacing = number | string;

export interface VrmaBoxProps {
  children?: React.ReactNode;
  /** Shorthand: display="flex" direction="row" */
  flex?: boolean;
  /** Shorthand: display="grid" */
  grid?: boolean;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  gap?: Spacing;
  rowGap?: Spacing;
  colGap?: Spacing;
  /** CSS grid-template-columns */
  cols?: string;
  /** CSS grid-template-rows */
  rows?: string;
  /** Uniform padding */
  p?: Spacing;
  px?: Spacing;
  py?: Spacing;
  pt?: Spacing;
  pb?: Spacing;
  pl?: Spacing;
  pr?: Spacing;
  /** Uniform margin */
  m?: Spacing;
  mx?: Spacing;
  my?: Spacing;
  mt?: Spacing;
  mb?: Spacing;
  ml?: Spacing;
  mr?: Spacing;
  width?: Spacing;
  height?: Spacing;
  minWidth?: Spacing;
  maxWidth?: Spacing;
  minHeight?: Spacing;
  maxHeight?: Spacing;
  fullWidth?: boolean;
  fullHeight?: boolean;
  /** Fill remaining flex space */
  grow?: boolean;
  /** border="1px solid divider" shorthand */
  border?: boolean | string;
  borderRadius?: Spacing;
  /** Clip overflow */
  clip?: boolean;
  overflow?: React.CSSProperties["overflow"];
  position?: React.CSSProperties["position"];
  top?: Spacing;
  left?: Spacing;
  right?: Spacing;
  bottom?: Spacing;
  zIndex?: number;
  /** MUI paper-like background */
  paper?: boolean;
  /** Background color token or CSS value */
  bg?: string;
  color?: string;
  textAlign?: React.CSSProperties["textAlign"];
  relative?: boolean;
  absolute?: boolean;
  center?: boolean;
  component?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  sx?: SxProps<Theme>;
  className?: string;
  style?: React.CSSProperties;
}

const VrmaBox: React.FC<VrmaBoxProps> = ({
  children,
  flex,
  grid,
  direction,
  wrap,
  align,
  justify,
  gap,
  rowGap,
  colGap,
  cols,
  rows,
  p, px, py, pt, pb, pl, pr,
  m, mx, my, mt, mb, ml, mr,
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  fullWidth,
  fullHeight,
  grow,
  border,
  borderRadius,
  clip,
  overflow,
  position,
  top, left, right, bottom,
  zIndex,
  paper,
  bg,
  color,
  textAlign,
  relative,
  absolute,
  center,
  component,
  onClick,
  sx,
  className,
  style,
}) => {
  const resolvedDisplay =
    flex ? "flex" : grid ? "grid" : undefined;

  const resolvedPosition =
    position ?? (relative ? "relative" : absolute ? "absolute" : undefined);

  const centerSx: SxProps<Theme> = center
    ? { display: "flex", alignItems: "center", justifyContent: "center" }
    : {};

  const componentProp = component ? { component } : {};

  return (
    <Box
      {...componentProp}
      onClick={onClick}
      className={className}
      style={style}
      sx={{
        ...(resolvedDisplay && { display: resolvedDisplay }),
        ...(direction && { flexDirection: direction }),
        ...(wrap && { flexWrap: wrap }),
        ...(align && { alignItems: align }),
        ...(justify && { justifyContent: justify }),
        ...(gap !== undefined && { gap }),
        ...(rowGap !== undefined && { rowGap }),
        ...(colGap !== undefined && { columnGap: colGap }),
        ...(cols && { gridTemplateColumns: cols }),
        ...(rows && { gridTemplateRows: rows }),
        ...(p !== undefined && { p }),
        ...(px !== undefined && { px }),
        ...(py !== undefined && { py }),
        ...(pt !== undefined && { pt }),
        ...(pb !== undefined && { pb }),
        ...(pl !== undefined && { pl }),
        ...(pr !== undefined && { pr }),
        ...(m !== undefined && { m }),
        ...(mx !== undefined && { mx }),
        ...(my !== undefined && { my }),
        ...(mt !== undefined && { mt }),
        ...(mb !== undefined && { mb }),
        ...(ml !== undefined && { ml }),
        ...(mr !== undefined && { mr }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(minWidth !== undefined && { minWidth }),
        ...(maxWidth !== undefined && { maxWidth }),
        ...(minHeight !== undefined && { minHeight }),
        ...(maxHeight !== undefined && { maxHeight }),
        ...(fullWidth && { width: "100%" }),
        ...(fullHeight && { height: "100%" }),
        ...(grow && { flex: 1 }),
        ...(border === true && { border: "1px solid", borderColor: "divider" }),
        ...(typeof border === "string" && { border }),
        ...(borderRadius !== undefined && { borderRadius }),
        ...(clip && { overflow: "hidden" }),
        ...(overflow && { overflow }),
        ...(resolvedPosition && { position: resolvedPosition }),
        ...(top !== undefined && { top }),
        ...(left !== undefined && { left }),
        ...(right !== undefined && { right }),
        ...(bottom !== undefined && { bottom }),
        ...(zIndex !== undefined && { zIndex }),
        ...(paper && { bgcolor: "background.paper" }),
        ...(bg && { bgcolor: bg }),
        ...(color && { color }),
        ...(textAlign && { textAlign }),
        ...centerSx,
        ...(sx as object),
      }}
    >
      {children}
    </Box>
  );
};

export default VrmaBox;
