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
    status: "backlog",
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
      setNewTicket({ column_name: "", column_tasks: "", status: "backlog" });
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
      status: ticket.status,
    });
  };

  const handleDelete = async (ticketId) => {
    try {
      const result = await deleteTicket(ticketId);
      if (result?.success) {
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
    <div className="kanban-container">
      <h1>Kanban Backlog</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleSubmit} className="ticket-form">
        <input
          type="text"
          placeholder="Title"
          className="Title"
          value={newTicket.column_name}
          onChange={(e) =>
            setNewTicket({ ...newTicket, column_name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Tasks"
          className="Tasks"
          value={newTicket.column_tasks}
          onChange={(e) =>
            setNewTicket({ ...newTicket, column_tasks: e.target.value })
          }
        />
        <button className="add-ticket" type="submit">
          {editingTicket ? "Update Ticket" : "Add Ticket"}
        </button>
      </form>

      <div className="kanban-board">
        {["backlog", "in-progress", "done"].map((status) => (
          <div key={status} className="kanban-column">
            <h2 className="backlog-text">
              {status.replace("-", " ").toUpperCase()}
            </h2>
            <div className="kanban-tickets">
              {tickets.filter(
                (ticket) =>
                  ticket.status === status ||
                  (status === "backlog" && !ticket.status)
              ).length === 0 ? (
                <p>No tickets available.</p>
              ) : (
                tickets
                  .filter(
                    (ticket) =>
                      ticket.status === status ||
                      (status === "backlog" && !ticket.status)
                  )
                  .map((ticket, index) => (
                    <div key={ticket.id || index} className="ticket-card">
                      <h3>{ticket.column_name}</h3>
                      <p>{ticket.column_tasks}</p>
                      <div className="ticket-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(ticket)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
