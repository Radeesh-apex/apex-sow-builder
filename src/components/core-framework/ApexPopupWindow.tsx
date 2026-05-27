import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ApexPopupWindowProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  body?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  /** Dialog vertical position on screen */
  position?: "center" | "top" | "bottom";
  /** Show close × icon in title bar */
  showCloseIcon?: boolean;
}

const ApexPopupWindow: React.FC<ApexPopupWindowProps> = ({
  open,
  onClose,
  title,
  body,
  actions,
  maxWidth = "sm",
  fullWidth = true,
  position = "center",
  showCloseIcon = true,
}) => {
  const containerAlign =
    position === "top" ? "flex-start" : position === "bottom" ? "flex-end" : "center";
  const paperMargin =
    position === "top" ? "48px auto 0" : position === "bottom" ? "0 auto 48px" : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        "& .MuiDialog-container": { alignItems: containerAlign },
        "& .MuiDialog-paper": {
          ...(paperMargin && { margin: paperMargin }),
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}
    >
      {(title || showCloseIcon) && (
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: showCloseIcon ? 1 : 3,
            color: "text.primary",
          }}
        >
          <Typography variant="h6" fontWeight={600} component="span" color="inherit">
            {title}
          </Typography>
          {showCloseIcon && (
            <IconButton size="small" onClick={onClose} aria-label="close">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent dividers={Boolean(title)}>
        {body}
      </DialogContent>

      {actions && <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
};

export default ApexPopupWindow;
