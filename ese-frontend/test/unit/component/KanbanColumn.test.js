import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import KanbanColumn from "../../../src/app/components/KanbanColumn"; // Adjust the import path

describe("KanbanColumn Component", () => {
  let handleDragOverMock,
    handleDropMock,
    handleDragStartMock,
    handleDragEndMock;
  let handleEditTicketMock, handleDeleteTicketMock;

  const users = [
    { email: "Alex@example.com", first_name: "Alex", last_name: "godwin" },
    { email: "Leon@example.com", first_name: "Leon", last_name: "Kennedy" },
  ];

  const tickets = [
    {
      id: 1,
      column_name: "Title 1",
      column_tasks: "Task 1",
      email: "Alex@example.com",
    },
    {
      id: 2,
      column_name: "Title 2",
      column_tasks: "Task 2",
      email: "Alex@example.com",
    },
  ];

  const status = "ready";

  beforeEach(() => {
    handleDragOverMock = jest.fn();
    handleDropMock = jest.fn();
    handleDragStartMock = jest.fn();
    handleDragEndMock = jest.fn();
    handleEditTicketMock = jest.fn();
    handleDeleteTicketMock = jest.fn();
  });

  test("renders KanbanColumn with the correct status title", () => {
    render(
      <KanbanColumn
        status={status}
        tickets={tickets}
        users={users}
        handleDragOver={handleDragOverMock}
        handleDrop={handleDropMock}
        handleDragStart={handleDragStartMock}
        handleDragEnd={handleDragEndMock}
        handleEditTicket={handleEditTicketMock}
        handleDeleteTicket={handleDeleteTicketMock}
      />
    );

    // Verify the status title is correctly displayed
    expect(screen.getByText("Title 1")).toBeInTheDocument();
  });

  test("calls handleDragOver when the column is dragged over", () => {
    render(
      <KanbanColumn
        status={status}
        tickets={tickets}
        users={users}
        handleDragOver={handleDragOverMock}
        handleDrop={handleDropMock}
        handleDragStart={handleDragStartMock}
        handleDragEnd={handleDragEndMock}
        handleEditTicket={handleEditTicketMock}
        handleDeleteTicket={handleDeleteTicketMock}
      />
    );

    const kanbanColumn = screen.getByText("Title 1").closest("div");
    fireEvent.dragOver(kanbanColumn);
    expect(handleDragOverMock).toHaveBeenCalled();
  });

  test("calls handleDrop when the column is dropped on", () => {
    render(
      <KanbanColumn
        status={status}
        tickets={tickets}
        users={users}
        handleDragOver={handleDragOverMock}
        handleDrop={handleDropMock}
        handleDragStart={handleDragStartMock}
        handleDragEnd={handleDragEndMock}
        handleEditTicket={handleEditTicketMock}
        handleDeleteTicket={handleDeleteTicketMock}
      />
    );

    const kanbanColumn = screen.getByText("Title 1").closest("div");
    fireEvent.drop(kanbanColumn);
    expect(handleDropMock).toHaveBeenCalledWith(expect.anything(), status);
  });
});
