// middleware.ts
import { withAuth } from "next-auth/middleware";

// navItems definition
const navItems = [
  { path: "/" },
  { path: "/transactions" },
  { path: "/users" },
  { subItems: [{ path: "/pending-ads" }, { path: "/running-ads" }] },
  { subItems: [{ path: "/header-links" }, { path: "/side-links" }, { path: "/responsive-links" }, { path: "/rainbow-links" }] },
  { subItems: [{ path: "/add-blogs" }, { path: "/blogs-list" }] },
  { path: "/reports" },
];

// flatten all paths including subItems
const paths: string[] = navItems.flatMap(item => 
  item.path ? [item.path] : item.subItems?.map(sub => sub.path) || []
);

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // only allow if token exists
  },
  pages: {
    signIn: "/signin", // redirect here if not authorized
  },
});

export const config = {
  matcher: paths.map(p => `${p}`), // include all paths dynamically
};
