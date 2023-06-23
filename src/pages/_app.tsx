import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Notifications } from "@mantine/notifications";

import { type ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { emCache } from "~/lib/emotionCache";
import "~/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Shell from "~/components/layout/Shell";
import { useState } from "react";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import Properties from "./properties";

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const cache = emCache();
  const router = useRouter();

  const isAppRoute = router.pathname !== "/" && !router.pathname.startsWith("/auth");

  const [search, setSearch] = useState({});
  const isPropertySearch: boolean | undefined = Component === Properties;

  return (
    <SessionProvider session={session}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} emotionCache={cache} withGlobalStyles withNormalizeCSS>
          <Notifications />
          <QueryClientProvider client={queryClient}>
            <NextNProgress options={{ showSpinner: false }} />
            {isAppRoute ? (
              <Shell useNavbarSearch={isPropertySearch} search={search} setSearch={setSearch}>
                {isPropertySearch ? (
                  <Properties {...pageProps} search={search} setSearch={setSearch} />
                ) : (
                  <Component {...pageProps} />
                )}
              </Shell>
            ) : (
              <Component {...pageProps} />
            )}
          </QueryClientProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </SessionProvider>
  );
};

export default MyApp;
