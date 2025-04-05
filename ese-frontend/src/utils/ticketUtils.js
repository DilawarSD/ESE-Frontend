export const getSortedTickets = (tickets, sortConfig) => {
  const sortableTickets = [...tickets];
  if (sortConfig.key) {
    sortableTickets.sort((a, b) => {
      if (
        typeof a[sortConfig.key] === "string" &&
        typeof b[sortConfig.key] === "string"
      ) {
        return sortConfig.direction === "ascending"
          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      }
      return sortConfig.direction === "ascending"
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    });
  }
  return sortableTickets;
};

export const getFilteredTickets = (tickets, users, searchTerm, sortConfig) => {
  const sortedTickets = getSortedTickets(tickets, sortConfig);
  if (!searchTerm) return sortedTickets;

  const normalizedSearchTerm = searchTerm
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  const searchWords = normalizedSearchTerm.split(" ");

  return sortedTickets.filter((ticket) => {
    const assignedUser = users.find((user) => user.email === ticket.email);
    const assignedUserName = assignedUser
      ? `${assignedUser.first_name} ${assignedUser.last_name}`
      : "Unassigned";

    const ticketData =
      `${ticket.column_name} ${ticket.column_tasks} ${ticket.status} ${assignedUserName}`.toLowerCase();

    return searchWords.every((word) => ticketData.includes(word));
  });
};
