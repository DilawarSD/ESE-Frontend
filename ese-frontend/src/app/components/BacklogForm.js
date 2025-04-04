import React from "react";

const BacklogForm = ({
  newTicket,
  setNewTicket,
  handleTicketSubmit,
  users,
  handleAssignUser,
  editingTicket,
  error,
}) => {
  return (
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
        onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
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
  );
};

export default BacklogForm;
