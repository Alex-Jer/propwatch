import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { MantineProvider } from "@mantine/core";
import { emCache } from "~/lib/emotionCache";
import "~/styles/globals.css";

import { NavHeader } from "~/components/header";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const links = [
  { link: "/lists", label: "My Lists", links: [] },
  { link: "/learn", label: "Learn", links: [] },
  { link: "/about", label: "About", links: [] },
  { link: "/pricing", label: "Pricing", links: [] },
  { link: "/support", label: "Support", links: [] },
];

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const cache = emCache();
  return (
    <SessionProvider session={session}>
      <MantineProvider emotionCache={cache} withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
        <QueryClientProvider client={queryClient}>
          <NavHeader links={links} />
          <Component {...pageProps} />
        </QueryClientProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default MyApp;
