import React, { useState, useEffect } from "react";
import {
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  getUsers,
} from "../../lib/server";
import Search from "../components/Search";
import BacklogForm from "./BacklogForm";
import BacklogList from "./BacklogList";
import { getFilteredTickets } from "../../utils/ticketUtils";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "column_name",
    direction: "ascending",
  });

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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredTickets = getFilteredTickets(
    tickets,
    users,
    searchTerm,
    sortConfig
  );

  return (
    <div>
      <h2 className="task-management">Backlog</h2>
      <BacklogForm
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        handleTicketSubmit={handleTicketSubmit}
        users={users}
        handleAssignUser={handleAssignUser}
        editingTicket={editingTicket}
        error={error}
      />
      <br />
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortConfig={sortConfig}
        handleSort={handleSort}
        searchPlaceholder="Search tickets..."
        sortOptions={[
          { key: "column_name", label: "Title" },
          { key: "status", label: "Status" },
        ]}
      />
      <br />
      <BacklogList
        tickets={filteredTickets}
        users={users}
        handleEditTicket={handleEditTicket}
        handleDeleteTicket={handleDeleteTicket}
      />
    </div>
  );
};

export default Backlog;
