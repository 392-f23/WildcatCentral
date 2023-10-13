import React from "react";

import AddIcon from '@mui/icons-material/Add';
import { FormControl, Checkbox, ListItemText, Fab, TextField, Select, OutlinedInput, MenuItem, InputLabel } from '@mui/material';
import { Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useEventStore from "../stores/eventStore";

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
    organizationName: "John Doe",
    name: "",
    description: "",
    location: "",
    startsOn: "",
    endsOn: "",
    image: "",
    categoryNames: [],
};

const EditEventModal = ({ selectedEventType, user }) => {
    if (!user) {
        return <></>;
    }

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const addEvent = useEventStore(state => state.addEvent);
    const categories = useEventStore(state => state.categories);

    const [newEvent, setNewEvent] = React.useState(DEFAULT_EVENT);

    const onClose = () => {
        onOpenChange();
    }

    const onSave = () => {
        // Check if image is empty
        if (newEvent.image === "") {
            newEvent.image = "https://static.campuslabsengage.com/discovery/images/events/social.jpg";
        }
        // Format the start and end dates to 2023-10-06T22:50:51.000Z format
        newEvent.startsOn = newEvent.startsOn.toISOString();
        newEvent.endsOn = newEvent.endsOn.toISOString();
        // Generate a random id, need to change this later
        newEvent.id = "WC-" + Math.floor(Math.random() * 1000);
        // Add the event to the store
        addEvent(selectedEventType, newEvent);
        // Reset the modal
        setNewEvent(DEFAULT_EVENT);
        onOpenChange();
    }

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
            newEvent.endsOn !== "";
    }

    return (
        <>
            <Fab color="primary"
                aria-label="add"
                onClick={onOpen}
                sx={{
                    position: 'fixed',
                    bottom: 25,
                    right: 25,
                    background: '#6D28D9',
                    color: 'white', '&:hover': {
                        background: '#4E2A84',
                    }
                }}
                disabled={isOpen}
            >
                <AddIcon />
            </Fab>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="md"
                scrollBehavior="inside"
                isDismissable={false}
            >
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add Event</ModalHeader>
                        <ModalBody>
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
                                error={!isDescriptionValid(newEvent.description)}
                                helperText={isDescriptionValid(newEvent.description) ? "" : "Please enter a valid description."}
                            />
                            <TextField
                                label="Location"
                                variant="outlined"
                                value={newEvent.location}
                                onChange={event => setNewEvent({ ...newEvent, location: event.target.value })}
                                required
                                error={!isLocationValid(newEvent.location)}
                                helperText={isLocationValid(newEvent.location) ? "" : "Please enter a valid location."}
                            />
                            <FormControl>
                                <InputLabel>categories</InputLabel>
                                <Select
                                    multiple
                                    value={newEvent.categoryNames}
                                    onChange={event => setNewEvent({ ...newEvent, categoryNames: event.target.value })}
                                    input={<OutlinedInput label="categories" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            <Checkbox checked={newEvent.categoryNames.indexOf(cat) > -1} />
                                            <ListItemText primary={cat} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Divider />
                            <DateTimePicker
                                disablePast
                                label="Starts On"
                                value={newEvent.startsOn}
                                onChange={date => setNewEvent({ ...newEvent, startsOn: date })}
                                required
                            />
                            {// show the second picker after first date is selected
                                newEvent.startsOn &&
                                <DateTimePicker
                                    minDate={newEvent.startsOn}
                                    label="Ends On"
                                    value={newEvent.endsOn}
                                    onChange={date => setNewEvent({ ...newEvent, endsOn: date })}
                                    required
                                />
                            }
                            <Divider />
                            <TextField
                                label="Image URL"
                                variant="outlined"
                                value={newEvent.image}
                                onChange={event => setNewEvent({ ...newEvent, image: event.target.value })}
                                error={!isImageURLValid(newEvent.image)}
                                helperText={isImageURLValid(newEvent.image) ? "" : "Please enter a valid image URL."}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} color="danger" variant="flat" className="rounded-md">
                                Discard
                            </Button>
                            <Button onClick={onSave} disabled={!allValid()} isDisabled={!allValid()} className="bg-[#4E2A84] hover:bg-[#4E2A84] text-white font-bold py-2 px-4 rounded-md">
                                Submit
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditEventModal;
