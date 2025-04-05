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

  const normalizedSearchTerm = searchTerm
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  const searchWords = normalizedSearchTerm.split(" ");

  return users.filter((user) => {
    const fullName =
      `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase();

    return searchWords.every((word) => fullName.includes(word));
  });
};
