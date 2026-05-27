import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ApexConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  body?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  position?: "center" | "top" | "bottom";
}

const ApexConfirmationDialog: React.FC<ApexConfirmationDialogProps> = ({
  open,
  onClose,
  title = "Confirm Action",
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  maxWidth = "sm",
  fullWidth = true,
  position = "center",
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
      {title && (
        <DialogTitle sx={{ color: "text.primary" }}>
          {title}
        </DialogTitle>
      )}

      <DialogContent>
        {body ?? "Are you sure you want to proceed?"}
      </DialogContent>

      <DialogActions>
        {cancelLabel && (
          <Button onClick={onCancel ?? onClose} color="inherit">
            {cancelLabel}
          </Button>
        )}
        {confirmLabel && (
          <Button onClick={onConfirm ?? onClose} variant="contained" color="primary">
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ApexConfirmationDialog;
