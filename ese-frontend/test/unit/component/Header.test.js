import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../../../src/app/components/Header";
import "@testing-library/jest-dom";

jest.mock("next/head", () => {
  return ({ children }) => <>{children}</>;
});

jest.mock("next/link", () => {
  return ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe("Header", () => {
  test("renders title link with correct text and href", () => {
    render(<Header />);
    const linkElement = screen.getByText("Task Management");

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/home");
  });

  test("sets the document title", () => {
    render(<Header />);
    expect(document.title).toBe("Task Management");
  });
});
