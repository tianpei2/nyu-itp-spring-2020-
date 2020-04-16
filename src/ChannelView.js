import { Add, DeleteOutline, EditOutlined, Publish } from "@material-ui/icons";
import {
  Avatar,
  Backdrop,
  CircularProgress,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import {
  Link as RouterLink,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";
import React from "react";

import qs from "qs";

import AudioList from "./AudioList";
import ListActionItem from "./ListActionItem";
import NoMatch404 from "./NoMatch";
import SubscribeIcon from "./SubscribeIcon";
import User from "./User";
import foursquare from "./APIClient";

export default function ChannelView() {
  let { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { user } = React.useContext(User.Context);
  const [loading, setLoading] = React.useState(true);
  const [channel, setChannel] = React.useState(null);
  const [audios, setAudios] = React.useState([]);
  const subscribed =
    channel &&
    Boolean(channel.subscribers.filter((u) => u.id === user.id).length);

  React.useEffect(() => {
    foursquare
      .get("demo/marsbot/audio/channels/fetch", {
        params: {
          id,
        },
        ejectErrorAlert: true,
      })
      .then((channel) => {
        channel.path = `/channel/${id}`;
        channel.user = User.transform(channel.user);
        setChannel(channel);
      })
      .catch((error) => {})
      .then(() => setLoading(false));
  }, [id, location]);

  React.useEffect(() => {
    if (!(channel && channel.content[0])) return;
    const audioIds = new Set(channel.content.map((a) => a.audioFileId));

    foursquare
      .getUserAudios(user.id)
      .then((audios) =>
        setAudios(audios.filter((a) => a.venues[0] && audioIds.has(a.id)))
      );
  }, [channel, user]);

  React.useEffect(() => {
    if (!channel) return;
    const path = location.pathname;
    if (path !== channel.path) {
      location.pathname = channel.path;
      history.replace(path, {
        background: location,
        channel: channel,
      });
    }
  }, [channel, history, location]);

  const handleRemoveAudio = (audioFileId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this audio from this channel?"
      )
    )
      return;
    const venueIds = channel.content
      .filter((a) => a.audioFileId === audioFileId)
      .map((a) => a.venueId)
      .join(",");
    foursquare
      .post(
        "demo/marsbot/audio/channels/attach",
        qs.stringify({
          id,
          venueIds,
          audioFileId,
          attached: false,
        })
      )
      .then((resp) => setAudios(audios.filter((a) => a.id !== audioFileId)));
  };

  if (loading)
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  if (!channel) return <NoMatch404 />;

  return (
    <AudioList
      audios={audios}
      header={
        <ListItem divider key="title">
          <Link href={channel.user.profile} target="_blank" rel="noopener">
            <ListItemAvatar>
              <Avatar alt={channel.user.name} src={channel.user.picture} />
            </ListItemAvatar>
          </Link>
          <div>
            <ListItemText
              primary={
                <Link
                  color="inherit"
                  underline="none"
                  component={RouterLink}
                  to={channel.path}
                >
                  {channel.title}
                </Link>
              }
              secondary={channel.description}
              primaryTypographyProps={{
                component: "h1",
                variant: "h6",
              }}
            />
            {user.id === channel.user.id && (
              <div>
                <ListActionItem
                  edge="start"
                  icon={Add}
                  text="Add"
                  component={RouterLink}
                  to={{
                    pathname: `${channel.path}/attach`,
                    state: { background: location },
                  }}
                />
                <ListActionItem
                  icon={Publish}
                  text="Upload"
                  component={RouterLink}
                  to={{
                    pathname: `${channel.path}/upload`,
                    state: { background: location, channel: channel },
                  }}
                />
                <ListActionItem
                  icon={EditOutlined}
                  text="Edit"
                  component={RouterLink}
                  to={{
                    pathname: `${channel.path}/edit`,
                    state: { background: location, channel: channel },
                  }}
                />
                <ListActionItem
                  icon={DeleteOutline}
                  text="Delete"
                  component={RouterLink}
                  to={{
                    pathname: `${channel.path}/delete`,
                    state: { background: location },
                  }}
                />
              </div>
            )}
          </div>

          <ListItemSecondaryAction>
            <SubscribeIcon edge="end" channelId={id} subscribed={subscribed} />
          </ListItemSecondaryAction>
        </ListItem>
      }
      handleDelete={handleRemoveAudio}
    />
  );
}
