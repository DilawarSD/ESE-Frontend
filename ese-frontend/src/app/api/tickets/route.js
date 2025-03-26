import { NextResponse } from "next/server";
import CSRF from "csrf";

const csrf = new CSRF();

async function validateCSRF(req) {
  const tokenFromHeader = req.headers.get("x-csrf-token"); // Get CSRF token from request header

  if (
    !tokenFromHeader ||
    !(await csrf.verify(process.env.CSRF_SECRET, tokenFromHeader))
  ) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 }); // Reject if invalid
  }
}

// GET method
export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tickets-posts`,
      {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST method
export async function POST(req) {
  const csrfError = await validateCSRF(req); // Validate CSRF token
  if (csrfError) return csrfError;

  try {
    const ticketData = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tickets-posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(ticketData),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding ticket:", error);
    return NextResponse.json(
      { error: "Failed to add ticket" },
      { status: 500 }
    );
  }
}

// PUT method
export async function PUT(req) {
  const csrfError = await validateCSRF(req); // Validate CSRF token
  if (csrfError) return csrfError;

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract ID from URL

    const updatedTicketData = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tickets-posts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(updatedTicketData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update ticket");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// DELETE method
export async function DELETE(req) {
  const csrfError = await validateCSRF(req); // Validate CSRF token
  if (csrfError) return csrfError;

  try {
    const ticketData = await req.json();
    const { id } = ticketData;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tickets-posts`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ id }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
