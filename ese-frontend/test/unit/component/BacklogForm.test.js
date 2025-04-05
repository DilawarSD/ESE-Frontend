import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BacklogForm from "../../../src/app/components/BacklogForm";

describe("BacklogForm Component", () => {
  let mockSetNewTicket;
  let mockHandleTicketSubmit;
  let mockHandleAssignUser;
  const users = [
    {
      id: 1,
      email: "user1@example.com",
      first_name: "Tom",
      last_name: "Riddle",
    },
    {
      id: 2,
      email: "user2@example.com",
      first_name: "Matt",
      last_name: "Smith",
    },
  ];

  const newTicket = {
    id: 1,
    column_name: "Test Ticket",
    column_tasks: "Task description",
    status: "Ready",
    email: "",
  };

  beforeEach(() => {
    mockSetNewTicket = jest.fn();
    mockHandleTicketSubmit = jest.fn((e) => e.preventDefault());
    mockHandleAssignUser = jest.fn();
  });

  test("renders form with the correct initial values", () => {
    render(
      <BacklogForm
        newTicket={newTicket}
        setNewTicket={mockSetNewTicket}
        handleTicketSubmit={mockHandleTicketSubmit}
        users={users}
        handleAssignUser={mockHandleAssignUser}
        error={null}
        editingTicket={false}
      />
    );

    // Check if input fields and options are rendered correctly
    expect(screen.getByPlaceholderText("Title")).toHaveValue(
      newTicket.column_name
    );
    expect(screen.getByPlaceholderText("Description")).toHaveValue(
      newTicket.column_tasks
    );
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByText("Assign User")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add ticket/i })
    ).toBeInTheDocument();
  });

  test("updates state when the title and description fields change", () => {
    render(
      <BacklogForm
        newTicket={newTicket}
        setNewTicket={mockSetNewTicket}
        handleTicketSubmit={mockHandleTicketSubmit}
        users={users}
        handleAssignUser={mockHandleAssignUser}
        error={null}
        editingTicket={false}
      />
    );

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionInput = screen.getByPlaceholderText("Description");

    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Updated Description" },
    });

    expect(mockSetNewTicket).toHaveBeenCalledWith({
      ...newTicket,
      column_name: "Updated Title",
    });

    expect(mockSetNewTicket).toHaveBeenCalledWith({
      ...newTicket,
      column_tasks: "Updated Description",
    });
  });

  test("displays an error message if error prop is provided", () => {
    const errorMessage = "There was an error creating the ticket.";
    render(
      <BacklogForm
        newTicket={newTicket}
        setNewTicket={mockSetNewTicket}
        handleTicketSubmit={mockHandleTicketSubmit}
        users={users}
        handleAssignUser={mockHandleAssignUser}
        error={errorMessage}
        editingTicket={false}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("renders with editing ticket mode and update button", () => {
    render(
      <BacklogForm
        newTicket={newTicket}
        setNewTicket={mockSetNewTicket}
        handleTicketSubmit={mockHandleTicketSubmit}
        users={users}
        handleAssignUser={mockHandleAssignUser}
        error={null}
        editingTicket={true}
      />
    );

    expect(
      screen.getByRole("button", { name: /update ticket/i })
    ).toBeInTheDocument();
  });
});
