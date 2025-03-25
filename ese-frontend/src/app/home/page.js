"use client";

import React from "react";
import Dashboard from "../components/Dashboard";
import KanbanBoard from "../components/KanbanBoard";

const Task = () => {
  return (
    <div>
      <h1 className="task-management">Task Management</h1>
      <Dashboard />
      <KanbanBoard />
    </div>
  );
};

export default Task;
