import React from "react";

const TicketCard = ({
  ticket,
  users,
  handleDragStart,
  handleDragEnd,
  handleEditTicket,
  handleDeleteTicket,
}) => {
  const assignedUser = users.find((user) => user.email === ticket.email);

  return (
    <div
      className="ticket-card"
      draggable
      onDragStart={(e) => handleDragStart(e, ticket)}
      onDragEnd={handleDragEnd}
    >
      <h4>{ticket.column_name}</h4>
      <p>{ticket.column_tasks}</p>
      <p>
        Assigned to:{" "}
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
  );
};

export default TicketCard;
