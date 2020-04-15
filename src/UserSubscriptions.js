import React from "react";

import ChannelList from "./ChannelList";

export default function UserSubscriptions() {
  return <ChannelList action="fetchSubscribed" title="Subscribed Channels" />;
}
