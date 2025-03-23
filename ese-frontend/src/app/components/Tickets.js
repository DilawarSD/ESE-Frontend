import React, { useState, useEffect } from "react";
import getTickets, {
  addTicket,
  updateTicket,
  deleteTicket,
} from "../../lib/server";
import TicketForm from "../components/TicketForm";
import KanbanBoard from "../components/KanbanBoard";
import ErrorMessage from "../components/ErrorMessage";

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

        if (updatedTicket && updatedTicket.updated) {
          setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket.id === editingTicket.id ? updatedTicket.updated[0] : ticket
            )
          );
        }
        setEditingTicket(null);
      } else {
        const addedTicket = await addTicket(newTicket);
        if (addedTicket && addedTicket.inserted) {
          setTickets((prevTickets) => [
            ...prevTickets,
            ...addedTicket.inserted,
          ]);
        }
      }

      setNewTicket({ column_name: "", column_tasks: "", status: "backlog" });
    } catch (err) {
      console.error("Error submitting ticket:", err);
      setError("Error submitting ticket");
    }
  };

  const handleEdit = (ticket) => {
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
        setError("Failed to delete ticket");
      }
    } catch (error) {
      setError("Error deleting ticket");
    }
  };

  const handleAssignUser = async (ticketId, userId) => {
    try {
      const ticket = tickets.find((ticket) => ticket.id === ticketId);
      if (ticket) {
        ticket.userId = userId;
        const updatedTicket = await updateTicket(ticket.id, ticket);
        if (updatedTicket) {
          setTickets((prevTickets) =>
            prevTickets.map((t) => (t.id === ticket.id ? { ...t, userId } : t))
          );
        }
      }
    } catch (error) {
      console.error("Error assigning user to ticket:", error);
      setError("Error assigning user to ticket");
    }
  };

  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData("ticketId", ticketId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    const ticketId = e.dataTransfer.getData("ticketId");
    const movedTicket = tickets.find(
      (ticket) => ticket.id === parseInt(ticketId)
    );

    if (movedTicket && movedTicket.status !== newStatus) {
      movedTicket.status = newStatus;

      try {
        await updateTicket(movedTicket.id, movedTicket);
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === movedTicket.id ? movedTicket : ticket
          )
        );
      } catch (err) {
        console.error("Error updating ticket status:", err);
        setError("Error updating ticket status");
      }
    }
  };

  return (
    <div className="kanban-container">
      <h1>Kanban Board</h1>
      <ErrorMessage message={error} />
      <TicketForm
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        handleSubmit={handleSubmit}
        editingTicket={editingTicket}
      />
      <KanbanBoard
        tickets={tickets}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleDragStart={handleDragStart}
        handleAssignUser={handleAssignUser}
      />
    </div>
  );
};

export default Tickets;
