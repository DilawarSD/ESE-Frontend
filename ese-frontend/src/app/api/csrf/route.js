import CSRF from "csrf";
import { NextResponse } from "next/server";

const csrf = new CSRF();

export async function GET() {
  const token = await csrf.create(process.env.CSRF_SECRET); // Generate CSRF token

  return NextResponse.json({ csrfToken: token }); // Return token in response
}
