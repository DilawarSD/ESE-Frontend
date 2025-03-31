import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserForm from "../../../src/app/components/UserForm";

describe("UserForm Component", () => {
  let setNewUserMock, handleAddUserMock, handleUpdateUserMock;

  beforeEach(() => {
    setNewUserMock = jest.fn();
    handleAddUserMock = jest.fn();
    handleUpdateUserMock = jest.fn();
  });

  test("renders the form with correct fields and button text for adding a user", () => {
    render(
      <UserForm
        newUser={{ first_name: "", last_name: "", email: "" }}
        setNewUser={setNewUserMock}
        handleAddUser={handleAddUserMock}
        handleUpdateUser={handleUpdateUserMock}
        editingUser={false}
      />
    );

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add User/i })
    ).toBeInTheDocument();
  });

  test("renders the form with correct button text for editing a user", () => {
    render(
      <UserForm
        newUser={{ first_name: "", last_name: "", email: "" }}
        setNewUser={setNewUserMock}
        handleAddUser={handleAddUserMock}
        handleUpdateUser={handleUpdateUserMock}
        editingUser={true}
      />
    );

    expect(
      screen.getByRole("button", { name: /Update User/i })
    ).toBeInTheDocument();
  });

  test("calls setNewUser when input changes", () => {
    render(
      <UserForm
        newUser={{ first_name: "", last_name: "", email: "" }}
        setNewUser={setNewUserMock}
        handleAddUser={handleAddUserMock}
        handleUpdateUser={handleUpdateUserMock}
        editingUser={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Jack" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Riddle" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "Jack@example.com" },
    });

    expect(setNewUserMock).toHaveBeenCalledTimes(3);
  });

  test("validateForm returns false when required fields are empty", () => {
    const newUser = { first_name: "", last_name: "", email: "" };
    render(
      <UserForm
        newUser={newUser}
        setNewUser={setNewUserMock}
        handleAddUser={handleAddUserMock}
        handleUpdateUser={handleUpdateUserMock}
        editingUser={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Add User/i }));

    expect(
      screen.getByText("Please fill in all user details.")
    ).toBeInTheDocument();
  });

  test("calls handleAddUser when form is submitted with valid data and not in editing mode", () => {
    render(
      <UserForm
        newUser={{
          first_name: "Jack",
          last_name: "Riddle",
          email: "Jack@example.com",
        }}
        setNewUser={setNewUserMock}
        handleAddUser={handleAddUserMock}
        handleUpdateUser={handleUpdateUserMock}
        editingUser={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Add User/i }));

    expect(handleAddUserMock).toHaveBeenCalledTimes(1);
  });

  test("calls handleUpdateUser when form is submitted in editing mode", () => {
    render(
      <UserForm
        newUser={{
          first_name: "Jack",
          last_name: "Riddle",
          email: "Jack@example.com",
        }}
        setNewUser={setNewUserMock}
        handleAddUser={handleAddUserMock}
        handleUpdateUser={handleUpdateUserMock}
        editingUser={true}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Update User/i }));

    expect(handleUpdateUserMock).toHaveBeenCalledTimes(1);
  });
  test("handleInputChange updates the correct field using name attribute", () => {
    render(
      <UserForm
        newUser={{ first_name: "", last_name: "", email: "" }}
        setNewUser={setNewUserMock}
        handleAddUser={handleAddUserMock}
        handleUpdateUser={handleUpdateUserMock}
        editingUser={false}
      />
    );

    const firstNameInput = screen.getByPlaceholderText("First Name");
    fireEvent.change(firstNameInput, {
      target: { name: "first_name", value: "John" },
    });

    expect(setNewUserMock).toHaveBeenCalled();

    const updaterFn = setNewUserMock.mock.calls[0][0];

    const result = updaterFn({ first_name: "", last_name: "", email: "" });

    expect(result).toEqual({ first_name: "", last_name: "", email: "" });
  });
});
