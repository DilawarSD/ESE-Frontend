"use client";

import React, { useState, useEffect } from "react";
import getTickets, { addTicket } from "../../lib/server";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    column_name: "",
    column_tasks: "",
  });

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getTickets();
        setTickets(Array.isArray(data.fetched) ? data.fetched : []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setTickets([]);
      }
    }

    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newTicket.column_name || !newTicket.column_tasks) {
      alert("Please enter all fields!");
      return;
    }

    const addedTicket = await addTicket(newTicket);
    if (addedTicket) {
      setTickets((prevTickets) => [...prevTickets, addedTicket]);
      setNewTicket({ column_name: "", column_tasks: "" });
    }
  };

  return (
    <div>
      <h1>Tickets</h1>

      {/* Form to Add Tickets */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Column Name"
          value={newTicket.column_name}
          onChange={(e) =>
            setNewTicket({ ...newTicket, column_name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Column Tasks"
          value={newTicket.column_tasks}
          onChange={(e) =>
            setNewTicket({ ...newTicket, column_tasks: e.target.value })
          }
        />
        <button type="submit">Add Ticket</button>
      </form>

      {/* Display Tickets */}
      <div>
        {tickets.map((ticket, index) => (
          <div key={ticket.id || index}>
            {" "}
            {/* Use ticket.id if available, otherwise fallback to index */}
            <h1>{ticket.column_name}</h1>
            <h3>{ticket.column_tasks}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
