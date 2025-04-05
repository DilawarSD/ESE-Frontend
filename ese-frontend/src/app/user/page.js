"use client";

import React from "react";
import Dashboard from "../components/Dashboard";
import User from "../components/Users";
import withAuth from "../../lib/withAuth";
import Header from "../components/Header";

const Users = () => {
  return (
    <div>
      <Header />
      <Dashboard />
      <User />
    </div>
  );
};

export default withAuth(Users);
