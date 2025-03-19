import { NextResponse } from "next/server";

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

export async function POST(req) {
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
