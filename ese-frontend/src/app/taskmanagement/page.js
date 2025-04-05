"use client";

import React from "react";
import withAuth from "../../lib/withAuth";
import Dashboard from "../components/Dashboard";
import Backlog from "../components/Backlog";
import Header from "../components/Header";

const Task = () => {
  return (
    <div>
      <Header />
      <Dashboard />
      <Backlog />
    </div>
  );
};

export default withAuth(Task);
