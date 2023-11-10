import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventsDisplay from "./EventsDisplay";

vi.mock("../stores/eventStore", () => {
  const mockEvents = {
    "Individual Events": [
      {
        id: 1,
        name: "Event 1",
        description: "This is the description of a mock event.",
        latitude: 0,
        longitude: 0,
        organizationName: "Org 1",
        categoryNames: ["Information/Mock Session 1"],
      },
    ],
    "School Org": [
      {
        id: 2,
        name: "Event 2",
        description: "This is the description of a mock event.",
        latitude: 0,
        longitude: 0,
        organizationName: "Org 2",
        categoryNames: ["Information/Mock Session 2"],
      },
    ],
  };

  const mockFavorites = [];
  const setFavoriteEvents = vi.fn();

  const setCategories = vi.fn();

  const searchQuery = "";
  const categories = [
    "Information/Mock Session 1",
    "Information/Mock Session 2",
  ];

  const useEventStore = vi.fn((selector) => {
    if (typeof selector === "function") {
      // Call the selector with the mock state
      return selector({
        events: mockEvents,
        favoriteEvents: mockFavorites,
        setFavoriteEvents,
        user: { uid: "user1" },
        searchQuery: searchQuery,
        setCategories,
        categories,
      });
    }
    return {
      events: mockEvents,
      favoriteEvents: mockFavorites,
      setFavoriteEvents,
      user: { uid: "user1" },
      searchQuery: searchQuery,
      setCategories,
      categories,
    };
  });

  return { default: useEventStore };
});

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
    screen.debug();

    const select = await screen.findByTestId("category-select");
    userEvent.click(select);
    const option = await screen.findByText("Information/Mock Session 1");
    userEvent.click(option);
    screen.debug();

    await screen.findByText("Event 1");

    expect(screen.queryByText("Event 1")).toBeInTheDocument();
    expect(screen.queryByText("Gallery Opening")).not.toBeInTheDocument();
    expect(screen.queryByText("Shakespeare Play")).not.toBeInTheDocument();
  });
});
