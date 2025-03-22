import React from "react";

const StatusLine = ({ status, onStatusChange }) => {
  return (
    <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
      <option value="backlog">Backlog</option>
      <option value="in-progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  );
};

export default StatusLine;
