export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/properties", "/collections", "/manage", "/profile", "/statistics"],
};
