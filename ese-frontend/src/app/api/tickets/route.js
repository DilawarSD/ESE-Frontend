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

    // Parse the response as JSON
    const data = await response.json();

    // Return the data back to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling Supabase:", error);
    return NextResponse.json({ error: "failed to fetch" }, { status: 404 });
  }
}
