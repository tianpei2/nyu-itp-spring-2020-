import { Chip, FormControl, makeStyles } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import React from "react";

import AudioForm from "./AudioForm";
import FoursquareSuggest from "./FoursquareSuggest";

const useStyles = makeStyles((theme) => ({
  channelChip: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(2),
  },
}));

export default function AudioUpload() {
  const classes = useStyles();
  const location = useLocation();
  const state = location.state;
  const [channel, setChannel] = React.useState(state.channel);

  const handleDelete = () => {
    setChannel(null);
  };

  return (
    <AudioForm
      title="Upload an audio"
      extraInputs={
        <>
          {channel && (
            <FormControl
              fullWidth
              margin="normal"
              className={classes.channelChip}
            >
              <Chip
                color="primary"
                variant="outlined"
                label={`Add to channel: ${channel.title}`}
                onDelete={handleDelete}
              />
              <input name="audioChannelId" type="hidden" value={channel.id} />
            </FormControl>
          )}
          <FoursquareSuggest />
        </>
      }
    />
  );
}
