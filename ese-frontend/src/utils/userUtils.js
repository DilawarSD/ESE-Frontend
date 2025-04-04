export const sortUsers = (users, sortConfig) => {
  const sortableUsers = [...users];
  if (sortConfig.key) {
    sortableUsers.sort((a, b) => {
      const valueA = a[sortConfig.key]?.toString().toLowerCase();
      const valueB = b[sortConfig.key]?.toString().toLowerCase();
      if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }
  return sortableUsers;
};

export const filterUsers = (users, searchTerm) => {
  if (!searchTerm) return users;

  // Normalize search term: trim, lowercase, and replace multiple spaces with a single space
  const normalizedSearchTerm = searchTerm
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  // Split search term into words to handle multi-word searches
  const searchWords = normalizedSearchTerm.split(" ");

  return users.filter((user) => {
    // Combine first_name and last_name for the full name search
    const fullName =
      `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase();

    // Check if any word in the search term matches either first_name + last_name
    return searchWords.every((word) => fullName.includes(word));
  });
};
