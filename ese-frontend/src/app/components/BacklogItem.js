import React from "react";

const BacklogItem = ({
  ticket,
  users,
  handleEditTicket,
  handleDeleteTicket,
}) => {
  const assignedUser = users.find((user) => user.email === ticket.email);

  return (
    <li>
      <div className="ticket-card">
        <h3>{ticket.column_name}</h3>
        <p>{ticket.column_tasks}</p>
        <p>Status: {ticket.status}</p>
        <p>
          Assigned User:{" "}
          {assignedUser
            ? `${assignedUser.first_name} ${assignedUser.last_name}`
            : "Unassigned"}
        </p>
        <div className="ticket-actions">
          <button
            onClick={() => handleEditTicket(ticket)}
            className="green-button"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteTicket(ticket.id)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default BacklogItem;
