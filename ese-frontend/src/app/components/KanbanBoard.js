import React, { useState, useEffect } from "react";
import {
  getTickets,
  updateTicket,
  deleteTicket,
  getUsers,
} from "../../lib/server";
import TicketForm from "./TicketForm";
import KanbanColumn from "./KanbanColumn";
import {
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
} from "./DragAndDrop";

const Board = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

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

  const fetchTicketsAndUsers = async () => {
    try {
      const ticketData = await getTickets();
      setTickets(ticketData.fetched || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editingTicket || !editingTicket.column_name.trim()) {
      setError("Please fill in 'Title' before adding a ticket.");
      console.log("Error set:", error);
      return;
    }

    try {
      const updatedTicket = await updateTicket(editingTicket.id, editingTicket);
      if (updatedTicket) {
        setTickets(
          tickets.map((t) => (t.id === editingTicket.id ? updatedTicket : t))
        );
        setEditingTicket(null);
        setIsEditing(false);
        setError("");
      }
      fetchTicketsAndUsers();
    } catch (error) {
      setError("An error occurred while updating the ticket.");
      console.log("Error set:", error);
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

  const groupedTickets = {
    Ready: tickets.filter((ticket) => ticket.status === "Ready"),
    "In-progress": tickets.filter((ticket) => ticket.status === "In-progress"),
    Done: tickets.filter((ticket) => ticket.status === "Done"),
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
              error={error}
            />
          </div>
        </div>
      )}
      <br />
      <div className="kanban-board">
        {Object.entries(groupedTickets).map(([status, statusTickets]) => (
          <KanbanColumn
            key={status}
            status={status}
            tickets={statusTickets}
            users={users}
            handleDragOver={handleDragOver}
            handleDrop={(e) =>
              handleDrop(e, status, tickets, setTickets, updateTicket)
            }
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
