import React from "react";

const Ticket = ({ tickets, users, handleEditTicket, handleDeleteTicket }) => {
  return (
    <ul>
      {tickets.map((ticket, index) => (
        <li key={ticket.id || index}>
          <div className="ticket-card">
            <h3>{ticket.column_name}</h3>
            <p>{ticket.column_tasks}</p>
            <p>Status: {ticket.status}</p>
            <p>
              Assigned User:{" "}
              {users.find((user) => user.email === ticket.email)
                ? `${
                    users.find((user) => user.email === ticket.email).first_name
                  } 
                   ${
                     users.find((user) => user.email === ticket.email).last_name
                   }`
                : "Not assigned"}
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
      ))}
    </ul>
  );
};

export default Ticket;
