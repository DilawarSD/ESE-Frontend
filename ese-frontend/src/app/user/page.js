"use client";

import React from "react";
import Dashboard from "../components/Dashboard";
import User from "../components/Users";
const Task = () => {
  return (
    <div>
      <h1 className="task-management">Task Management</h1>
      <Dashboard />
      <User />
    </div>
  );
};

export default Task;
