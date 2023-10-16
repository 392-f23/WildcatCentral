import { create } from "zustand";

const useEventStore = create((set) => ({
    events: null,
    setEvents: (events) => set({ events }),
    addEvent: (selectedEventType, event) => set((state) => {
        let events = { ...state.events };
        events[selectedEventType].push(event);
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