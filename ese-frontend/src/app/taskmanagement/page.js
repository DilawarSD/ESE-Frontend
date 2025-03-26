"use client";

import React from "react";
import Dashboard from "../components/Dashboard";
import Backlog from "../components/Backlog";
import Users from "../components/Users";
const Task = () => {
  return (
    <div>
      <h1 className="task-management">Task Management</h1>
      <Dashboard />
      <Backlog />
    </div>
  );
};

export default Task;
