import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import type { SxProps } from "@mui/system";

interface VrmaAdvancedButtonProps {
  label: string;
  onClick: () => Promise<void> | void;
  startIcon?: React.ReactNode;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "inherit" | "error" | "warning" | "info" | "success";
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
  fullWidth?: boolean;
  loadingText?: string;
  loadingTemplate?: React.ReactNode;
  /** Adds a pulsing glow animation when idle (not loading, not disabled) */
  pulse?: boolean;
  /** Duration of one pulse cycle in ms */
  pulseDuration?: number;
  sx?: SxProps;
}

const VrmaAdvancedButton: React.FC<VrmaAdvancedButtonProps> = ({
  label,
  onClick,
  startIcon,
  size = "medium",
  color = "primary",
  variant = "contained",
  disabled = false,
  fullWidth = false,
  loadingText = "Loading...",
  loadingTemplate,
  pulse = false,
  pulseDuration = 1500,
  sx,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={handleClick}
      startIcon={!loading && startIcon ? startIcon : undefined}
      sx={{
        position: "relative",
        ...(pulse && !loading && !disabled && {
          animation: `VrmaPulse ${pulseDuration}ms ease-in-out infinite`,
          "@keyframes VrmaPulse": {
            "0%":   { boxShadow: "0 0 0 0 rgba(25,118,210,0.5)" },
            "70%":  { boxShadow: "0 0 0 10px rgba(25,118,210,0)" },
            "100%": { boxShadow: "0 0 0 0 rgba(25,118,210,0)" },
          },
        }),
        ...sx,
      }}
    >
      {loading ? (
        loadingTemplate ?? (
          <>
            <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
            {loadingText}
          </>
        )
      ) : (
        label
      )}
    </Button>
  );
};

export default VrmaAdvancedButton;
