import {
  getSortedTickets,
  getFilteredTickets,
} from "../../../src/utils/ticketUtils";

describe("getSortedTickets", () => {
  const tickets = [
    {
      id: 1,
      column_name: "Task 1",
      column_tasks: "Description 1",
      status: "Ready",
      email: "user@example.com",
    },
    {
      id: 2,
      column_name: "Task 2",
      column_tasks: "Description 2",
      status: "In-progress",
      email: "user2@example.com",
    },
    {
      id: 3,
      column_name: "Task 3",
      column_tasks: "Description 3",
      status: "Done",
      email: "user@example.com",
    },
  ];

  test("sorts tickets in ascending order by column_name", () => {
    const sortConfig = { key: "column_name", direction: "ascending" };
    const sortedTickets = getSortedTickets(tickets, sortConfig);

    expect(sortedTickets[0].column_name).toBe("Task 1");
    expect(sortedTickets[1].column_name).toBe("Task 2");
    expect(sortedTickets[2].column_name).toBe("Task 3");
  });

  test("sorts tickets in descending order by column_name", () => {
    const sortConfig = { key: "column_name", direction: "descending" };
    const sortedTickets = getSortedTickets(tickets, sortConfig);

    expect(sortedTickets[0].column_name).toBe("Task 3");
    expect(sortedTickets[1].column_name).toBe("Task 2");
    expect(sortedTickets[2].column_name).toBe("Task 1");
  });

  test("sorts tickets in ascending order by status", () => {
    const sortConfig = { key: "status", direction: "ascending" };
    const sortedTickets = getSortedTickets(tickets, sortConfig);

    expect(sortedTickets[0].status).toBe("Done");
    expect(sortedTickets[1].status).toBe("In-progress");
    expect(sortedTickets[2].status).toBe("Ready");
  });

  test("handles sorting by non-string values (numeric)", () => {
    const ticketsWithPriority = [
      { id: 1, priority: 1, column_name: "Task 1" },
      { id: 2, priority: 3, column_name: "Task 2" },
      { id: 3, priority: 2, column_name: "Task 3" },
    ];
    const sortConfig = { key: "priority", direction: "ascending" };
    const sortedTickets = getSortedTickets(ticketsWithPriority, sortConfig);

    expect(sortedTickets[0].priority).toBe(1);
    expect(sortedTickets[1].priority).toBe(2);
    expect(sortedTickets[2].priority).toBe(3);
  });
});

describe("getFilteredTickets", () => {
  const tickets = [
    {
      id: 1,
      column_name: "Task 1",
      column_tasks: "Description 1",
      status: "Ready",
      email: "user@example.com",
    },
    {
      id: 2,
      column_name: "Task 2",
      column_tasks: "Description 2",
      status: "In-progress",
      email: "user2@example.com",
    },
    {
      id: 3,
      column_name: "Task 3",
      column_tasks: "Description 3",
      status: "Done",
      email: "user@example.com",
    },
  ];

  const users = [
    { id: 1, email: "user@example.com", first_name: "Tom", last_name: "Smith" },
    {
      id: 2,
      email: "user2@example.com",
      first_name: "Jack",
      last_name: "Ryder",
    },
  ];

  test("filters tickets by a single search term and sorts them", () => {
    const sortConfig = { key: "column_name", direction: "ascending" };
    const searchTerm = "Task 1";

    const filteredTickets = getFilteredTickets(
      tickets,
      users,
      searchTerm,
      sortConfig
    );

    expect(filteredTickets.length).toBe(1);
    expect(filteredTickets[0].column_name).toBe("Task 1");
  });

  test("filters tickets by multiple words in search term", () => {
    const sortConfig = { key: "column_name", direction: "ascending" };
    const searchTerm = "Task Ready";

    const filteredTickets = getFilteredTickets(
      tickets,
      users,
      searchTerm,
      sortConfig
    );

    expect(filteredTickets.length).toBe(1);
    expect(filteredTickets[0].column_name).toBe("Task 1");
  });

  test("filters tickets and handles user assignment", () => {
    const sortConfig = { key: "column_name", direction: "ascending" };
    const searchTerm = "Tom Smith";

    const filteredTickets = getFilteredTickets(
      tickets,
      users,
      searchTerm,
      sortConfig
    );

    expect(filteredTickets.length).toBe(2);
    expect(filteredTickets[0].email).toBe("user@example.com");
    expect(filteredTickets[1].email).toBe("user@example.com");
  });

  test("returns all tickets if no search term is provided", () => {
    const sortConfig = { key: "column_name", direction: "ascending" };
    const filteredTickets = getFilteredTickets(tickets, users, "", sortConfig);

    expect(filteredTickets.length).toBe(3);
  });

  test("returns an empty array if no tickets match the search term", () => {
    const sortConfig = { key: "column_name", direction: "ascending" };
    const searchTerm = "Non-existent Task";
    const filteredTickets = getFilteredTickets(
      tickets,
      users,
      searchTerm,
      sortConfig
    );

    expect(filteredTickets.length).toBe(0);
  });

  test("filters tickets and handles multiple search words", () => {
    const sortConfig = { key: "column_name", direction: "ascending" };
    const searchTerm = "Task 1 Description 1";

    const filteredTickets = getFilteredTickets(
      tickets,
      users,
      searchTerm,
      sortConfig
    );

    expect(filteredTickets.length).toBe(1);
    expect(filteredTickets[0].column_name).toBe("Task 1");
  });
});
