import { CardMedia, IconButton, makeStyles } from "@material-ui/core";
import { Close, InsertPhoto } from "@material-ui/icons";
import { useDropzone } from "react-dropzone";
import React from "react";

import clsx from "clsx";

import User from "./User";
import foursquare from "./APIClient";

const useStyles = makeStyles((theme) => ({
  uploadBox: {
    position: "relative",
    paddingTop: "56.25%", // 16:9
    textAlign: "center",
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    "&.empty": {
      cursor: "pointer",
      border: "1px solid rgba(0, 0, 0, 0.23)",
    },
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
    "&:focus": {
      outline: "none",
    },
  },
  uploadText: {
    position: "absolute",
    top: "50%",
    left: "0",
    right: "0",
    transform: "translateY(-50%)",
  },
  uploadIcon: {
    fontSize: 72,
    marginTop: "10%",
  },
  closeIcon: {
    color: "white",
    position: "absolute",
    top: 0,
    right: 0,
  },
}));

export default function PhotoUpload(props) {
  const classes = useStyles();
  const { user } = React.useContext(User.Context);
  const [photo, setPhoto] = React.useState(props.photo || {});

  const handleDeletePhoto = (event) => {
    event.stopPropagation();
    setPhoto({});
  };

  const handleUpload = (files) => {
    const formData = new FormData();
    formData.append("pageId", user.id);
    formData.append("file", files[0]);
    return foursquare
      .post("photos/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const p = response.photo;
        p.url = `${p.prefix}${p.width}x${p.height}${p.suffix}`;
        setPhoto(p);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleUpload,
  });

  return (
    <CardMedia
      className={clsx(classes.uploadBox, {
        empty: !photo.id,
      })}
      image={photo.url}
      {...getRootProps()}
    >
      <input name="photoId" type="hidden" value={photo.id || ""} />
      <input {...getInputProps()} />
      {photo.id ? (
        <IconButton className={classes.closeIcon} onClick={handleDeletePhoto}>
          <Close />
        </IconButton>
      ) : (
        <div className={classes.uploadText}>
          <InsertPhoto className={classes.uploadIcon} />
          <p>Drag 'n' drop here, or click to select an image</p>
        </div>
      )}
    </CardMedia>
  );
}
