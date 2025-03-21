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
      // No ticketId in URL
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: ticketId, ...updatedData }), // Send ID in body
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
      body: JSON.stringify({ id: ticketId }), // Send the ID of the ticket to delete
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

export default getTickets;
