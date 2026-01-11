import { NextRequest, NextResponse } from "next/server";

function isTruthy(v: string | null) {
  if (!v) return false;
  const s = v.toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const embed = url.searchParams.get("embed");
  const cookieEmbed = req.cookies.get("pv_embed")?.value === "1";

  const res = NextResponse.next();

  // ON: persist embed mode
  if (isTruthy(embed)) {
    res.cookies.set("pv_embed", "1", {
      path: "/",
      sameSite: "lax",
      secure: true,
      httpOnly: false, // boleh false karena ini cuma UI mode
    });
  }

  // OFF: optional untuk mematikan embed mode
  if (embed === "0" || embed === "off" || embed === "false") {
    res.cookies.set("pv_embed", "", {
      path: "/",
      maxAge: 0,
    });
  }

  // If embed is active via cookie, keep embed=1 in the URL for navigation.
  if (!embed && cookieEmbed && req.method === "GET") {
    const redirectUrl = url.clone();
    redirectUrl.searchParams.set("embed", "1");
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Optional: batasi matcher agar tidak kena static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
