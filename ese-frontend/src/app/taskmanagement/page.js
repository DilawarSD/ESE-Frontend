"use client";

import React from "react";
import Tickets from "../components/Tickets";
import User from "../components/User";
import Dashboard from "../components/Dashboard";

const Task = () => {
  return (
    <div>
      <h1 className="task-management">Task Management</h1>
      <Tickets />
      <User />
      <Dashboard />
    </div>
  );
};

export default Task;
