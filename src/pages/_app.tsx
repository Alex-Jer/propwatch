import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { MantineProvider } from "@mantine/core";
import { emCache } from "~/lib/emotionCache";
import "~/styles/globals.css";

import { NavHeader } from "~/components/header";

const links = [
  { link: "/features", label: "Features", links: [] },
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
        <NavHeader links={links} />
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
};

export default MyApp;
