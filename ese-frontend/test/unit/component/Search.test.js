import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Search from "../../../src/app/components/Search";

describe("Search Component", () => {
  const mockSetSearchTerm = jest.fn();
  const mockHandleSort = jest.fn();

  const defaultProps = {
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    sortConfig: { key: "name", direction: "ascending" },
    handleSort: mockHandleSort,
    sortOptions: [
      { key: "name", label: "Name" },
      { key: "date", label: "Date" },
    ],
  };

  beforeEach(() => {
    mockSetSearchTerm.mockClear();
    mockHandleSort.mockClear();
  });

  test("renders with default props", () => {
    render(<Search {...defaultProps} />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByText("Sort by:")).toBeInTheDocument();
    expect(screen.getByText("Name ↑")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  test("updates search term when input changes", () => {
    render(<Search {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("test search");
  });

  test("calls handleSort when sort button is clicked", () => {
    render(<Search {...defaultProps} />);

    const dateButton = screen.getByText("Date");
    fireEvent.click(dateButton);

    expect(mockHandleSort).toHaveBeenCalledWith("date");
  });

  test("renders with custom search placeholder", () => {
    render(<Search {...defaultProps} searchPlaceholder="Find items..." />);

    expect(screen.getByPlaceholderText("Find items...")).toBeInTheDocument();
  });

  test("displays correct sort direction indicators", () => {
    const descendingProps = {
      ...defaultProps,
      sortConfig: { key: "name", direction: "descending" },
    };

    render(<Search {...descendingProps} />);

    expect(screen.getByText("Name ↓")).toBeInTheDocument();
  });

  test("handles empty sort options", () => {
    render(<Search {...defaultProps} sortOptions={[]} />);

    expect(screen.getByText("Sort by:")).toBeInTheDocument();
    expect(screen.queryByText("Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Date")).not.toBeInTheDocument();
  });

  test("displays active state for selected sort option", () => {
    render(<Search {...defaultProps} />);

    const nameButton = screen.getByText("Name ↑");
    const dateButton = screen.getByText("Date");

    expect(nameButton.className).toContain("active");
    expect(dateButton.className).not.toContain("active");
  });
});
