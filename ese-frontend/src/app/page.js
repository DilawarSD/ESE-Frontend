"use client";

import React from "react";
import Tickets from "../app/components/Tickets";
import User from "../app/components/User";
const App = () => {
  return (
    <div>
      <h1>Fetched Data from Backend</h1>
      <Tickets />
      <User />
    </div>
  );
};

export default App;
