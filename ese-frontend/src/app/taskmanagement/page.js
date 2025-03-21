"use client";

import React from "react";
import Tickets from "../components/Tickets";
import User from "../components/User";
import Dashboard from "../components/Dashboard";

const Task = () => {
  return (
    <div>
      <h1>Fetched Data from Backend</h1>
      <Tickets />
      <User />
      <Dashboard />
    </div>
  );
};

export default Task;
