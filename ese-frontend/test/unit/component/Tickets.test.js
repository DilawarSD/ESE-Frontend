import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Ticket from "../../../src/app/components/Tickets";

describe("Ticket Component", () => {
  const tickets = [
    {
      id: 1,
      column_name: "Unit test",
      column_tasks: "Complete unit tests",
      status: "In Progress",
      email: "Alex@example.com",
    },
    {
      id: 2,
      column_name: "Bugs",
      column_tasks: "Fix bugs",
      status: "In Progress",
      email: "Leon@example.com",
    },
  ];

  const users = [
    { email: "Alex@example.com", first_name: "Alex", last_name: "godwin" },
    { email: "Leon@example.com", first_name: "Leon", last_name: "Kennedy" },
  ];

  const handleEditTicket = jest.fn();
  const handleDeleteTicket = jest.fn();

  test("renders ticket details correctly", () => {
    render(
      <Ticket
        tickets={tickets}
        users={users}
        handleEditTicket={handleEditTicket}
        handleDeleteTicket={handleDeleteTicket}
      />
    );

    expect(screen.getByText("Unit test")).toBeInTheDocument();
    expect(screen.getByText("Complete unit tests")).toBeInTheDocument();
    expect(screen.getAllByText("Status: In Progress")[0]).toBeInTheDocument();
    expect(screen.getByText("Assigned User: Alex godwin")).toBeInTheDocument();

    expect(screen.getByText("Bugs")).toBeInTheDocument();
    expect(screen.getByText("Fix bugs")).toBeInTheDocument();
    expect(screen.getAllByText("Status: In Progress")[1]).toBeInTheDocument();
    expect(screen.getByText("Assigned User: Leon Kennedy")).toBeInTheDocument();
  });

  test("renders 'Not assigned' if no user matches the ticket's email", () => {
    const ticketsWithNoUser = [
      {
        id: 1,
        column_name: "Unit",
        column_tasks: "Complete unit tests",
        status: "In Progress",
        email: "user3@example.com",
      },
    ];

    render(
      <Ticket
        tickets={ticketsWithNoUser}
        users={users}
        handleEditTicket={handleEditTicket}
        handleDeleteTicket={handleDeleteTicket}
      />
    );

    expect(screen.getByText("Assigned User: Not assigned")).toBeInTheDocument();
  });

  test("calls handleEditTicket when Edit button is clicked", () => {
    render(
      <Ticket
        tickets={tickets}
        users={users}
        handleEditTicket={handleEditTicket}
        handleDeleteTicket={handleDeleteTicket}
      />
    );

    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);

    expect(handleEditTicket).toHaveBeenCalledWith(tickets[0]);
  });

  test("calls handleDeleteTicket when Delete button is clicked", () => {
    render(
      <Ticket
        tickets={tickets}
        users={users}
        handleEditTicket={handleEditTicket}
        handleDeleteTicket={handleDeleteTicket}
      />
    );

    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    expect(handleDeleteTicket).toHaveBeenCalledWith(tickets[0].id);
  });
});
