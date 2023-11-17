import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MapModal from './MapModal'; // Assuming this is a custom component for the leaflet modal
import useEventStore from "../stores/eventStore"; // Path adjusted as per your project structure

const EventCard = ({ event, isFavorite, toggleFavorite }) => {
  const { name, picture, location, startTime, endTime } = event;
  const [isMapOpen, setMapOpen] = useState(false);
  const user = useEventStore((state) => state.user);

  const handleMapOpen = () => {
    setMapOpen(true);
  };

  const handleMapClose = () => {
    setMapOpen(false);
  };

  const handleFavoriteClick = () => {
    toggleFavorite();
  };

  // Function to handle social media sharing
  const shareToSocialMedia = () => {
    // Implement sharing logic here
  };

  return (
    <Card>
      <CardMedia component="img" height="140" image={picture} alt={name} />
      <CardContent>
        <h2>{name}</h2>
        <p>Location: {location}</p>
        <p>Starts: {startTime}</p>
        <p>Ends: {endTime}</p>
      </CardContent>
      <CardActions>
        <Button onClick={shareToSocialMedia}>
          <ShareIcon /> Share
        </Button>
        <Button onClick={handleMapOpen}>Show Map</Button>
        {user && (
          <Button onClick={handleFavoriteClick} color={isFavorite ? 'primary' : 'default'}>
            <FavoriteIcon /> Favorite
          </Button>
        )}
      </CardActions>
      <MapModal open={isMapOpen} onClose={handleMapClose} location={location} />
    </Card>
  );
};

export default EventCard;
