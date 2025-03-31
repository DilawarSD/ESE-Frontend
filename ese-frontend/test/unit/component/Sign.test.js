import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Auth from "../../../src/app/components/Sign";
import { supabase } from "../../../src/lib/supabaseClient";

jest.mock("../../../src/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
}));

const originalLocation = window.location;
beforeEach(() => {
  delete window.location;
  window.location = { href: "" };
});
afterEach(() => {
  window.location = originalLocation;
});

describe("Auth Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders sign in form by default", () => {
    render(<Auth />);

    expect(screen.getByRole("heading")).toHaveTextContent("Sign In");
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  test("toggles between sign in and sign up modes", () => {
    render(<Auth />);

    expect(screen.getByRole("heading")).toHaveTextContent("Sign In");

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByRole("heading")).toHaveTextContent("Sign Up");
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(screen.getByRole("heading")).toHaveTextContent("Sign In");
  });

  test("updates email and password fields on input", () => {
    render(<Auth />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("handles sign in submission successfully", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: {},
      error: null,
    });

    render(<Auth />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(screen.getByText("Signed in successfully!")).toBeInTheDocument();
      expect(window.location.href).toBe("/home");
    });
  });

  test("handles sign in error", async () => {
    const errorMessage = "Invalid login credentials";
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    render(<Auth />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong-password" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(window.location.href).not.toBe("/home");
    });
  });

  test("handles sign up submission successfully", async () => {
    supabase.auth.signUp.mockResolvedValue({ data: {}, error: null });

    render(<Auth />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "newpassword123",
      });
      expect(
        screen.getByText("Check your email for confirmation!")
      ).toBeInTheDocument();
      expect(window.location.href).not.toBe("/home");
    });
  });

  test("handles sign up error", async () => {
    const errorMessage = "Email already registered";
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    render(<Auth />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
