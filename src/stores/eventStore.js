import { create } from "zustand";
import { writeToDb } from "../utilities/firebase";

const useEventStore = create((set) => ({
    events: null,
    setEvents: (events) => set({ events }),
    addEvent: (selectedEventType, event, user) => set((state) => {
        let events = { ...state.events };
        console.log(events);
        events[selectedEventType].push(event);
        // create {eventtype: [events]} object
        const eventObj = {};
        eventObj[selectedEventType] = events[selectedEventType];
        writeToDb(`events`, eventObj);
        writeToDb(`userdata/${user.uid}/events/${selectedEventType}/${event.id}`, event);
        return { events };
    }),
    categories: [],
    setCategories: (categories) => set({ categories }),
    addcategory: (category) => set((state) => ({ categories: { ...state.categories, [category.id]: category } })),
    user: null,
    setUser: (user) => set({ user }),
    searchQuery: "",
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    favoriteEvents: [],
    setFavoriteEvents: (favoriteEvents) => set({ favoriteEvents }),
}));

export default useEventStore;