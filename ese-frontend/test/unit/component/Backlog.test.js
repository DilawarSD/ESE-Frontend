import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Backlog from "../../../src/app/components/Backlog";
import {
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  getUsers,
} from "../../../src/lib/server";

jest.mock("../../../src/lib/server", () => ({
  getTickets: jest.fn(),
  addTicket: jest.fn(),
  updateTicket: jest.fn(),
  deleteTicket: jest.fn(),
  getUsers: jest.fn(),
}));

const mockTickets = [
  {
    id: 1,
    column_name: "Task 1",
    column_tasks: "Description 1",
    status: "Ready",
    email: "user1@example.com",
  },
  {
    id: 2,
    column_name: "Task 2",
    column_tasks: "Description 2",
    status: "In-progress",
    email: "user2@example.com",
  },
];

const mockUsers = [
  { id: 1, first_name: "John", last_name: "Smith", email: "user1@example.com" },
  { id: 2, first_name: "Rick", last_name: "Adam", email: "user2@example.com" },
];

describe("Backlog Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getTickets.mockResolvedValue({ fetched: mockTickets });
    getUsers.mockResolvedValue({ fetched: mockUsers });
    addTicket.mockResolvedValue(mockTickets[0]);
    updateTicket.mockResolvedValue(mockTickets[0]);
    deleteTicket.mockResolvedValue(true);

    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  test("handles error when fetching tickets fails", async () => {
    getTickets.mockRejectedValue(new Error("Failed to fetch tickets"));

    render(<Backlog />);

    await waitFor(() => expect(getTickets).toHaveBeenCalled());

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching tickets or users:",
      expect.any(Error)
    );
  });

  test("shows error when submitting without a title", async () => {
    const { container } = render(<Backlog />);
    await waitFor(() => expect(getTickets).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/loading tickets/i)).not.toBeInTheDocument()
    );

    const form = container.querySelector(".ticket-form");
    const submitButton = screen.getByRole("button", { name: /add ticket/i });

    fireEvent.click(submitButton);

    expect(
      screen.getByText("Please fill in title before submitting.")
    ).toBeInTheDocument();
  });

  test("adds a new ticket when form is submitted", async () => {
    const { container } = render(<Backlog />);
    await waitFor(() => expect(getTickets).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/loading tickets/i)).not.toBeInTheDocument()
    );

    const titleInput = container.querySelector(".Title");
    const tasksInput = container.querySelector(".Tasks");
    const submitButton = screen.getByRole("button", { name: /add ticket/i });

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(tasksInput, { target: { value: "New Description" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(addTicket).toHaveBeenCalled());
    expect(addTicket).toHaveBeenCalledWith(
      expect.objectContaining({
        column_name: "New Task",
        column_tasks: "New Description",
        status: "Ready",
      })
    );
  });

  test("edits an existing ticket", async () => {
    const { container } = render(<Backlog />);
    await waitFor(() => expect(getTickets).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/loading tickets/i)).not.toBeInTheDocument()
    );

    const editButtons = container.querySelectorAll(".green-button");

    fireEvent.click(editButtons[1]);

    const titleInput = container.querySelector(".Title");
    expect(titleInput.value).toBe("Task 1");

    fireEvent.change(titleInput, { target: { value: "Updated Task" } });

    const updateButton = screen.getByRole("button", { name: /update ticket/i });
    fireEvent.click(updateButton);

    await waitFor(() => expect(updateTicket).toHaveBeenCalled());
    expect(updateTicket).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        column_name: "Updated Task",
      })
    );
  });

  test("deletes a ticket and logs success message", async () => {
    const { container } = render(<Backlog />);
    await waitFor(() => expect(getTickets).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/loading tickets/i)).not.toBeInTheDocument()
    );

    const deleteButtons = container.querySelectorAll(".delete-button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(deleteTicket).toHaveBeenCalledWith(1));

    expect(console.log).toHaveBeenCalledWith("delete successful");
  });

  test("toggles sort direction when clicking the same sort button twice", async () => {
    const { container } = render(<Backlog />);
    await waitFor(() => expect(getTickets).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/loading tickets/i)).not.toBeInTheDocument()
    );

    const sortButtons = container.querySelectorAll(".sort-button");
    const titleSortButton = sortButtons[0];

    fireEvent.click(titleSortButton);

    fireEvent.click(titleSortButton);

    expect(titleSortButton.textContent).toContain("Title ↑");
  });

  test("sorts tickets by different fields", async () => {
    const { container } = render(<Backlog />);
    await waitFor(() => expect(getTickets).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/loading tickets/i)).not.toBeInTheDocument()
    );

    const sortButtons = container.querySelectorAll(".sort-button");

    fireEvent.click(sortButtons[0]);

    fireEvent.click(sortButtons[1]);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("filters tickets based on search term", async () => {
    const { container } = render(<Backlog />);
    await waitFor(() => expect(getTickets).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/loading tickets/i)).not.toBeInTheDocument()
    );

    const searchInput = container.querySelector(".search-input");

    fireEvent.change(searchInput, { target: { value: "Task 1" } });

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  test("assigns a user to a ticket", async () => {
    const { container } = render(<Backlog />);
    await waitFor(() => expect(getTickets).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/loading tickets/i)).not.toBeInTheDocument()
    );

    const editButtons = container.querySelectorAll(".green-button");

    fireEvent.click(editButtons[1]);

    const selects = container.querySelectorAll("select");
    const userSelect = selects[1];

    fireEvent.change(userSelect, { target: { value: "user2@example.com" } });

    const updateButton = screen.getByRole("button", { name: /update ticket/i });
    fireEvent.click(updateButton);

    await waitFor(() => expect(updateTicket).toHaveBeenCalled());
    expect(updateTicket).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        email: "user2@example.com",
      })
    );
  });
});
