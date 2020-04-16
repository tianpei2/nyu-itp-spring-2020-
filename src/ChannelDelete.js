import { useHistory, useLocation, useParams } from "react-router-dom";
import React from "react";

import qs from "qs";

import User from './User';
import foursquare from "./APIClient";

export default (props) => {
  let { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { user } = React.useContext(User.Context);

  const handleCancel = () => {
    const background = location.state && location.state.background;
    history.push(background || "/");
  };

  React.useEffect(() => {
    if (!window.confirm("Are you sure you want to delete this channel?"))
      return handleCancel();
    foursquare
      .post(
        "demo/marsbot/audio/channels/delete",
        qs.stringify({
          id,
        })
      )
      .then((resp) => history.replace(`/user/${user.id}/channels`));
  });

  return null;
};
