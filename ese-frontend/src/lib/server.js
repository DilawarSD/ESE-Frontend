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

export default getTickets;
