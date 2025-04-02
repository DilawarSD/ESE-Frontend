import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../../../src/app/components/KanbanBoard";
import {
  getTickets,
  updateTicket,
  deleteTicket,
  getUsers,
} from "../../../src/lib/server";

jest.mock("../../../src/lib/server", () => ({
  getTickets: jest.fn(),
  updateTicket: jest.fn(),
  deleteTicket: jest.fn(),
  getUsers: jest.fn(),
}));

const mockTickets = [
  {
    id: 1,
    title: "Ticket 1",
    status: "Ready",
    column_name: "Ready Column",
    assignee_id: 1,
  },
  {
    id: 2,
    title: "Ticket 2",
    status: "In-progress",
    column_name: "In Progress Column",
    assignee_id: 2,
  },
  {
    id: 3,
    title: "Ticket 3",
    status: "Done",
    column_name: "Done Column",
    assignee_id: 1,
  },
];

const mockUsers = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
];

describe("KanbanBoard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getTickets.mockResolvedValue({ fetched: mockTickets });
    getUsers.mockResolvedValue({ fetched: mockUsers });
  });

  test("renders the kanban board with correct title", async () => {
    render(<Board />);
    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(1);
      expect(getUsers).toHaveBeenCalledTimes(1);
    });
  });

  test("renders all three columns", async () => {
    render(<Board />);
    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
      expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
    });
  });

  test("displays tickets in the correct columns", async () => {
    render(<Board />);
    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
      expect(screen.getByText("In Progress Column")).toBeInTheDocument();
      expect(screen.getByText("Done Column")).toBeInTheDocument();
    });
  });

  test("opens edit modal when edit button is clicked", async () => {
    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(screen.getByText("X")).toBeInTheDocument();
  });

  test("closes edit modal when close button is clicked", async () => {
    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const closeButton = screen.getByText("X");
    fireEvent.click(closeButton);

    expect(screen.queryByText("X")).not.toBeInTheDocument();
  });

  test("deletes a ticket when delete button is clicked", async () => {
    deleteTicket.mockResolvedValue(true);

    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(deleteTicket).toHaveBeenCalledWith(1);
  });

  test("updates a ticket when form is submitted", async () => {
    updateTicket.mockResolvedValue({
      id: 1,
      title: "Updated Ticket",
      status: "ready",
      column_name: "Updated Column",
      assignee_id: 2,
    });

    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const titleInput = screen.getByPlaceholderText(/title/i);
    fireEvent.change(titleInput, { target: { value: "Updated Column" } });

    const submitButton = screen.getByRole("button", { name: /update ticket/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateTicket).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          column_name: "Updated Column",
        })
      );
    });
  });

  test("shows error when submitting form with empty title", async () => {
    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const titleInput = screen.getByPlaceholderText(/title/i);
    fireEvent.change(titleInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", { name: /update ticket/i });
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Please fill in the title before submitting.")
    ).toBeInTheDocument();
  });

  test("handles drag and drop to change ticket status", async () => {
    updateTicket.mockResolvedValue({
      id: 1,
      title: "Ticket 1",
      status: "in-progress",
      column_name: "Ready Column",
      assignee_id: 1,
    });

    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
    });

    const ticket = screen
      .getByText("Ready Column")
      .closest('[draggable="true"]');
    const inProgressColumn = screen
      .getByText("IN PROGRESS")
      .closest(".kanban-column");

    const dataTransfer = {
      setData: jest.fn(),
      getData: jest.fn().mockReturnValue("1"),
      clearData: jest.fn(),
      effectAllowed: null,
      dropEffect: null,
      types: [],
      files: [],
      items: [],
    };

    fireEvent.dragStart(ticket, { dataTransfer });

    fireEvent.dragOver(inProgressColumn, { dataTransfer });

    fireEvent.drop(inProgressColumn, { dataTransfer });

    await waitFor(() => {
      expect(updateTicket).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          status: "in-progress",
        })
      );
    });
  });

  test("handles API error when fetching tickets", async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    getTickets.mockRejectedValue(new Error("API Error"));

    render(<Board />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching data:",
        expect.any(Error)
      );
    });

    console.error = originalConsoleError;
  });

  test("handles API error when updating ticket", async () => {
    updateTicket.mockRejectedValue(new Error("Update Error"));

    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText("Ready Column")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const submitButton = screen.getByRole("button", { name: /update ticket/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred while updating the ticket.")
      ).toBeInTheDocument();
    });
  });
});
