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

    getUsers.mockResolvedValue({ fetched: mockUsers });
    addUser.mockResolvedValue({ success: true });
    updateUser.mockResolvedValue({ success: true });
    deleteUser.mockResolvedValue({ success: true });
  });

  test("renders user list after fetching data", async () => {
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
  });

  test("updates a user", async () => {
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
  });

  test("deletes a user", async () => {
    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith(1));

    await waitFor(() => expect(getUsers).toHaveBeenCalledTimes(2));
  });

  test("shows error message when users fail to load", async () => {
    getUsers.mockRejectedValueOnce(new Error("Failed to fetch users"));

    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Failed to load users/i)).toBeInTheDocument()
    );
  });

  test("filters users based on search term", async () => {
    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    const searchInput = screen.getByPlaceholderText("Search users...");

    fireEvent.change(searchInput, { target: { value: "Alex" } });

    expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument();
    expect(screen.queryByText(/Leon Kennedy/i)).not.toBeInTheDocument();
  });

  test("sorts users by first name", async () => {
    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    const sortButtons = screen.getAllByText((content, element) => {
      return (
        element.tagName.toLowerCase() === "button" &&
        content.includes("First Name")
      );
    });

    fireEvent.click(sortButtons[0]);

    expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument();
    expect(screen.getByText(/Leon Kennedy/i)).toBeInTheDocument();
  });

  test("toggles sort direction when clicking the same sort button twice", async () => {
    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    const sortButtons = screen.getAllByText((content, element) => {
      return (
        element.tagName.toLowerCase() === "button" &&
        content.includes("First Name")
      );
    });

    fireEvent.click(sortButtons[0]);

    fireEvent.click(sortButtons[0]);

    expect(sortButtons[0].textContent).toContain("First Name ↑");
  });

  test("cancels editing by selecting a different user", async () => {
    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText(/Alex Godwin/i)).toBeInTheDocument()
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(screen.getByDisplayValue("Alex")).toBeInTheDocument();

    fireEvent.click(editButtons[1]);

    expect(screen.getByDisplayValue("Leon")).toBeInTheDocument();
  });

  test("clears form after successful user addition", async () => {
    render(<Users />);

    await waitFor(() =>
      expect(screen.getByText("Users List")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "New" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "new@example.com" },
    });

    fireEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      const firstNameInput = screen.getByPlaceholderText("First Name");
      expect(firstNameInput.value).toBe("");
    });
  });
});
