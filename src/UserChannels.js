import { CardActions } from "@material-ui/core";
import { DeleteOutline, EditOutlined } from "@material-ui/icons";
import { Link as RouterLink, useLocation } from "react-router-dom";
import React from "react";

import ChannelList from "./ChannelList";
import ListActionItem from "./ListActionItem";
import User from "./User";

export default function UserChannels() {
  const location = useLocation();
  const { user } = React.useContext(User.Context);

  const cardAction = (channel) => {
    if (user.id !== channel.user.id) return null;
    return (
      <CardActions>
        {/* <ListActionItem icon={FavoriteBorder} text="Subscribe" /> */}

        <ListActionItem
          icon={EditOutlined}
          text="Edit"
          component={RouterLink}
          to={{
            pathname: `/channel/${channel.id}/edit`,
            state: { background: location, channel: channel },
          }}
        />
        <ListActionItem
          icon={DeleteOutline}
          text="Delete"
          component={RouterLink}
          to={{
            pathname: `/channel/${channel.id}/delete`,
            state: { background: location },
          }}
        />
      </CardActions>
    );
  };

  return (
    <ChannelList
      action="fetchByOwner"
      title="My Channels"
      cardAction={cardAction}
    />
  );
}
