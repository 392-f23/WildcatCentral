import { create } from "zustand";

const useEventStore = create((set) => ({
    events: null,
    setEvents: (events) => set({ events }),
    // shoud put under events = {selectedEventType:{value:[]}}
    // just extend the array
    addEvent: (selectedEventType, event) => set((state) => {
        let events = { ...state.events };
        events[selectedEventType].push(event);
        return { events };
    }),
    categories: null,
    // log the incoming categories arr
    setCategories: (categories) => set({ categories }),
    addcategory: (category) => set((state) => ({ categories: { ...state.categories, [category.id]: category } })),
}));

export default useEventStore;