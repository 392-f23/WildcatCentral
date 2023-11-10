import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventsDisplay from "./EventsDisplay";

vi.mock("../stores/eventStore", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    categories: ["Information/Mock Session 1", "Information/Mock Session 2"],
    // Add other states and methods if they are used in the component
  })),
}));

describe("<EventsDisplay />", () => {
  const mockEvents = [
    {
      id: 1,
      name: "Event 1",
      description: "This is the description of a mock event.",
      latitude: 0,
      longitude: 0,
      organizationName: "Org 1",
      categoryNames: ["Information/Mock Session 1"],
    },
    // Add more mock events if necessary
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("displays only events of the selected category", async () => {
    render(
      <EventsDisplay
        events={mockEvents}
        currentPage="All Events"
        searchQuery=""
        favoriteEvents={[]}
        toggleFavorite={() => {}}
      />
    );

    const select = await screen.findByTestId("category-select");
    userEvent.click(select);

    // Using findByTestId to wait for the category option to appear
    const categoryOption = await screen.findByTestId(
      "category-option-Information-Mock-Session-1"
    );
    userEvent.click(categoryOption);

    // Assertions here...
    // Depending on the behavior of your component, you may need additional assertions
    // e.g., to check if the correct events are being displayed after selecting the category
  });
});
