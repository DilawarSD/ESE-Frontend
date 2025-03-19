export async function getTickets() {
  try {
    const response = await fetch("/api/tickets");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error fetching data", error);
    return [];
  }
}

export default getTickets;
