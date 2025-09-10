import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/campaigns/:path*",
    "/messages/:path*",
    "/linkedin-accounts/:path*",
    "/settings/:path*",
    "/activity-logs/:path*",
    "/user-logs/:path*"
    // add any routes you want protected
  ],
};
