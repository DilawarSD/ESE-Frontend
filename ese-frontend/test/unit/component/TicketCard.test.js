import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TicketCard from "../../../src/app/components/TicketCard";

describe("TicketCard Component", () => {
  let handleDragStartMock,
    handleDragEndMock,
    handleEditTicketMock,
    handleDeleteTicketMock;

  const ticket = {
    id: 1,
    column_name: "Title task",
    column_tasks: "Task description",
    email: "Leon@example.com",
  };

  const users = [
    { email: "Alex@example.com", first_name: "Alex", last_name: "godwin" },
    { email: "Leon@example.com", first_name: "Leon", last_name: "Kennedy" },
  ];

  beforeEach(() => {
    handleDragStartMock = jest.fn();
    handleDragEndMock = jest.fn();
    handleEditTicketMock = jest.fn();
    handleDeleteTicketMock = jest.fn();
  });

  test("renders ticket details correctly", () => {
    render(
      <TicketCard
        ticket={ticket}
        users={users}
        handleDragStart={handleDragStartMock}
        handleDragEnd={handleDragEndMock}
        handleEditTicket={handleEditTicketMock}
        handleDeleteTicket={handleDeleteTicketMock}
      />
    );

    expect(screen.getByText(/Title task/i)).toBeInTheDocument();
    expect(screen.getByText(/Task description/i)).toBeInTheDocument();
    expect(screen.getByText(/Assigned to: Leon Kennedy/i)).toBeInTheDocument();
  });

  test("renders 'Unassigned' if no user is assigned to the ticket", () => {
    const unassignedTicket = {
      ...ticket,
      email: "",
    };

    render(
      <TicketCard
        ticket={unassignedTicket}
        users={users}
        handleDragStart={handleDragStartMock}
        handleDragEnd={handleDragEndMock}
        handleEditTicket={handleEditTicketMock}
        handleDeleteTicket={handleDeleteTicketMock}
      />
    );

    expect(screen.getByText(/Assigned to: Unassigned/i)).toBeInTheDocument();
  });

  test("calls handleEditTicket when Edit button is clicked", () => {
    render(
      <TicketCard
        ticket={ticket}
        users={users}
        handleDragStart={handleDragStartMock}
        handleDragEnd={handleDragEndMock}
        handleEditTicket={handleEditTicketMock}
        handleDeleteTicket={handleDeleteTicketMock}
      />
    );

    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);

    expect(handleEditTicketMock).toHaveBeenCalledWith(ticket);
  });

  test("calls handleDeleteTicket when Delete button is clicked", () => {
    render(
      <TicketCard
        ticket={ticket}
        users={users}
        handleDragStart={handleDragStartMock}
        handleDragEnd={handleDragEndMock}
        handleEditTicket={handleEditTicketMock}
        handleDeleteTicket={handleDeleteTicketMock}
      />
    );

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    expect(handleDeleteTicketMock).toHaveBeenCalledWith(ticket.id);
  });

  test("calls handleDragStart when the ticket is dragged", () => {
    render(
      <TicketCard
        ticket={ticket}
        users={users}
        handleDragStart={handleDragStartMock}
        handleDragEnd={handleDragEndMock}
        handleEditTicket={handleEditTicketMock}
        handleDeleteTicket={handleDeleteTicketMock}
      />
    );

    const ticketCard = screen.getByText(/Title task/i).closest("div");

    fireEvent.dragStart(ticketCard);
    expect(handleDragStartMock).toHaveBeenCalledWith(expect.anything(), ticket);

    fireEvent.dragEnd(ticketCard);
    expect(handleDragEndMock).toHaveBeenCalled();
  });
});
