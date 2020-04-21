import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import React from "react";

export const FlashContext = React.createContext({
  alert: null,
  setAlert: () => {},
});

export default function FlashSnackbar() {
  const location = useLocation();
  const { alert, setAlert } = React.useContext(FlashContext);
  const handleClose = () => setAlert(null);

  React.useEffect(() => {
    setAlert(location.state && location.state.alert);
  }, [location, setAlert]);

  if (!alert) return null;

  const { duration = 5000, severity, message } = alert;

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={Boolean(alert)}
      autoHideDuration={duration}
      onClose={handleClose}
    >
      <Alert severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
