import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

describe("Backlog Component", () => {
  const mockTickets = [
    {
      id: 1,
      column_name: "Test Ticket 1",
      column_tasks: "Description 1",
      status: "ready",
      email: "user1@example.com",
    },
    {
      id: 2,
      column_name: "Test Ticket 2",
      column_tasks: "Description 2",
      status: "in-progress",
      email: "user2@example.com",
    },
  ];

  const mockUsers = [
    { id: 1, email: "user1@example.com", first_name: "User", last_name: "One" },
    { id: 2, email: "user2@example.com", first_name: "User", last_name: "Two" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getTickets.mockResolvedValue({ fetched: mockTickets });
    getUsers.mockResolvedValue({ fetched: mockUsers });
    console.error = jest.fn();
  });

  test("renders Backlog component with form and tickets", async () => {
    render(<Backlog />);

    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();

    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(1);
      expect(getUsers).toHaveBeenCalledTimes(1);
    });
  });

  test("shows error when submitting form without title", async () => {
    render(<Backlog />);

    fireEvent.click(screen.getByText("Add Ticket"));

    expect(
      screen.getByText("Please fill in title before submitting.")
    ).toBeInTheDocument();
  });

  test("adds a new ticket successfully", async () => {
    const newTicket = {
      column_name: "New Ticket",
      column_tasks: "New Description",
      status: "ready",
      email: "",
    };

    const addedTicket = { ...newTicket, id: 3 };
    addTicket.mockResolvedValue(addedTicket);

    render(<Backlog />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: newTicket.column_name },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: newTicket.column_tasks },
    });

    fireEvent.click(screen.getByText("Add Ticket"));

    await waitFor(() => {
      expect(addTicket).toHaveBeenCalledWith(
        expect.objectContaining(newTicket)
      );
    });

    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(2);
    });
  });

  test("edits an existing ticket", async () => {
    getTickets.mockResolvedValue({ fetched: mockTickets });

    const updatedTicket = {
      id: 1,
      column_name: "Updated Ticket",
      column_tasks: "Updated Description",
      status: "in-progress",
      email: "user1@example.com",
    };

    updateTicket.mockResolvedValue(updatedTicket);

    render(<Backlog />);

    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(1);
    });

    const editButtons = await screen.findAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(screen.getByDisplayValue("Test Ticket 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Description 1")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: updatedTicket.column_name },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: updatedTicket.column_tasks },
    });

    const selectElements = screen.getAllByRole("combobox");
    const statusSelect = selectElements[0];
    fireEvent.change(statusSelect, { target: { value: "in-progress" } });

    fireEvent.click(screen.getByText("Update Ticket"));

    await waitFor(() => {
      expect(updateTicket).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          column_name: updatedTicket.column_name,
          column_tasks: updatedTicket.column_tasks,
          status: updatedTicket.status,
        })
      );
    });
    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(2);
    });
  });

  test("deletes a ticket", async () => {
    deleteTicket.mockResolvedValue(true);

    render(<Backlog />);

    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(1);
    });

    const deleteButtons = await screen.findAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteTicket).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("Test Ticket 1")).not.toBeInTheDocument();
    });
  });

  test("handles failed ticket deletion", async () => {
    deleteTicket.mockResolvedValue(false);
    console.log = jest.fn();

    render(<Backlog />);

    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(1);
    });

    const deleteButtons = await screen.findAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteTicket).toHaveBeenCalledWith(1);
    });

    expect(console.log).not.toHaveBeenCalledWith("delete successful");
  });

  test("handles failed API requests gracefully", async () => {
    getTickets.mockRejectedValue(new Error("API error"));
    getUsers.mockRejectedValue(new Error("API error"));

    render(<Backlog />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });

    expect(getTickets).toHaveBeenCalledTimes(1);
  });

  test("assigns a user to a ticket", async () => {
    render(<Backlog />);

    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(1);
      expect(getUsers).toHaveBeenCalledTimes(1);
    });

    const editButtons = await screen.findAllByText("Edit");
    fireEvent.click(editButtons[0]);

    const userSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(userSelect, { target: { value: "user2@example.com" } });

    expect(userSelect.value).toBe("user2@example.com");
  });

  test("handles empty or invalid responses from API", async () => {
    getTickets.mockResolvedValue({});
    getUsers.mockResolvedValue({});

    render(<Backlog />);

    await waitFor(() => {
      expect(getTickets).toHaveBeenCalledTimes(1);
      expect(getUsers).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText("Test Ticket 1")).not.toBeInTheDocument();
  });

  test("handles non-array user data", async () => {
    getUsers.mockResolvedValue({ fetched: "not an array" });

    render(<Backlog />);

    await waitFor(() => {
      expect(getUsers).toHaveBeenCalledTimes(1);
    });
    const userSelect = screen.getAllByRole("combobox")[1];
    expect(userSelect.children.length).toBe(1);
  });
});
