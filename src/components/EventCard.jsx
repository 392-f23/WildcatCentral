import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useEventStore from "../stores/eventStore";
import { Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapModal from "./MapModal";
import { useDisclosure } from "@nextui-org/react";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const EventCard = ({ event, isFavorite, toggleFavorite }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const user = useEventStore((state) => state.user);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 350 }}>
      <MapModal isOpen={isOpen} onOpenChange={onOpenChange} latitude={event.latitude} longitude={event.longitude} locationName={event.location} />
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={event.organizationProfilePicture}
          >
            {event.organizationName[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={event.name}
        subheader={<Button
          variant="text"
          size="small"
          className="m-0 p-0 justify-start text-left"
          startIcon={<LocationOnIcon />}
          onClick={onOpen}
        >{event.location}</Button>}
      />
      <CardMedia component="img" image={event.image} alt="Image of event" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Hosted by {event.organizationName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          From:
          {new Date(event.startsOn).toLocaleString()}
          <br />
          To:
          {new Date(event.endsOn).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {user ? (
          <IconButton
            aria-label="add to favorites"
            onClick={toggleFavorite}
            color={isFavorite ? "primary" : "default"}
          >
            <FavoriteIcon />
          </IconButton>
        ) : null}
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description:</Typography>
          <div dangerouslySetInnerHTML={{ __html: event.description }} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default EventCard;
