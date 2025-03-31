import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Users from "../../../src/app/components/Users";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../../src/lib/server";

jest.mock("../../../src/lib/server", () => ({
  getUsers: jest.fn(),
  addUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

describe("Users Component", () => {
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
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test("renders user list after fetching data", async () => {
    getUsers.mockResolvedValueOnce({
      fetched: mockUsers,
    });

    render(<Users />);

    expect(screen.getByText("Loading users...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Users List")).toBeInTheDocument()
    );

    expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument();
    expect(screen.getByText(/Alex@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Leon Kennedy/i)).toBeInTheDocument();
    expect(screen.getByText(/Leon@example\.com/i)).toBeInTheDocument();
  });

  test("adds a new user", async () => {
    getUsers.mockResolvedValueOnce({ fetched: mockUsers });
    addUser.mockResolvedValueOnce({});
    getUsers.mockResolvedValueOnce({
      fetched: [
        ...mockUsers,
        {
          id: 3,
          first_name: "Alex",
          last_name: "Johnson",
          email: "Alex@example.com",
        },
      ],
    });

    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText("Users List")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Alex" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Johnson" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "Alex@example.com" },
    });

    fireEvent.click(screen.getByText("Add User"));

    await waitFor(() =>
      expect(addUser).toHaveBeenCalledWith({
        first_name: "Alex",
        last_name: "Johnson",
        email: "Alex@example.com",
      })
    );

    await waitFor(() => expect(getUsers).toHaveBeenCalledTimes(2));

    await waitFor(() =>
      expect(screen.getByText(/Alex johnson/i)).toBeInTheDocument()
    );
  });

  test("updates a user", async () => {
    getUsers.mockResolvedValueOnce({
      fetched: mockUsers,
    });

    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(screen.getByDisplayValue("Alex")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Godwin")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alex@example.com")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Alexander" },
    });

    updateUser.mockResolvedValueOnce({});

    getUsers.mockResolvedValueOnce({
      fetched: [
        {
          id: 1,
          first_name: "Alexander",
          last_name: "Godwin",
          email: "Alex@example.com",
        },
        mockUsers[1],
      ],
    });

    fireEvent.click(screen.getByText("Update User"));

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          first_name: "Alexander",
          last_name: "Godwin",
          email: "Alex@example.com",
        })
      )
    );

    await waitFor(() => expect(getUsers).toHaveBeenCalledTimes(2));

    await waitFor(() =>
      expect(screen.getByText(/Alexander Godwin/i)).toBeInTheDocument()
    );
  });

  test("deletes a user", async () => {
    getUsers.mockResolvedValueOnce({
      fetched: mockUsers,
    });

    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    deleteUser.mockResolvedValueOnce({});

    getUsers.mockResolvedValueOnce({
      fetched: [mockUsers[1]],
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith(1));

    await waitFor(() => expect(getUsers).toHaveBeenCalledTimes(2));

    await waitFor(() =>
      expect(screen.queryByText(/Alex Godwin/i)).not.toBeInTheDocument()
    );
  });

  test("shows error message when users fail to load", async () => {
    getUsers.mockRejectedValueOnce(new Error("Failed to fetch users"));

    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/failed to load users/i)).toBeInTheDocument()
    );
  });

  test("handles error when adding a user", async () => {
    getUsers.mockResolvedValueOnce({ fetched: mockUsers });

    addUser.mockRejectedValueOnce(new Error("Failed to add user"));

    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText("Users List")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error adding user:",
        expect.any(Error)
      );
      expect(screen.getByText("Failed to add user")).toBeInTheDocument();
    });
  });

  test("handles error when updating a user", async () => {
    getUsers.mockResolvedValueOnce({ fetched: mockUsers });

    updateUser.mockRejectedValueOnce(new Error("Failed to update user"));

    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    fireEvent.click(screen.getByText("Update User"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error updating user:",
        expect.any(Error)
      );
      expect(screen.getByText("Failed to update user")).toBeInTheDocument();
    });
  });

  test("handles error when deleting a user", async () => {
    getUsers.mockResolvedValueOnce({ fetched: mockUsers });

    deleteUser.mockRejectedValueOnce(new Error("Failed to delete user"));

    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting user:",
        expect.any(Error)
      );
      expect(screen.getByText("Failed to delete user")).toBeInTheDocument();
    });
  });
});
