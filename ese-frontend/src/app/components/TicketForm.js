import React from "react";

const TicketForm = ({
  newTicket,
  setNewTicket,
  handleSubmit,
  editingTicket,
}) => {
  return (
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
        onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
      >
        <option value="backlog">Backlog</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button className="add-ticket" type="submit">
        {editingTicket ? "Update Ticket" : "Add Ticket"}
      </button>
    </form>
  );
};

export default TicketForm;
