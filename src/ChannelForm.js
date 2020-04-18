import { useHistory, useLocation } from "react-router-dom";
import React from "react";
import TextField from "@material-ui/core/TextField";
import { DropzoneArea } from "material-ui-dropzone";

import ResponsiveDialog from "./ResponsiveDialog";
import foursquare from "./APIClient";

export default function ChannelForm() {

  const [file, setFile] = React.useState([]);

  const history = useHistory();
  const location = useLocation();
  const background = location.state && location.state.background;
  const editing = location.state && location.state.channel;
  const [channel, setChannel] = React.useState(
    editing || {
      title: "",
      description: "",
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("image", file);

    let action = "demo/marsbot/audio/channels/";
    action += editing ? "update" : "add";
    return foursquare.post(action, formData).then((response) => {
      const channelId = channel.id || response.id;
      history.push(editing ? background : `/channel/${channelId}`);
    });
  };

  const handleChange = (event) => {
    const input = event.target;
    setChannel({ ...channel, [input.name]: input.value });
  };

  return (
    <ResponsiveDialog
      title={editing ? "Edit" : "Create a new channel"}
      handleSubmit={handleSubmit}
      closeURL="/"
      content={
        <>
          <input name="id" type="hidden" value={channel.id} />
          <TextField
            name="title"
            value={channel.title}
            onChange={handleChange}
            label="Title"
            autoFocus
            required
            variant="outlined"
            fullWidth
          />
          <TextField
            name="description"
            value={channel.description}
            onChange={handleChange}
            label="Description"
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            rows={4}
            rowsMax={10}
          />
          <DropzoneArea
            dropzoneText={"Drag and drop your cover here or click"}
            onChange={setFile}
            acceptedFiles={['image/*']}
            maxFileSize={5000000}
            filesLimit={1}
            showPreviews = {true}
            showPreviewsInDropzone={false}
          />
      </>
      }
    />
  );
}
