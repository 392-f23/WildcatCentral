import { create } from "zustand";

const useEventStore = create((set) => ({
    events: null,
    setEvents: (events) => set({ events }),
    // shoud put under events = {selectedEventType:{value:[]}}
    // just extend the array
    addEvent: (selectedEventType, event) => set((state) => {
        console.log("addEvent", event, selectedEventType)
        let events = { ...state.events };
        console.log("events", events)
        console.log(Object.keys(events))
        events[selectedEventType].push(event);
        return { events };
    }),
    catagories: [],
    setCatagories: (catagories) => set({ catagories }),
    addCatagory: (catagory) => set((state) => ({ catagories: { ...state.catagories, [catagory.id]: catagory } })),
}));

export default useEventStore;