"use client";

import React from "react";
import Dashboard from "../components/Dashboard";
import User from "../components/Users";
import withAuth from "../../lib/withAuth";

const Users = () => {
  return (
    <div>
      <h1 className="task-management">Task Management</h1>
      <Dashboard />
      <User />
    </div>
  );
};

export default withAuth(Users);
