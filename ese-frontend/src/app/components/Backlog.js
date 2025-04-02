import React, { useState, useEffect } from "react";
import {
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  getUsers,
} from "../../lib/server";
import Tickets from "../components/Tickets";

const Backlog = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [newTicket, setNewTicket] = useState({
    column_name: "",
    column_tasks: "",
    status: "Ready",
    email: "",
  });
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    fetchTicketsAndUsers();
  }, []);

  const fetchTicketsAndUsers = async () => {
    try {
      const ticketData = await getTickets();
      setTickets(ticketData.fetched || []);
      const userData = await getUsers();
      setUsers(Array.isArray(userData.fetched) ? userData.fetched : []);
    } catch (error) {
      console.error("Error fetching tickets or users:", error);
      setUsers([]);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!newTicket.column_name.trim()) {
      setError("Please fill in title before submitting.");
      return;
    }

    if (editingTicket) {
      const updatedTicket = await updateTicket(editingTicket.id, newTicket);
      if (updatedTicket) {
        setTickets(
          tickets.map((t) => (t.id === editingTicket.id ? updatedTicket : t))
        );
        setEditingTicket(null);
      }
    } else {
      const addedTicket = await addTicket(newTicket);
      if (addedTicket) {
        setTickets([...tickets, addedTicket]);
      }
    }

    fetchTicketsAndUsers();

    setNewTicket({
      column_name: "",
      column_tasks: "",
      status: "Ready",
      email: "",
    });
  };

  const handleAssignUser = (ticketId, email) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, email } : ticket
    );
    setTickets(updatedTickets);
    setNewTicket((prevTicket) => ({ ...prevTicket, email }));
  };

  const handleEditTicket = (ticket) => {
    setNewTicket(ticket);
    setEditingTicket(ticket);
  };

  const handleDeleteTicket = async (ticketId) => {
    const success = await deleteTicket(ticketId);
    if (success) {
      console.log("delete successful");
      setTickets(tickets.filter((t) => t.id !== ticketId));
    }
  };

  return (
    <div>
      <h2 className="task-management">Backlog</h2>
      <form onSubmit={handleTicketSubmit} className="ticket-form">
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
          placeholder="Description"
          className="Tasks"
          value={newTicket.column_tasks}
          onChange={(e) =>
            setNewTicket({ ...newTicket, column_tasks: e.target.value })
          }
        />
        <select
          value={newTicket.status}
          onChange={(e) =>
            setNewTicket({ ...newTicket, status: e.target.value })
          }
        >
          {editingTicket ? (
            <>
              <option value="Ready">Ready</option>
              <option value="In-progress">In Progress</option>
              <option value="Done">Done</option>
            </>
          ) : (
            <option value="Ready">Ready</option>
          )}
        </select>

        <select
          value={newTicket.email}
          onChange={(e) => handleAssignUser(newTicket.id, e.target.value)}
        >
          <option value="">Assign User</option>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.first_name} {user.last_name} ({user.email})
            </option>
          ))}
        </select>
        {error && <p className="error-message">{error}</p>}
        <button className="green-button" type="submit">
          {editingTicket ? "Update Ticket" : "Add Ticket"}
        </button>
      </form>
      <br />
      <Tickets
        tickets={tickets}
        users={users}
        handleEditTicket={handleEditTicket}
        handleDeleteTicket={handleDeleteTicket}
      />
    </div>
  );
};

export default Backlog;
