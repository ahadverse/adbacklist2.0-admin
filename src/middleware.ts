import { withAuth } from "next-auth/middleware";

export const middleware = withAuth({
  // Options (optional)
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: [
    "/",
    "/transactions",
    "/users",
    "/pending-ads",
    "/running-ads",
    "/header-links",
    "/side-links",
    "/responsive-links",
    "/rainbow-links",
    "/add-blogs",
    "/blogs-list",
    "/reports",
  ],
};
