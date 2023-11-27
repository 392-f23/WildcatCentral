import React from "react";

const NoEventPage = ({ eventType }) => {
  return (
    <div className="text-center mt-8">
      <p className="text-lg font-bold">No events available for {eventType}.</p>
    </div>
  );
};

export default NoEventPage;
