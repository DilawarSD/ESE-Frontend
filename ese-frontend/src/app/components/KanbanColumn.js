import React from "react";
import TicketCard from "./TicketCard";

const KanbanColumn = ({
  status,
  tickets,
  users,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  handleEditTicket,
  handleDeleteTicket,
}) => {
  return (
    <div
      className="kanban-column"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <h3 className="title-text">{status.replace("-", " ").toUpperCase()}</h3>
      <div className="kanban-tickets">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            users={users}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleEditTicket={handleEditTicket}
            handleDeleteTicket={handleDeleteTicket}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
