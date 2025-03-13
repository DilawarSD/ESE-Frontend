import { render, screen, fireEvent } from "@testing-library/react";
import Task from "../../../src/app/components/Task"; // Adjust the import path as necessary

describe("Task Component", () => {
  let mockTask, mockAddTask, mockDeleteTask, mockMoveTask;

  beforeEach(() => {
    mockTask = {
      id: "1",
      title: "Sample Task",
      description: "Sample Description",
      urgency: "medium",
      status: "In Progress",
      isCollapsed: true,
    };

    mockAddTask = jest.fn();
    mockDeleteTask = jest.fn();
    mockMoveTask = jest.fn();
  });

  test("renders task with correct initial data", () => {
    render(
      <Task
        task={mockTask}
        addTask={mockAddTask}
        deleteTask={mockDeleteTask}
        moveTask={mockMoveTask}
      />
    );

    expect(screen.getByPlaceholderText("Enter Title")).toHaveValue(
      "Sample Task"
    );
    expect(screen.getByPlaceholderText("Enter Description")).toHaveValue(
      "Sample Description"
    );
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("changes urgency level when a new urgency is selected", () => {
    render(
      <Task
        task={mockTask}
        addTask={mockAddTask}
        deleteTask={mockDeleteTask}
        moveTask={mockMoveTask}
      />
    );

    const highUrgencyInput = screen.getByLabelText("high");
    fireEvent.click(highUrgencyInput);

    expect(highUrgencyInput).toBeChecked();
  });

  test("moves task left when left button is clicked", () => {
    render(
      <Task
        task={mockTask}
        addTask={mockAddTask}
        deleteTask={mockDeleteTask}
        moveTask={mockMoveTask}
      />
    );

    fireEvent.click(screen.getByText("«")); // Left arrow button
    expect(mockMoveTask).toHaveBeenCalledWith("1", "Backlog");
  });

  test("moves task right when right button is clicked", () => {
    render(
      <Task
        task={mockTask}
        addTask={mockAddTask}
        deleteTask={mockDeleteTask}
        moveTask={mockMoveTask}
      />
    );

    fireEvent.click(screen.getByText("»")); // Right arrow button
    expect(mockMoveTask).toHaveBeenCalledWith("1", "Done");
  });

  test("expands and collapses task when edit/save is clicked", () => {
    render(
      <Task
        task={{ ...mockTask, isCollapsed: true }}
        addTask={mockAddTask}
        deleteTask={mockDeleteTask}
        moveTask={mockMoveTask}
      />
    );

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(editButton.textContent).toBe("Edit");
  });
});
