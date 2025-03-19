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

export default getTickets;
