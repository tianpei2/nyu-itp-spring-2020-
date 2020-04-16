import { CssBaseline } from "@material-ui/core";
import { Helmet } from "react-helmet";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import React from "react";

import AttachForm from "./AttachForm";
import AudioUpload from "./AudioUpload.js";
import ChannelBrowse from "./ChannelBrowse";
import ChannelDelete from "./ChannelDelete";
import ChannelForm from "./ChannelForm";
import ChannelView from "./ChannelView";
import FlashSnackbar, { FlashContext } from "./FlashSnackbar";
import MarsbotHome from "./MarsbotHome";
import Nav from "./Nav";
import NoMatch404 from "./NoMatch";
import SettingForm from "./SettingForm";
import SignIn from "./SignIn";
import User from "./User";
import UserChannels from "./UserChannels";
import UserSubscriptions from "./UserSubscriptions";

function RouteSwitch() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Switch location={background || location}>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/audio/upload">
          <MarsbotHome />
          <AudioUpload />
        </Route>
        <Route exact path="/channel/create">
          <MarsbotHome />
          <ChannelForm />
        </Route>
        <Route path="/channel/:id">
          <ChannelView />
        </Route>
        <Route path="/channels">
          <ChannelBrowse />
        </Route>
        <Route path="/user/:id/channels">
          <UserChannels />
        </Route>
        <Route path="/user/:id/subscriptions">
          <UserSubscriptions />
        </Route>
        <Route path="/settings/name">
          <MarsbotHome />
          <SettingForm type="name" />
        </Route>
        <Route path="/settings/jingle">
          <MarsbotHome />
          <SettingForm type="jingle" />
        </Route>
        <Route exact path="/">
          <MarsbotHome />
        </Route>
        <Route path="*">
          <NoMatch404 />
        </Route>
      </Switch>

      {background && (
        <>
          <Route path="/audio/upload">
            <AudioUpload />
          </Route>
          <Route path="/channel/create">
            <ChannelForm />
          </Route>
          <Route path="/channel/:id/attach">
            <AttachForm />
          </Route>
          <Route path="/channel/:id/upload">
            <AudioUpload />
          </Route>
          <Route path="/channel/:id/edit">
            <ChannelForm />
          </Route>
          <Route path="/channel/:id/delete">
            <ChannelDelete />
          </Route>
          <Route path="/settings/name">
            <SettingForm type="name" />
          </Route>
          <Route path="/settings/jingle">
            <SettingForm type="jingle" />
          </Route>
        </>
      )}

      <FlashSnackbar />
    </>
  );
}

export default function App() {
  const [user, setUser] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  window.setAlert = setAlert; // FIXME: remove global function

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id") || "self";
    User.get(userId).then(setUser);
  }, []);

  return (
    <Router>
      <Helmet titleTemplate="Marsbot Audio » %s">
        <title>Home</title>
      </Helmet>
      <User.Context.Provider value={{ user, setUser }}>
        <FlashContext.Provider value={{ alert, setAlert }}>
          <CssBaseline />
          <Nav />
          {user ? <RouteSwitch /> : <SignIn />}
        </FlashContext.Provider>
      </User.Context.Provider>
    </Router>
  );
}
