import React from "react";

import ChannelList from "./ChannelList";

export default function ChannelBrowse() {
  return <ChannelList action="fetchAll" title="Discover Channels" />;
}
