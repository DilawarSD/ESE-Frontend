"use client"; // This ensures that the file is treated as a client-side component in Next.js or similar setups

import React, { useState, useEffect } from "react";
import getTickets from "../../lib/server";

const Tickets = () => {
  const [tickets, setTickets] = useState([]); // Ensure tickets is always an array

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getTickets();

        // Log the data to verify its structure
        console.log("Fetched tickets data:", data);

        // Ensure data.fetched is an array before setting it to state
        setTickets(Array.isArray(data.fetched) ? data.fetched : []); // Access data.fetched
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setTickets([]); // In case of error, fallback to empty array
      }
    }

    fetchTickets();
  }, []);

  return (
    <div>
      <div>
        {/* Safely map over tickets (which is guaranteed to be an array now) */}
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id}>
              <h1>{ticket.column_name}</h1>
              <h3>{ticket.column_tasks}</h3>
            </div>
          ))
        ) : (
          <p>no tickets available</p> // Show fallback message if tickets is empty
        )}
      </div>
    </div>
  );
};

export default Tickets;
