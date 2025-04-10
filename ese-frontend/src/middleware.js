import { NextResponse } from "next/server";

function setCSPHeaders(request) {
  const cspPolicy = {
    "X-XSS-Protection": "1; mode=block",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://krgmdbikoraoeiuodjtx.supabase.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };

  console.log("CSP Policy applied:", cspPolicy);

  const response = NextResponse.next();

  Object.entries(cspPolicy).forEach(([header, value]) => {
    response.headers.set(header, value);
  });

  return response;
}

export function middleware(request) {
  console.log("Middleware executed");

  const response = setCSPHeaders(request);

  const url = request.nextUrl;
  if (url.search) {
    const params = new URLSearchParams(url.search);
    const sanitizedParams = new URLSearchParams();

    params.forEach((value, key) => {
      sanitizedParams.append(key, encodeURIComponent(value));
    });

    url.search = sanitizedParams.toString();
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|image|login|styles|edit|posts|$).*)",
  ],
};
