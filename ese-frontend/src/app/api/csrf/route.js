import CSRF from "csrf";
import { NextResponse } from "next/server";

const csrf = new CSRF();

export async function GET() {
  const token = await csrf.create(process.env.CSRF_SECRET);

  return NextResponse.json({ csrfToken: token });
}
