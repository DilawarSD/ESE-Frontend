export const handleDragStart = (e, ticket) => {
  e.dataTransfer.setData("ticketId", ticket.id);
  e.target.style.opacity = 0.5;
};

export const handleDragEnd = (e) => {
  e.target.style.opacity = 1;
};

export const handleDragOver = (e) => {
  e.preventDefault();
};

export const handleDrop = async (
  e,
  status,
  tickets,
  setTickets,
  updateTicket
) => {
  e.preventDefault();
  const ticketId = e.dataTransfer.getData("ticketId");
  const updatedTickets = [...tickets];
  const draggedTicket = updatedTickets.find(
    (ticket) => ticket.id.toString() === ticketId
  );
  if (draggedTicket) {
    draggedTicket.status = status;
    await updateTicket(draggedTicket.id, { ...draggedTicket });
    setTickets(updatedTickets);
  }
};
