import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BacklogItem from "../../../src/app/components/BacklogItem"; // Adjust the import according to the file location

describe("BacklogItem Component", () => {
  let mockHandleEditTicket;
  let mockHandleDeleteTicket;
  const ticket = {
    id: 1,
    column_name: "To Do",
    column_tasks: "Finish the project",
    status: "Open",
    email: "user@example.com",
  };
  const users = [
    { email: "user@example.com", first_name: "John", last_name: "Doe" },
    {
      email: "anotheruser@example.com",
      first_name: "Jane",
      last_name: "Smith",
    },
  ];

  beforeEach(() => {
    mockHandleEditTicket = jest.fn();
    mockHandleDeleteTicket = jest.fn();
  });

  test("renders ticket details correctly", () => {
    render(
      <BacklogItem
        ticket={ticket}
        users={users}
        handleEditTicket={mockHandleEditTicket}
        handleDeleteTicket={mockHandleDeleteTicket}
      />
    );

    expect(screen.getByText(ticket.column_name)).toBeInTheDocument();
    expect(screen.getByText(ticket.column_tasks)).toBeInTheDocument();
    expect(screen.getByText(`Status: ${ticket.status}`)).toBeInTheDocument();
    expect(screen.getByText(`Assigned User: John Doe`)).toBeInTheDocument();
  });

  test('displays "Unassigned" if no user is assigned', () => {
    const unassignedTicket = { ...ticket, email: "notassigned@example.com" };

    render(
      <BacklogItem
        ticket={unassignedTicket}
        users={users}
        handleEditTicket={mockHandleEditTicket}
        handleDeleteTicket={mockHandleDeleteTicket}
      />
    );

    expect(screen.getByText("Assigned User: Unassigned")).toBeInTheDocument();
  });

  test("calls handleEditTicket when Edit button is clicked", () => {
    render(
      <BacklogItem
        ticket={ticket}
        users={users}
        handleEditTicket={mockHandleEditTicket}
        handleDeleteTicket={mockHandleDeleteTicket}
      />
    );

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(mockHandleEditTicket).toHaveBeenCalledWith(ticket);
  });

  test("calls handleDeleteTicket when Delete button is clicked", () => {
    render(
      <BacklogItem
        ticket={ticket}
        users={users}
        handleEditTicket={mockHandleEditTicket}
        handleDeleteTicket={mockHandleDeleteTicket}
      />
    );

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(mockHandleDeleteTicket).toHaveBeenCalledWith(ticket.id);
  });
});
