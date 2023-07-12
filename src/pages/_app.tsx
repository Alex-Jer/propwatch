import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { emCache } from "~/lib/emotionCache";
import "~/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Shell from "~/components/layout/Shell";
import { useState } from "react";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import Properties from "./properties";
import SearchPolygonProperties from "./properties/polygon";
import { useDebouncedState } from "@mantine/hooks";

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const cache = emCache();
  const router = useRouter();

  const isAppRoute =
    router.pathname !== "/" &&
    router.pathname !== "/403" &&
    router.pathname !== "/404" &&
    !router.pathname.startsWith("/auth");

  const [search, setSearch] = useDebouncedState("", 300);
  const [filters, setFilters] = useDebouncedState({}, 100);

  const isPropertySearch: boolean | undefined = Component == Properties || Component == SearchPolygonProperties;

  return (
    <SessionProvider session={session}>
      <MantineProvider theme={{ colorScheme: "dark" }} emotionCache={cache} withGlobalStyles withNormalizeCSS>
        <Notifications />
        <QueryClientProvider client={queryClient}>
          <NextNProgress options={{ showSpinner: false }} />
          {isAppRoute ? (
            <Shell
              useNavbarSearch={isPropertySearch}
              search={search}
              setSearch={setSearch}
              filters={filters}
              setFilters={setFilters}
            >
              {isPropertySearch ? (
                <Component
                  {...pageProps}
                  search={search}
                  setSearch={setSearch}
                  filters={filters}
                  setFilters={setFilters}
                />
              ) : (
                <Component {...pageProps} />
              )}
            </Shell>
          ) : (
            <Component {...pageProps} />
          )}
        </QueryClientProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default MyApp;
