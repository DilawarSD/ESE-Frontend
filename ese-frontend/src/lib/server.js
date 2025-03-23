// Function to get the list of users (GET request)
export async function getUsers() {
  try {
    const response = await fetch("/api/users");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Function to get the list of tickets (GET request)
export async function getTickets() {
  try {
    const response = await fetch("/api/tickets");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Function to add a new ticket (POST request)
export async function addTicket(ticketData) {
  try {
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error("Failed to add ticket");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding ticket:", error);
    return null;
  }
}

export async function updateTicket(ticketId, updatedData) {
  try {
    console.log("Updating ticket ID:", ticketId);
    const response = await fetch(`/api/tickets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: ticketId, ...updatedData }),
    });

    if (!response.ok) {
      throw new Error("Failed to update ticket");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating ticket:", error);
    return null;
  }
}

// Function to delete a ticket (DELETE request)
export async function deleteTicket(ticketId) {
  try {
    const response = await fetch(`/api/tickets`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: ticketId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete ticket");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return null;
  }
}

// Function to add a new user (POST request)
export async function addUser(userData) {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
}

// Function to update a user (PUT request)
export async function updateUser(userId, updatedData) {
  try {
    console.log("Updating user ID:", userId);
    const response = await fetch(`/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId, ...updatedData }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

// Function to delete a user (DELETE request)
export async function deleteUser(userId) {
  try {
    const response = await fetch(`/api/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
}

export default getTickets;
