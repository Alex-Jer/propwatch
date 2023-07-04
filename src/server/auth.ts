import { type GetServerSidePropsContext } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { login } from "~/lib/requestHelper";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    photo_url: string;
    access_token: string;
    csrf_token: string;
  }

  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  type LoginResponse = {
    message: string;
    user: User;
    access_token: string;
    csrf_token: string;
  };
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.access_token;
        token.csrf_token = user.csrf_token;
        token.photo_url = user.photo_url;
      }
      return token;
    },

    session({ session, token }) {
      session.user.access_token = token.id as string;
      session.user.csrf_token = token.csrf_token as string;
      session.user.photo_url = token.photo_url as string;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const res = await login(credentials.email, credentials.password, "web");
        console.log(res.headers);

        const user = res.data && {
          ...res.data.user,
          access_token: res.data.access_token,
          csrf_token: res.data.csrf_token,
        };

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
