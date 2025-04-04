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

  // Normalize search term: trim, lowercase, and replace multiple spaces with a single space
  const normalizedSearchTerm = searchTerm
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  // Split search term into words to handle multi-word searches
  const searchWords = normalizedSearchTerm.split(" ");

  return sortedTickets.filter((ticket) => {
    // Find the assigned user's first name and last name
    const assignedUser = users.find((user) => user.email === ticket.email);
    const assignedUserName = assignedUser
      ? `${assignedUser.first_name} ${assignedUser.last_name}`
      : "Unassigned";

    // Combine ticket fields and assigned user for search
    const ticketData =
      `${ticket.column_name} ${ticket.column_tasks} ${ticket.status} ${assignedUserName}`.toLowerCase();

    // Check if every word in the search term matches the combined ticket data
    return searchWords.every((word) => ticketData.includes(word));
  });
};
