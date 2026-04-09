import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;
      // allow public routes
      if (pathname.startsWith("/api/auth")) return true;
      // dashboard requires authentication
      if (pathname.startsWith("/dashboard")) return !!token;
      // admin requires admin role
      if (pathname.startsWith("/admin")) return token?.role === "admin";
      return true;
    },
  },
});

export const config = {
  matcher: [
    "/order/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/auth/:path*",
  ],
};
