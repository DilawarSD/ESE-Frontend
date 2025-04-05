"use client";

import React from "react";
import Dashboard from "../components/Dashboard";
import KanbanBoard from "../components/KanbanBoard";
import withAuth from "../../lib/withAuth";
import Header from "../components/Header";

const Home = () => {
  return (
    <div>
      <Header />
      <Dashboard />
      <KanbanBoard />
    </div>
  );
};

export default withAuth(Home);
