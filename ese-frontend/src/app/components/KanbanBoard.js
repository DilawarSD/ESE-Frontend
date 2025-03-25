import React, { useState, useEffect } from "react";
import {
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  getUsers,
} from "../../lib/server";
import TicketForm from "./TicketForm";
import KanbanColumn from "./KanbanColumn";

const Board = () => {
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
    async function fetchData() {
      try {
        const ticketData = await getTickets();
        setTickets(ticketData.fetched || []);
        const userData = await getUsers();
        setUsers(Array.isArray(userData.fetched) ? userData.fetched : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
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

  const handleDeleteTicket = async (ticketId) => {
    const success = await deleteTicket(ticketId);
    if (success) {
      setTickets(tickets.filter((t) => t.id !== ticketId));
    }
  };

  const handleAssignUser = (ticketId, email) => {
    const user = users.find((user) => user.email === email);
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? { ...ticket, email: user ? user.email : "" }
        : ticket
    );
    setTickets(updatedTickets);
    setNewTicket((prevTicket) => ({
      ...prevTicket,
      email: user ? user.email : "",
    }));
  };

  const handleEditTicket = (ticket) => {
    setNewTicket(ticket);
    setEditingTicket(ticket);
  };

  const handleDragStart = (e, ticket) => {
    e.dataTransfer.setData("ticketId", ticket.id);
    e.target.style.opacity = 0.5;
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData("ticketId");
    const updatedTickets = [...tickets];
    const draggedTicket = updatedTickets.find(
      (ticket) => ticket.id.toString() === ticketId
    );
    if (draggedTicket) {
      draggedTicket.status = status;
      await updateTicket(draggedTicket.id, { ...draggedTicket });
      setTickets(updatedTickets);
    }
  };

  const groupedTickets = {
    ready: tickets.filter((ticket) => ticket.status === "ready"),
    "in-progress": tickets.filter((ticket) => ticket.status === "in-progress"),
    done: tickets.filter((ticket) => ticket.status === "done"),
  };

  return (
    <div className="kanban-container">
      <h2 className="task-management">Kanban Board</h2>
      <TicketForm
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        users={users}
        editingTicket={editingTicket}
        handleTicketSubmit={handleTicketSubmit}
        handleAssignUser={handleAssignUser}
      />
      <div className="kanban-board">
        {Object.entries(groupedTickets).map(([status, statusTickets]) => (
          <KanbanColumn
            key={status}
            status={status}
            tickets={statusTickets}
            users={users}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleEditTicket={handleEditTicket}
            handleDeleteTicket={handleDeleteTicket}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
