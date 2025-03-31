import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../../../src/app/components/Dashboard";
import { supabase } from "../../../src/lib/supabaseClient";

jest.mock("../../../src/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe("Dashboard Component", () => {
  let user;

  beforeEach(() => {
    user = {
      email: "testuser@example.com",
    };

    supabase.auth.getUser.mockResolvedValue({
      data: { user },
    });

    delete window.location;
    window.location = { href: "" };
  });

  test("renders loading state when no user is found", async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
    });

    render(<Dashboard />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders the user email and buttons when the user is logged in", async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText("Welcome, testuser@example.com!"));

    expect(
      screen.getByText("Welcome, testuser@example.com!")
    ).toBeInTheDocument();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Create Tickets")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  test("handles navigateToHome button click", async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText("Welcome, testuser@example.com!"));

    fireEvent.click(screen.getByText("Home"));

    expect(window.location.href).toBe("/home");
  });

  test("handles navigateToCreateTickets button click", async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText("Welcome, testuser@example.com!"));

    fireEvent.click(screen.getByText("Create Tickets"));

    expect(window.location.href).toBe("/taskmanagement");
  });

  test("handles navigateToUser button click", async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText("Welcome, testuser@example.com!"));

    fireEvent.click(screen.getByText("Users"));

    expect(window.location.href).toBe("/user");
  });

  test("handles sign out button click", async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText("Welcome, testuser@example.com!"));

    fireEvent.click(screen.getByText("Sign Out"));

    expect(supabase.auth.signOut).toHaveBeenCalled();

    expect(window.location.href).toBe("");
  });
});
