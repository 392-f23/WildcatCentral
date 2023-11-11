import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventsDisplay from "./EventsDisplay";

vi.mock("../stores/eventStore", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    categories: ["Information/Mock Session 1", "Information/Mock Session 2"],
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
    {
      id: 2,
      name: "Event 2",
      description: "This is the description of a mock event.",
      latitude: 0,
      longitude: 0,
      organizationName: "Org 2",
      categoryNames: ["Information/Mock Session 2"],
    },
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

    expect(screen.getByText("Event 1")).toBeInTheDocument();
  });
});
