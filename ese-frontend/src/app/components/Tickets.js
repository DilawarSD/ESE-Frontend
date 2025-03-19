"use client";

import React, { useState, useEffect } from "react";
import getTickets from "../../lib/server";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getTickets();

        console.log("Fetched tickets data:", data);

        setTickets(Array.isArray(data.fetched) ? data.fetched : []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setTickets([]);
      }
    }

    fetchTickets();
  }, []);

  return (
    <div>
      <div>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id}>
              <h1>{ticket.column_name}</h1>
              <h3>{ticket.column_tasks}</h3>
            </div>
          ))
        ) : (
          <p>no tickets available</p>
        )}
      </div>
    </div>
  );
};

export default Tickets;
