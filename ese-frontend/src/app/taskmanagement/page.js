"use client";

import React from "react";
import withAuth from "../../lib/withAuth";
import Dashboard from "../components/Dashboard";
import Backlog from "../components/Backlog";

const Task = () => {
  return (
    <div>
      <h1 className="task-management">Task Management</h1>
      <Dashboard />
      <Backlog />
    </div>
  );
};

export default withAuth(Task);
