import React from "react";

const Ticket = ({ tickets, handleEditTicket, handleDeleteTicket }) => {
  return (
    <ul>
      {tickets.map((ticket) => (
        <li key={ticket.id || `ticket-${Math.random()}`}>
          <div className="ticket-card">
            <h3>{ticket.column_name}</h3>
            <p>{ticket.column_tasks}</p>
            <p>Status: {ticket.status}</p>
            <p>Assigned User: {ticket.email}</p>
            <div className="ticket-actions">
              <button
                onClick={() => handleEditTicket(ticket)}
                className="edit-button"
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
      ))}
    </ul>
  );
};

export default Ticket;
