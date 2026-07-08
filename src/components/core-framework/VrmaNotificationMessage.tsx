import React from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

type Severity = "success" | "error" | "info" | "warning";

interface VrmaNotificationMessageProps {
  open: boolean;
  onClose: () => void;
  /** Alert severity — controls colour and icon */
  severity?: Severity;
  /** Optional bold title above the message */
  title?: string;
  /** Simple text message */
  message?: string;
  /** Custom body (replaces message when provided) */
  bodyTemplate?: React.ReactNode;
  /** Auto-dismiss after this many ms (0 = never) */
  autoHideDuration?: number;
  /** Screen anchor position */
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

const VrmaNotificationMessage: React.FC<VrmaNotificationMessageProps> = ({
  open,
  onClose,
  severity = "info",
  title,
  message,
  bodyTemplate,
  autoHideDuration = 4000,
  position = { vertical: "top", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration || undefined}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", alignItems: "flex-start" }}
      >
        {title && <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>}
        {bodyTemplate ?? message}
      </Alert>
    </Snackbar>
  );
};

export default VrmaNotificationMessage;
