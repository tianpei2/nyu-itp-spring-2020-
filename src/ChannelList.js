import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Link,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import React from "react";

import SubscribeIcon from "./SubscribeIcon";
import User from "./User";
import foursquare from "./APIClient";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  card: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardLink: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardHeaderContent: {
    minWidth: 0,
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

export default function ChannelList({ action, title, cardAction }) {
  const classes = useStyles();
  const location = useLocation();
  const { user } = React.useContext(User.Context);
  let { userId = user.id } = useParams();
  const [channels, setChannels] = React.useState([]);

  React.useEffect(() => {
    foursquare
      .get(`demo/marsbot/audio/channels/${action}`, {
        params: {
          userId,
        },
      })
      .then((resp) => setChannels(resp.channels));
  }, [action, userId, location]);

  const renderChannel = (channel, index) => {
    channel.user = User.transform(channel.user);
    channel.path = `/channel/${channel.id}`;
    const subscribed = Boolean(
      channel.subscribers.filter((u) => u.id === user.id)[0]
    );

    return (
      <Grid item key={channel.id} xs={12} sm={6} md={4}>
        <Card className={classes.card}>
          <RouterLink
            to={`/channel/${channel.id}`}
            className={classes.cardLink}
            alt={channel.title}
          />
          <CardHeader
            avatar={
              <Link href={channel.user.profile} target="_blank" rel="noopener">
                <Avatar alt={channel.user.name} src={channel.user.picture} />
              </Link>
            }
            action={
              <SubscribeIcon channelId={channel.id} subscribed={subscribed} />
            }
            title={channel.title}
            titleTypographyProps={{
              noWrap: true,
            }}
            subheader={channel.createDate}
            classes={{ content: classes.cardHeaderContent }}
          />
          <CardMedia
            className={classes.cardMedia}
            image={`https://source.unsplash.com/random?${index}&id=${channel.id}`}
          />
          <CardContent className={classes.cardContent}>
            <Typography variant="body2" color="textSecondary" component="p">
              {channel.description}
            </Typography>
          </CardContent>
          {cardAction && cardAction(channel)}
        </Card>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="textPrimary"
          >
            {title}
          </Typography>
        </Container>
      </div>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {channels.map(renderChannel)}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
