import { sortUsers, filterUsers } from "../../../src/utils/userUtils";

describe("sortUsers", () => {
  const users = [
    {
      id: 1,
      first_name: "Leon",
      last_name: "Kennedy",
      email: "Leon@example.com",
    },
    {
      id: 2,
      first_name: "Ripley",
      last_name: "Adams",
      email: "Ripley@example.com",
    },
    {
      id: 3,
      first_name: "Tom",
      last_name: "Riddle",
      email: "Tom@example.com",
    },
  ];

  test("sorts users by first_name in ascending order", () => {
    const sortConfig = { key: "first_name", direction: "ascending" };
    const sortedUsers = sortUsers(users, sortConfig);

    expect(sortedUsers[0].first_name).toBe("Leon");
    expect(sortedUsers[1].first_name).toBe("Ripley");
    expect(sortedUsers[2].first_name).toBe("Tom");
  });

  test("sorts users by last_name in descending order", () => {
    const sortConfig = { key: "last_name", direction: "descending" };
    const sortedUsers = sortUsers(users, sortConfig);

    expect(sortedUsers[0].last_name).toBe("Riddle");
    expect(sortedUsers[1].last_name).toBe("Kennedy");
    expect(sortedUsers[2].last_name).toBe("Adams");
  });

  test("sorts users by email in ascending order", () => {
    const sortConfig = { key: "email", direction: "ascending" };
    const sortedUsers = sortUsers(users, sortConfig);

    expect(sortedUsers[0].email).toBe("Leon@example.com");
    expect(sortedUsers[1].email).toBe("Ripley@example.com");
    expect(sortedUsers[2].email).toBe("Tom@example.com");
  });

  test("returns users in the same order if no sortConfig is provided", () => {
    const sortConfig = {};
    const sortedUsers = sortUsers(users, sortConfig);

    expect(sortedUsers).toEqual(users);
  });
});

describe("filterUsers", () => {
  const users = [
    {
      id: 1,
      first_name: "John",
      last_name: "Riddle",
      email: "John@example.com",
    },
    {
      id: 2,
      first_name: "Leon",
      last_name: "Kennedy",
      email: "Leon@example.com",
    },
    {
      id: 3,
      first_name: "Tom",
      last_name: "Riddle",
      email: "Tom@example.com",
    },
  ];

  test("filters users by a single search term", () => {
    const searchTerm = "John";
    const filteredUsers = filterUsers(users, searchTerm);

    expect(filteredUsers.length).toBe(1);
    expect(filteredUsers[0].first_name).toBe("John");
  });

  test("filters users by multiple search terms", () => {
    const searchTerm = "Leon Kennedy";
    const filteredUsers = filterUsers(users, searchTerm);

    expect(filteredUsers.length).toBe(1);
    expect(filteredUsers[0].first_name).toBe("Leon");
    expect(filteredUsers[0].last_name).toBe("Kennedy");
  });

  test("filters users by first_name and last_name with case insensitivity", () => {
    const searchTerm = "Tom Riddle";
    const filteredUsers = filterUsers(users, searchTerm);

    expect(filteredUsers.length).toBe(1);
    expect(filteredUsers[0].first_name).toBe("Tom");
    expect(filteredUsers[0].last_name).toBe("Riddle");
  });

  test("returns all users if no search term is provided", () => {
    const filteredUsers = filterUsers(users, "");

    expect(filteredUsers.length).toBe(3);
  });

  test("returns an empty array if no users match the search term", () => {
    const searchTerm = "nonexistent";
    const filteredUsers = filterUsers(users, searchTerm);

    expect(filteredUsers.length).toBe(0);
  });

  test("filters users by email", () => {
    const searchTerm = "Tom@example.com";
    const filteredUsers = filterUsers(users, searchTerm);

    expect(filteredUsers.length).toBe(1);
    expect(filteredUsers[0].email).toBe("Tom@example.com");
  });
});
