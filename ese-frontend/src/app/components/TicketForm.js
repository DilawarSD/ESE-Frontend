import React from "react";

const TicketForm = ({
  newTicket,
  setNewTicket,
  users,
  handleTicketSubmit,
  error,
}) => {
  if (!newTicket) return null;

  return (
    <form
      onSubmit={(e) => handleTicketSubmit(e, newTicket)}
      className="ticket-form"
      role="form"
    >
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
        aria-label="Status"
      >
        <option value="Ready">Ready</option>
        <option value="In-progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <select
        value={newTicket.email}
        onChange={(e) => setNewTicket({ ...newTicket, email: e.target.value })}
        aria-label="Assign User"
      >
        <option value="">Assign User</option>
        {users.map((user) => (
          <option key={user.id} value={user.email}>
            {user.first_name} {user.last_name} ({user.email})
          </option>
        ))}
      </select>
      <button className="green-button" type="submit">
        Update Ticket
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default TicketForm;
