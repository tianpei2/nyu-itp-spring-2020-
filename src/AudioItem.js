import {
  DeleteOutline,
  PauseCircleOutline,
  PlayCircleOutline,
  Schedule,
} from "@material-ui/icons";
import {
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import Moment from "react-moment";
import React from "react";

import CategoryIcon from "./CategoryIcon";
import ListActionItem from "./ListActionItem";

const useStyles = makeStyles((theme) => ({
  listItemLink: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
  },
  listItemBody: {
    minWidth: 0,
  },
  listItemActions: {
    whiteSpace: "nowrap",
  },
}));

export default function AudioItem({
  audio,
  action,
  playing,
  handleClick,
  handlePlay,
  handleDelete,
  divider = true,
}) {
  const classes = useStyles();
  const venue = audio.venues[0];
  let title = "Unknown Audio",
    href,
    subTitle,
    category;
  if (audio.isName) title = "Your Name";
  if (audio.isJingle) title = "Your Jingle";
  if (venue) {
    href = `https://foursquare.com/v/${venue.id}`;
    title = (
      <Link
        color="inherit"
        underline="none"
        target="_blank"
        rel="noopener"
        href={href}
      >
        {venue.name}
      </Link>
    );
    subTitle = venue.location.formattedAddress[0];
    category = venue.categories && venue.categories[0];
  }

  const PlayIcon =
    playing && playing.src === audio.url
      ? PauseCircleOutline
      : PlayCircleOutline;

  return (
    <ListItem divider={divider} onClick={handleClick}>
      {handleClick || (
        <a
          href={href}
          tabIndex="-1"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.listItemLink}
        >
          {title}
        </a>
      )}
      <ListItemAvatar>
        <Link href={href} target="_blank" rel="noopener">
          <CategoryIcon category={category} />
        </Link>
      </ListItemAvatar>
      <div className={classes.listItemBody}>
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            component: "h2",
            noWrap: true,
            title: title,
          }}
          secondary={subTitle}
          secondaryTypographyProps={{ noWrap: true, title: subTitle }}
        />
        <div className={classes.listItemActions}>
          <ListActionItem
            edge="start"
            icon={Schedule}
            text={
              <Moment
                parse="LLL"
                format="L"
                fromNowDuring={1000 * 60 * 60 * 24 * 7}
                withTitle
              >
                {audio.createDate}
              </Moment>
            }
          />
          <ListActionItem
            tabIndex="-1"
            icon={PlayIcon}
            text={audio.playCount || 0}
            onClick={() => handlePlay(audio.url)}
          />
          {handleDelete && (
            <ListActionItem
              tabIndex="-1"
              icon={DeleteOutline}
              text="Delete"
              onClick={() => handleDelete(audio.id)}
            />
          )}
        </div>
      </div>
      <ListItemSecondaryAction>
        {action ? (
          action(audio)
        ) : (
          <IconButton
            onClick={() => handlePlay(audio.url)}
            edge="end"
            aria-label="play"
          >
            <PlayIcon fontSize="large" />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
