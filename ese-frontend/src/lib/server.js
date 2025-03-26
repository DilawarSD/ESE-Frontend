// Function to get CSRF token
async function getCSRFToken() {
  try {
    const response = await fetch("/api/csrf");
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
}

// Function to get the list of tickets (GET request)
export async function getTickets() {
  try {
    const csrfToken = await getCSRFToken(); // Get CSRF token
    const response = await fetch("/api/tickets", {
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // Attach CSRF token
      },
    });
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
    const csrfToken = await getCSRFToken(); // Get CSRF token
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // Attach CSRF token
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

// Function to update a ticket (PUT request)
export async function updateTicket(ticketId, updatedData) {
  try {
    const csrfToken = await getCSRFToken(); // Get CSRF token
    const response = await fetch(`/api/tickets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // Attach CSRF token
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
    const csrfToken = await getCSRFToken(); // Get CSRF token
    const response = await fetch(`/api/tickets`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // Attach CSRF token
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

// Function to get the list of users (GET request)
export async function getUsers() {
  try {
    const csrfToken = await getCSRFToken(); // Get CSRF token
    const response = await fetch("/api/users", {
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // Attach CSRF token
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Function to add a new user (POST request)
export async function addUser(userData) {
  try {
    const csrfToken = await getCSRFToken(); // Get CSRF token
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // Attach CSRF token
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
    const csrfToken = await getCSRFToken(); // Get CSRF token
    const response = await fetch(`/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // Attach CSRF token
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
    const csrfToken = await getCSRFToken(); // Get CSRF token
    const response = await fetch(`/api/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // Attach CSRF token
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
