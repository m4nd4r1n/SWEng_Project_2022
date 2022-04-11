import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Bot is not allowed.", { status: 403 });
  }
  if (!req.url.includes("/api")) {
    if (
      !req.url.includes("/enter") &&
      !req.url.includes("/register") &&
      !req.cookies.DNSession
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/enter";
      return NextResponse.rewrite(url);
    } else if (
      (req.url.includes("/enter") || req.url.includes("/register")) &&
      req.cookies.DNSession
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.rewrite(url);
    }
  }
}
