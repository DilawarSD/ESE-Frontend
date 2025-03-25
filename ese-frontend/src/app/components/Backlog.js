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
  const [newTicket, setNewTicket] = useState({
    column_name: "",
    column_tasks: "",
    status: "ready",
    email: "",
  });
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    async function fetchTicketsAndUsers() {
      try {
        const ticketData = await getTickets();
        setTickets(ticketData.fetched || []);
        const userData = await getUsers();
        setUsers(Array.isArray(userData.fetched) ? userData.fetched : []);
      } catch (error) {
        console.error("Error fetching tickets or users:", error);
        setUsers([]);
      }
    }
    fetchTicketsAndUsers();
  }, []);

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!newTicket.column_name.trim()) return;

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

    setNewTicket({
      column_name: "",
      column_tasks: "",
      status: "ready",
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
          placeholder="Tasks"
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
              <option value="ready">Ready</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </>
          ) : (
            <option value="ready">Ready</option>
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

        <button type="submit">
          {editingTicket ? "Update Ticket" : "Add Ticket"}
        </button>
      </form>

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
