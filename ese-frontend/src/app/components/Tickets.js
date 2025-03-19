"use client";

import React, { useState, useEffect } from "react";
import getTickets, {
  addTicket,
  updateTicket,
  deleteTicket,
} from "../../lib/server";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    column_name: "",
    column_tasks: "",
  });
  const [editingTicket, setEditingTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getTickets();
        setTickets(Array.isArray(data.fetched) ? data.fetched : []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError("Error fetching tickets");
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

    setError("");

    try {
      if (editingTicket) {
        const updatedTicket = await updateTicket(editingTicket.id, newTicket);
        if (updatedTicket) {
          setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket.id === updatedTicket.id ? updatedTicket : ticket
            )
          );
          setEditingTicket(null);
        }
      } else {
        const addedTicket = await addTicket(newTicket);
        if (addedTicket) {
          setTickets((prevTickets) => [...prevTickets, addedTicket]);
        }
      }
      setNewTicket({ column_name: "", column_tasks: "" });
    } catch (err) {
      console.error("Error submitting ticket:", err);
      setError("Error submitting ticket");
    }
  };

  const handleEdit = (ticket) => {
    console.log("Editing ticket ID:", ticket.id);
    setEditingTicket(ticket);
    setNewTicket({
      column_name: ticket.column_name,
      column_tasks: ticket.column_tasks,
    });
  };

  const handleDelete = async (ticketId) => {
    try {
      const result = await deleteTicket(ticketId);
      if (result?.success) {
        // Remove the deleted ticket from the state
        setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
      } else {
        console.error("Failed to delete ticket");
        setError("Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setError("Error deleting ticket");
    }
  };

  return (
    <div>
      <h1>Tickets</h1>

      {/* Error Message */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Form to Add or Edit Tickets */}
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
        <button type="submit">
          {editingTicket ? "Update Ticket" : "Add Ticket"}
        </button>
      </form>

      <div>
        {tickets.map((ticket, index) => (
          <div key={ticket.id || index}>
            <h1>{ticket.column_name}</h1>
            <h3>{ticket.column_tasks}</h3>
            <button onClick={() => handleEdit(ticket)}>Edit</button>
            <button onClick={() => handleDelete(ticket.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
