import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import UserList from "../../../src/app/components/UserList"; // Adjust path if needed

describe("UserList Component", () => {
  let handleEditUserMock, handleDeleteUserMock;

  beforeEach(() => {
    handleEditUserMock = jest.fn();
    handleDeleteUserMock = jest.fn();
  });

  test("renders 'No users found' when user list is empty", () => {
    render(
      <UserList
        users={[]}
        handleEditUser={handleEditUserMock}
        handleDeleteUser={handleDeleteUserMock}
      />
    );

    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  test("renders a list of users correctly", () => {
    const users = [
      {
        id: 1,
        first_name: "Alex",
        last_name: "godwin",
        email: "Alex@example.com",
      },
      {
        id: 2,
        first_name: "Leon",
        last_name: "Kennedy",
        email: "Leon@example.com",
      },
    ];

    render(
      <UserList
        users={users}
        handleEditUser={handleEditUserMock}
        handleDeleteUser={handleDeleteUserMock}
      />
    );

    // Find all list items
    const listItems = screen.getAllByRole("listitem");

    // Verify content inside each list item using `within()`
    expect(within(listItems[0]).getByText(/Alex godwin/i)).toBeInTheDocument();
    expect(
      within(listItems[0]).getByText(/Alex@example.com/i)
    ).toBeInTheDocument();

    expect(within(listItems[1]).getByText(/Leon kennedy/i)).toBeInTheDocument();
    expect(
      within(listItems[1]).getByText(/leon@example.com/i)
    ).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: /Edit/i })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /Delete/i })).toHaveLength(2);
  });

  test("calls handleEditUser when 'Edit' button is clicked", () => {
    const users = [
      {
        id: 1,
        first_name: "Alex",
        last_name: "godwin",
        email: "Alex@example.com",
      },
    ];

    render(
      <UserList
        users={users}
        handleEditUser={handleEditUserMock}
        handleDeleteUser={handleDeleteUserMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    expect(handleEditUserMock).toHaveBeenCalledTimes(1);
    expect(handleEditUserMock).toHaveBeenCalledWith(users[0]);
  });

  test("calls handleDeleteUser when 'Delete' button is clicked", () => {
    const users = [
      {
        id: 1,
        first_name: "Alex",
        last_name: "godwin",
        email: "Alex@example.com",
      },
    ];

    render(
      <UserList
        users={users}
        handleEditUser={handleEditUserMock}
        handleDeleteUser={handleDeleteUserMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    expect(handleDeleteUserMock).toHaveBeenCalledTimes(1);
    expect(handleDeleteUserMock).toHaveBeenCalledWith(1);
  });
});
