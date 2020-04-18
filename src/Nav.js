import {
  AppBar,
  Avatar,
  Box,
  Hidden,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@material-ui/core";
import {
  Apps,
  Collections,
  CollectionsBookmark,
  MoreVert,
  PlaylistAdd,
  Publish,
} from "@material-ui/icons";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  usePopupState,
  bindMenu,
  bindTrigger,
} from "material-ui-popup-state/hooks";
import React from "react";

import User from "./User";

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const NavTabs = withStyles((theme) => ({
  indicator: {
    backgroundColor: "white",
    height: "4px",
  },
}))(Tabs);

const NavTabItem = withStyles((theme) => ({
  root: {
    // textTransform: "none",
    opacity: 1,
    minWidth: 0, // theme.spacing(10),
    minHeight: theme.spacing(8),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}))(({ idx, ...props }) => (
  <Hidden xsDown={idx > 3}>
    <Tab disableRipple {...props} />
  </Hidden>
));

const useStyles = makeStyles((theme) => ({
  logo: {
    marginLeft: theme.spacing(1.5),
  },
  appbar: {
    "& + *": {
      marginTop: theme.spacing(8),
    },
  },
}));

function NavLinks({ user }) {
  const location = useLocation();
  const background = { background: location };
  const tabs = [
    ["/channels", <Apps />, null, "Browse all channels"],
    [`/user/${user.id}/channels`, <Collections />, null, "My channels"],
    [
      `/user/${user.id}/subscriptions`,
      <CollectionsBookmark />,
      null,
      "My Subscriptions",
    ],
    ["/channel/create", <PlaylistAdd />, background, "Create a new channel"],
    ["/audio/upload", <Publish />, background, "Upload an audio"],
  ];
  const path = location.pathname;
  const active = tabs.filter((t) => t[0] === path)[0] ? path : false;

  return (
    <NavTabs variant="fullWidth" value={active}>
      {tabs.map((t, idx) => {
        const [path, icon, state, title] = t;
        return (
          <NavTabItem
            key={path}
            idx={idx}
            component={RouterLink}
            to={{
              pathname: path,
              state: state,
            }}
            value={path}
            label={
              <Tooltip title={title} aria-label={title}>
                <IconButton color="inherit">{icon}</IconButton>
              </Tooltip>
            }
          />
        );
      })}
    </NavTabs>
  );
}

function NavMenus() {
  const history = useHistory();
  const location = useLocation();
  const background = { background: location };
  const { user, setUser } = React.useContext(User.Context);
  const popupState = usePopupState({
    variant: "popper",
    popupId: "account-menu",
  });
  const menus = [
    [`/user/${user.id}/channels`, null, "My channels"],
    [`/user/${user.id}/subscriptions`, null, "My Subscriptions"],
    ["/settings/name", background, "Set Name"],
    ["/settings/jingle", background, "Set Jingle"],
  ];

  const handleLogOut = () => {
    User.signOut();
    setUser(null);
    history.push("/");
  };

  React.useEffect(popupState.close, [location]);

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        {...bindTrigger(popupState)}
      >
        {/* <Avatar alt={user.name} src={user.picture} /> */}
        <MoreVert />
      </IconButton>
      <Menu id="menu-appbar" {...bindMenu(popupState)}>
        <MenuItem component={Link} href={user.profile} color="inherit">
          {`${user.firstName}'s Profile`}
        </MenuItem>
        {menus.map((m) => {
          const [path, state, title] = m;
          return (
            <MenuItem
              component={RouterLink}
              key={path}
              to={{
                pathname: path,
                state: state,
              }}
            >
              {title}
            </MenuItem>
          );
        })}
        <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
      </Menu>
    </>
  );
}

export default function Nav(props) {
  const { user } = React.useContext(User.Context);
  const classes = useStyles();

  return (
    <HideOnScroll>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <IconButton
              component={RouterLink}
              to="/"
              edge="start"
              color="inherit"
            >
              <Avatar src="https://pbs.twimg.com/media/EN4Hl-jUwAAy0T5.jpg" />
              <Hidden xsDown={Boolean(user)}>
                <Typography
                  variant="h6"
                  component="h1"
                  className={classes.logo}
                >
                  Marsbot Audio
                </Typography>
              </Hidden>
            </IconButton>
          </Box>

          {user && <NavLinks user={user} />}
          {user && <NavMenus />}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
