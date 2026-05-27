import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface ApexSiderWindowProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  width?: number | string;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
  elevation?: number;
  headerSx?: object;
  contentSx?: object;
  footerSx?: object;
}

const ApexSiderWindow: React.FC<ApexSiderWindowProps> = ({
  open,
  onClose,
  side = "right",
  width = 400,
  title,
  footer,
  children,
  showCloseButton = true,
  disableBackdropClick = false,
  elevation = 8,
  headerSx = {},
  contentSx = {},
  footerSx = {},
}) => {
  const handleBackdropClick = () => {
    if (!disableBackdropClick) onClose();
  };

  return (
    <Drawer
      anchor={side}
      open={open}
      onClose={handleBackdropClick}
      elevation={elevation}
      PaperProps={{
        sx: {
          width,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
              minHeight: 56,
              flexShrink: 0,
              ...headerSx,
            }}
          >
            {title ? (
              typeof title === "string" ? (
                <Typography variant="subtitle1" fontWeight={700}>
                  {title}
                </Typography>
              ) : (
                title
              )
            ) : (
              <Box />
            )}
            {showCloseButton && (
              <IconButton size="small" onClick={onClose} edge="end" aria-label="close">
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Divider />
        </>
      )}

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          ...contentSx,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      {footer && (
        <>
          <Divider />
          <Box
            sx={{
              px: 3,
              py: 2,
              flexShrink: 0,
              ...footerSx,
            }}
          >
            {footer}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default ApexSiderWindow;
