import React from "react";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";

type LoadingVariant = "circular" | "linear" | "dots";
type LoadingColor = "primary" | "secondary" | "error" | "info" | "success" | "warning" | "inherit";
type LoadingPosition = "screen" | "container";

export interface VrmaLoadingProps {
  /** Controls visibility */
  open: boolean;
  /** Text shown below the indicator */
  message?: string;
  /** Indicator style */
  variant?: LoadingVariant;
  /** MUI color token */
  color?: LoadingColor;
  /** Size for circular variant (px) */
  size?: number;
  /** Show a semi-transparent backdrop */
  backdrop?: boolean;
  /** Opacity of the backdrop (0–1) */
  backdropOpacity?: number;
  /** Replace the default indicator entirely with custom content */
  children?: React.ReactNode;
  /** "screen" = fixed overlay, "container" = absolute within nearest positioned ancestor */
  position?: LoadingPosition;
  /** Background colour of the loading box */
  bgcolor?: string;
  /** Font size of the message */
  messageFontSize?: string | number;
  /** z-index override */
  zIndex?: number;
}

const DotsIndicator: React.FC<{ color: LoadingColor; size: number }> = ({ color, size }) => {
  const theme = useTheme();
  const dotColor =
    color === "inherit" ? "currentColor" : (theme.palette[color as keyof typeof theme.palette] as { main?: string })?.main ?? theme.palette.primary.main;

  return (
    <Box sx={{ display: "flex", gap: `${size * 0.4}px`, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            bgcolor: dotColor,
            animation: "apex-dot-bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
            "@keyframes apex-dot-bounce": {
              "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.4 },
              "40%": { transform: "scale(1)", opacity: 1 },
            },
          }}
        />
      ))}
    </Box>
  );
};

const VrmaLoading: React.FC<VrmaLoadingProps> = ({
  open,
  message,
  variant = "circular",
  color = "primary",
  size = 48,
  backdrop = true,
  backdropOpacity = 0.5,
  children,
  position = "screen",
  bgcolor,
  messageFontSize = "0.875rem",
  zIndex,
}) => {
  if (!open) return null;

  const resolvedZIndex = zIndex ?? (position === "screen" ? 1400 : 10);
  const positionSx =
    position === "screen"
      ? { position: "fixed" as const, inset: 0 }
      : { position: "absolute" as const, inset: 0 };

  const indicator = children ?? (
    variant === "circular" ? (
      <CircularProgress color={color} size={size} thickness={4} />
    ) : variant === "linear" ? (
      <LinearProgress color={color} sx={{ width: 200, borderRadius: 2 }} />
    ) : (
      <DotsIndicator color={color} size={Math.round(size * 0.25)} />
    )
  );

  return (
    <>
      {backdrop && (
        <Box
          sx={{
            ...positionSx,
            bgcolor: `rgba(0,0,0,${backdropOpacity})`,
            zIndex: resolvedZIndex,
          }}
        />
      )}
      <Box
        sx={{
          ...positionSx,
          zIndex: resolvedZIndex + 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            px: 4,
            py: 3,
            borderRadius: 2,
            bgcolor: bgcolor ?? "background.paper",
            boxShadow: 6,
            pointerEvents: "auto",
            minWidth: 120,
          }}
        >
          {indicator}
          {message && (
            <Typography
              variant="body2"
              sx={{ fontSize: messageFontSize, color: "text.secondary", textAlign: "center" }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default VrmaLoading;
