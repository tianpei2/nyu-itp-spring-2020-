import React from "react";

import ChannelList from "./ChannelList";

export default function UserChannels() {
  return <ChannelList action="fetchByOwner" title="My Channels" />;
}
