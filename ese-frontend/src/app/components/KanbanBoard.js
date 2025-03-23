import React from "react";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({
  tickets,
  handleDragOver,
  handleDrop,
  handleEdit,
  handleDelete,
  handleDragStart,
  handleAssignUser,
}) => {
  return (
    <div className="kanban-board">
      {["backlog", "in-progress", "done"].map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tickets={tickets}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleDragStart={handleDragStart}
          handleAssignUser={handleAssignUser}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
