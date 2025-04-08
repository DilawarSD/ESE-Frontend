import React from "react";
import { render, screen } from "@testing-library/react";
import BacklogList from "../../../src/app/components/BacklogList";
import Tickets from "../../../src/app/components/Tickets";

jest.mock("../../../src/app/components/Tickets", () =>
  jest.fn(() => <div data-testid="tickets-component" />)
);

describe("BacklogList", () => {
  const mockTickets = [
    { id: 1, title: "Fix login bug", assigneeId: 2 },
    { id: 2, title: "Update UI", assigneeId: 1 },
  ];
  const mockUsers = [
    { id: 1, name: "Tom Riddle" },
    { id: 2, name: "Leon Kennedy" },
  ];
  const mockHandleEdit = jest.fn();
  const mockHandleDelete = jest.fn();

  it("renders the Tickets component with correct props", () => {
    render(
      <BacklogList
        tickets={mockTickets}
        users={mockUsers}
        handleEditTicket={mockHandleEdit}
        handleDeleteTicket={mockHandleDelete}
      />
    );

    expect(screen.getByTestId("tickets-component")).toBeInTheDocument();
    expect(Tickets).toHaveBeenCalledWith(
      {
        tickets: mockTickets,
        users: mockUsers,
        handleEditTicket: mockHandleEdit,
        handleDeleteTicket: mockHandleDelete,
      },
      undefined
    );
  });
});
