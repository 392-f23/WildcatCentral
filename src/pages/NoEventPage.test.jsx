import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NoEventPage from "./NoEventPage";

describe("NoEventPage Component", () => {
  it("should display the no event message with the event type", () => {
    const eventType = "School Org";
    render(<NoEventPage eventType={eventType} />);

    expect(
      screen.getByText(`No events available for ${eventType}.`)
    ).toBeInTheDocument();
  });
});
