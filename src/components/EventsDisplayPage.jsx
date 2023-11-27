import React, { useEffect } from "react";

import EventsDisplay from "../components/EventsDisplay";
import useEventStore from "../stores/eventStore";
import { writeToDb, getDbData } from "../utilities/firebase";
import AppSpeedDial from "../components/SpeedDial-ChatGPT";

const EventsDisplayPage = ({ selectedEventType }) => {
  const eventsList = useEventStore((state) => state.events);
  const setCategories = useEventStore((state) => state.setCategories);
  const user = useEventStore((state) => state.user);
  const searchQuery = useEventStore((state) => state.searchQuery);
  const favoriteEvents = useEventStore((state) => state.favoriteEvents);
  const setFavoriteEvents = useEventStore((state) => state.setFavoriteEvents);
  const hasEvents =
    eventsList &&
    eventsList[selectedEventType] &&
    eventsList[selectedEventType].length > 0;

  useEffect(() => {
    if (eventsList && favoriteEvents) {
      if (selectedEventType === "Favorite Events") {
        const allCategories =
          favoriteEvents.flatMap((event) => event.categoryNames) || [];
        const uniqueCats = [...new Set(allCategories)];
        // remove undefined value from uniqueCats
        uniqueCats.splice(uniqueCats.indexOf(undefined), 1);
        setCategories(uniqueCats);
      } else {
        const selectedEventData = eventsList[selectedEventType];
        const allCategories =
          selectedEventData?.flatMap((event) => event.categoryNames) || [];
        const uniqueCats = [...new Set(allCategories)];
        // remove undefined value from uniqueCats
        uniqueCats.splice(uniqueCats.indexOf(undefined), 1);
        setCategories(uniqueCats);
      }
    }
  }, [eventsList, selectedEventType, history]);

  const fetchFavorites = async () => {
    if (user && eventsList) {
      const userId = user.uid;
      const path = `/favorites/${userId}/favorites`;
      try {
        const data = await getDbData(path);
        if (data) {
          const eventIDs = Object.values(data);
          const allEvents = Object.values(eventsList).flat();
          const newFavoriteEvents = allEvents.filter((event) =>
            eventIDs.includes(event.id.toString())
          );
          setFavoriteEvents(newFavoriteEvents);
        } else {
          setFavoriteEvents([]);
        }
      } catch (error) {
        console.log("Error fetching favorites:", error);
      }
    } else {
      setFavoriteEvents([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, eventsList]);

  const toggleFavorite = async (event) => {
    if (!user) return;

    const userId = user.uid;
    const path = `/favorites/${userId}`;
    let currentFavorites = favoriteEvents.map((e) => e.id);

    if (currentFavorites.includes(event.id)) {
      currentFavorites = currentFavorites.filter((e) => e !== event.id);
      setFavoriteEvents(favoriteEvents.filter((e) => e.id !== event.id));
    } else {
      currentFavorites.push(event.id);
      setFavoriteEvents([...favoriteEvents, event]);
    }

    await writeToDb(path, { favorites: currentFavorites });
  };

  return (
    <div className="index mt-12 md:mt-16">
      {user && selectedEventType !== "Favorite Events" && (
        <AppSpeedDial selectedEventType={selectedEventType} />
      )}
      {eventsList ? (
        hasEvents ? (
          <EventsDisplay
            events={eventsList[selectedEventType]}
            currentPage={selectedEventType}
            searchQuery={searchQuery}
            favoriteEvents={favoriteEvents}
            toggleFavorite={toggleFavorite}
          />
        ) : (
          <NoEventPage eventType={selectedEventType} />
        )
      ) : (
        <div className="text-center mt-8">
          <p className="text-lg font-bold text-white">
            Loading...Paws for a moment
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsDisplayPage;
