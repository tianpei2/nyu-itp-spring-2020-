import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close, Done } from "@material-ui/icons";
import { Helmet } from "react-helmet";
import { Prompt, useHistory, useLocation } from "react-router-dom";
import React from "react";

import { FlashContext } from "./FlashSnackbar";

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(7),
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ResponsiveDialog({
  title,
  content,
  handleSubmit,
  closeURL,
  ...rest
}) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const history = useHistory();
  const location = useLocation();
  const handleClose = () => {
    const background = location.state && location.state.background;
    history.push(background || closeURL);
  };

  const { setAlert } = React.useContext(FlashContext);
  const [blocking, setBlocking] = React.useState(false);

  return (
    <Dialog
      open={true}
      fullScreen={fullScreen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      TransitionComponent={Transition}
      {...rest}
    >
      <form
        onSubmit={(e) => {
          const blocking_ = blocking;
          setBlocking(false);
          handleSubmit(e).catch((error) => {
            setBlocking(blocking_);
            setAlert({
              duration: null,
              severity: "error",
              message: error.message,
            });
          });
        }}
        onChange={() => setBlocking(true)}
      >
        <Prompt
          when={blocking}
          message={(location) =>
            "Are you sure you want to leave this page? Changes you made may not be saved."
          }
        />
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {fullScreen ? (
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <Close />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {title}
              </Typography>
              <IconButton
                edge="end"
                type="submit"
                color="inherit"
                aria-label="submit"
              >
                <Done />
              </IconButton>
            </Toolbar>
          </AppBar>
        ) : (
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        )}
        <DialogContent className={classes.content}>{content}</DialogContent>
        {fullScreen || (
          <DialogActions>
            <Button color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}
