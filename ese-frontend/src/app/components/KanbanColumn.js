import React from "react";
import TicketCard from "./TicketCard";

const KanbanColumn = ({
  status,
  tickets,
  handleDragOver,
  handleDrop,
  handleEdit,
  handleDelete,
  handleDragStart,
  handleAssignUser,
}) => {
  return (
    <div
      className="kanban-column"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <h2 className="backlog-text">{status.replace("-", " ").toUpperCase()}</h2>
      <div className="kanban-tickets">
        {tickets
          .filter((ticket) => ticket.status === status)
          .map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleDragStart={handleDragStart}
              handleAssignUser={handleAssignUser}
            />
          ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
