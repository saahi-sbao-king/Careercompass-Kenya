export { auth as middleware } from "@/auth";

export const config = {
  // Protect dashboard, admin, and profile routes
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
