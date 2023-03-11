import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { emCache } from "lib/emotionCache";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const cache = emCache();
  return (
    <SessionProvider session={session}>
      <MantineProvider emotionCache={cache} withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
};

export default MyApp;
