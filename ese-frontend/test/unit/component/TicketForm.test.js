import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TicketForm from "../../../src/app/components/TicketForm";

describe("TicketForm", () => {
  let setNewTicketMock;
  let handleTicketSubmitMock;
  const mockUsers = [
    {
      id: 1,
      first_name: "Alex",
      last_name: "Godwin",
      email: "Alex@example.com",
    },
    {
      id: 2,
      first_name: "Leon",
      last_name: "Kennedy",
      email: "Leon@example.com",
    },
  ];

  beforeEach(() => {
    setNewTicketMock = jest.fn();
    handleTicketSubmitMock = jest.fn();
  });

  const renderComponent = (newTicket = {}) => {
    render(
      <TicketForm
        newTicket={newTicket}
        setNewTicket={setNewTicketMock}
        users={mockUsers}
        handleTicketSubmit={handleTicketSubmitMock}
        error={null}
      />
    );
  };

  it("renders the form with correct initial values", () => {
    const newTicket = {
      column_name: "Test Title",
      column_tasks: "Test Task",
      status: "ready",
      email: "",
    };

    renderComponent(newTicket);

    expect(screen.getByPlaceholderText("Title")).toHaveValue("Test Title");
    expect(screen.getByPlaceholderText("Tasks")).toHaveValue("Test Task");

    const statusSelect = screen.getByRole("combobox", { name: /status/i });
    expect(statusSelect.value).toBe("Ready");

    expect(screen.getByText("Assign User")).toBeInTheDocument();
  });

  it("allows the user to update inputs and calls setNewTicket on change", async () => {
    const newTicket = {
      column_name: "",
      column_tasks: "",
      status: "Ready",
      email: "",
    };

    renderComponent(newTicket);

    const titleInput = screen.getByPlaceholderText("Title");
    const tasksInput = screen.getByPlaceholderText("Tasks");
    const statusSelect = screen.getByRole("combobox", { name: /status/i });
    const userSelect = screen.getByText("Assign User");

    fireEvent.change(titleInput, { target: { value: "New Ticket Title" } });
    fireEvent.change(tasksInput, { target: { value: "New Task" } });

    fireEvent.change(statusSelect, { target: { value: "In-progress" } });
    fireEvent.change(userSelect, {
      target: { value: "Alex@example.com" },
    });

    expect(setNewTicketMock).toHaveBeenCalledWith({
      column_name: "",
      column_tasks: "",
      status: "In-progress",
      email: "",
    });
  });

  it("submits the form and calls handleTicketSubmit with correct data", () => {
    const newTicket = {
      column_name: "Ticket Title",
      column_tasks: "Ticket Task",
      status: "Ready",
      email: "Alex@example.com",
    };

    renderComponent(newTicket);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(handleTicketSubmitMock).toHaveBeenCalledWith(
      expect.anything(),
      newTicket
    );
  });

  it("displays an error message when there is an error", () => {
    const errorMessage = "An error occurred!";
    const newTicket = {
      column_name: "",
      column_tasks: "",
      status: "Ready",
      email: "",
    };

    render(
      <TicketForm
        newTicket={newTicket}
        setNewTicket={setNewTicketMock}
        users={mockUsers}
        handleTicketSubmit={handleTicketSubmitMock}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
