import EventCard from "./EventCard";

const EventList = ({ events }) => {
  // Sanity check to make sure we're getting the right data
  if (!events) {
    return (
      <div className="flex flex-col justify-center items-center m-10 text-slate-200">
        <h1 className="text-4xl font-bold">No events found</h1>
        <p className="text-xl">Try changing the event type</p>
      </div>
    )
  }
  return (
    <div className="gap-4 grid m-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-fit">
      {events.map((event) => (
        <EventCard event={event} key={event.name.replace(/\s/g, "")} />
      ))}
    </div>
  )
}

export default EventList;