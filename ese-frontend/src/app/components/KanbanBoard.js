import React, { useState, useEffect } from "react";
import {
  getTickets,
  updateTicket,
  deleteTicket,
  getUsers,
} from "../../lib/server";
import TicketForm from "./TicketForm";
import KanbanColumn from "./KanbanColumn";

const Board = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    if (!editingTicket) return;

    const updatedTicket = await updateTicket(editingTicket.id, editingTicket);
    if (updatedTicket) {
      setTickets(
        tickets.map((t) => (t.id === editingTicket.id ? updatedTicket : t))
      );
      setEditingTicket(null);
      setIsEditing(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    const success = await deleteTicket(ticketId);
    if (success) {
      setTickets(tickets.filter((t) => t.id !== ticketId));
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setEditingTicket(null);
    setIsEditing(false);
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

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              X
            </span>
            <TicketForm
              newTicket={editingTicket}
              setNewTicket={setEditingTicket}
              users={users}
              handleTicketSubmit={handleTicketSubmit}
            />
          </div>
        </div>
      )}

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
