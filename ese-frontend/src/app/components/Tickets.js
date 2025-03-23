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

      // Make the API call to update the status on the server
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

        <select
          value={newTicket.status}
          onChange={(e) =>
            setNewTicket({ ...newTicket, status: e.target.value })
          }
        >
          <option value="backlog">Backlog</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button className="add-ticket" type="submit">
          {editingTicket ? "Update Ticket" : "Add Ticket"}
        </button>
      </form>

      <div className="kanban-board">
        {["backlog", "in-progress", "done"].map((status) => (
          <div
            key={status}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h2 className="backlog-text">
              {status.replace("-", " ").toUpperCase()}
            </h2>
            <div className="kanban-tickets">
              {tickets
                .filter((ticket) => ticket.status === status)
                .map((ticket, index) => (
                  <div
                    key={ticket.id || index}
                    className="ticket-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, ticket.id)}
                  >
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
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
