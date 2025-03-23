import React from "react";
import User from "../components/User";

const TicketCard = ({
  ticket,
  handleEdit,
  handleDelete,
  handleDragStart,
  handleAssignUser,
}) => {
  return (
    <div
      key={ticket.id}
      className="ticket-card"
      draggable
      onDragStart={(e) => handleDragStart(e, ticket.id)}
    >
      <h3>{ticket.column_name}</h3>
      <p>{ticket.column_tasks}</p>

      <User
        ticketId={ticket.id}
        assignedUserId={ticket.userId}
        handleAssignUser={handleAssignUser}
      />

      <div className="ticket-actions">
        <button className="edit-button" onClick={() => handleEdit(ticket)}>
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
  );
};

export default TicketCard;
