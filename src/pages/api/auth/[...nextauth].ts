import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

/* export default NextAuth(authOptions); */

const authHandler = (req, res) => {
  return NextAuth(req, res, authOptions);
};

export default authHandler;
