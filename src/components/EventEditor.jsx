import React from "react";

import { Alert, Card, FormControl, TextField, Select, MenuItem, InputLabel, Typography, Snackbar } from '@mui/material';
import { Divider, Button } from "@nextui-org/react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useProfile } from '../utilities/profile';
import useEventStore from "../stores/eventStore";
import LocationPicker from "./LocationPicker";
import { v4 as uuid } from 'uuid';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const DEFAULT_EVENT = {
    organizationName: "",
    name: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    startsOn: "",
    endsOn: "",
    image: "",
    categoryNames: "",
};

const EventEditor = () => {
    const addEvent = useEventStore(state => state.addEvent);
    const [eventType, setEventType] = React.useState('Individual Events');
    const [profile, profileLoading, profileError] = useProfile();
    const [newEvent, setNewEvent] = React.useState(DEFAULT_EVENT);
    const [openSuccess, setOpenSuccess] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setOpenSuccess(false);
      };

    const onSave = () => {
        // Check if image is empty
        if (newEvent.image === "") {
            newEvent.image =
                "https://static.campuslabsengage.com/discovery/images/events/social.jpg";
        }
        // Format the start and end dates to 2023-10-06T22:50:51.000Z format
        newEvent.startsOn = newEvent.startsOn.toISOString();
        newEvent.endsOn = newEvent.endsOn.toISOString();
        // Generate a random id, need to change this later
        newEvent.id = "WC-" + uuid();
        // Split the category string into an array
        newEvent.categoryNames =
            newEvent.categoryNames === "" ? [] : newEvent.categoryNames.split(",").map((cat) => cat.trim());
        // Add user info
        newEvent.organizationName = profile?.user.displayName;
        newEvent.fromUid = profile?.user.uid;
        newEvent.fromUser = true;
        newEvent.organizationProfilePicture = profile?.user.photoURL;
        // Add the event to the store
        addEvent(eventType, newEvent, profile.user);
        // Reset the form
        setNewEvent(DEFAULT_EVENT);
        // Open the snackbar
        setOpenSuccess(true);
    };

    const isNameValid = (name) => {
        // at least 2 characters
        return name.length >= 2 && name.length <= 50 || name === "";
    }

    const isDescriptionValid = (description) => {
        // at least 15 characters
        return description.length >= 15 && description.length <= 1000 || description === "";
    }

    const isLocationValid = (location) => {
        // at least 5 characters
        return location.length >= 5 && location.length <= 100 || location === "";
    }

    const isImageURLValid = (imageURL) => {
        // regex to check if valid url
        const regex = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

        return imageURL.match(regex) || imageURL === "";
    }

    const allValid = () => {
        return isNameValid(newEvent.name) &&
            isDescriptionValid(newEvent.description) &&
            isLocationValid(newEvent.location) &&
            isImageURLValid(newEvent.image) &&
            newEvent.name !== "" &&
            newEvent.description !== "" &&
            newEvent.location !== "" &&
            newEvent.startsOn !== "" &&
            newEvent.latitude !== "" &&
            newEvent.longitude !== "" &&
            newEvent.endsOn !== "";
    }

    return (
        <Card className="p-4 flex flex-col gap-4">
            <Typography variant="h6">Create a New Event</Typography>
            <FormControl variant="outlined" className="mb-4">
                <InputLabel>Event Type</InputLabel>
                <Select
                    value={eventType}
                    onChange={(event) => setEventType(event.target.value)}
                    label="Event Type"
                >
                    <MenuItem value={'Individual Events'}>Individual Events</MenuItem>
                    {profile?.isAdmin && (
                        <MenuItem value={'School Org'}>School Org</MenuItem>
                    )}
                </Select>
            </FormControl>
            <TextField
                autoFocus
                label="Name of Your Event"
                variant="outlined"
                value={newEvent.name}
                onChange={event => setNewEvent({ ...newEvent, name: event.target.value })}
                required
                error={!isNameValid(newEvent.name)}
                helperText={isNameValid(newEvent.name) ? "" : "Please enter a valid name."}
            />
            <TextField
                label="Description"
                variant="outlined"
                value={newEvent.description}
                onChange={event => setNewEvent({ ...newEvent, description: event.target.value })}
                required
                multiline
                minRows={3}
                maxRows={10}
                error={!isDescriptionValid(newEvent.description)}
                helperText={isDescriptionValid(newEvent.description) ? "" : "Please enter a valid description."}
            />
            <TextField
                label="Categories (comma-separated)"
                variant="outlined"
                value={newEvent.categoryNames}
                onChange={event => setNewEvent({ ...newEvent, categoryNames: event.target.value })}
            />
            <Divider />
            <Typography variant="h6">Date and Time</Typography>
            <DateTimePicker
                disablePast
                label="Starts On"
                value={newEvent.startsOn}
                onChange={date => setNewEvent({ ...newEvent, startsOn: date })}
                required
            />
            <DateTimePicker
                minDate={newEvent.startsOn}
                label="Ends On"
                value={newEvent.endsOn}
                onChange={date => setNewEvent({ ...newEvent, endsOn: date })}
                required
            />
            <Divider />
            <Typography variant="h6">Location</Typography>
            <TextField
                label="Location Name"
                variant="outlined"
                value={newEvent.location}
                onChange={event => setNewEvent({ ...newEvent, location: event.target.value })}
                required
                error={!isLocationValid(newEvent.location)}
                helperText={isLocationValid(newEvent.location) ? "" : "Please enter a valid location."}
            />
            <Typography variant="body2">Please click on the map to set the map location (required).</Typography>
            <LocationPicker
                onLocationChange={(loc) => {
                    setNewEvent({
                        ...newEvent,
                        latitude: loc.lat.toString(),
                        longitude: loc.lng.toString(),
                    });
                }}
            />
            <Divider />
            <Typography variant="h6">Optional Image</Typography>
            <TextField
                label="Image URL"
                variant="outlined"
                value={newEvent.image}
                onChange={event => setNewEvent({ ...newEvent, image: event.target.value })}
                error={!isImageURLValid(newEvent.image)}
                helperText={isImageURLValid(newEvent.image) ? "" : "Please enter a valid image URL."}
            />
            <div className="flex justify-end gap-4">
                <Button color="danger" variant="flat" className="rounded-md" onClick={() => setNewEvent(DEFAULT_EVENT)}>
                    Discard
                </Button>
                <Button onClick={onSave} disabled={!allValid()} isDisabled={!allValid()} className="bg-[#4E2A84] hover:bg-[#4E2A84] text-white font-bold py-2 px-4 rounded-md">
                    Submit
                </Button>
            </div>
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Successfully created event!
                </Alert>
            </Snackbar>
        </Card>
    );
}

export default EventEditor;
