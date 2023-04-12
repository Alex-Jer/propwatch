import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { MantineProvider } from "@mantine/core";
import { emCache } from "~/lib/emotionCache";
import "~/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Shell from "~/components/layout/Shell";

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const cache = emCache();
  return (
    <SessionProvider session={session}>
      <MantineProvider emotionCache={cache} withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
        <QueryClientProvider client={queryClient}>
          <Shell>
            <Component {...pageProps} />
          </Shell>
        </QueryClientProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default MyApp;
