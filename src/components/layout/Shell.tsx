import { AppShell, useMantineTheme } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { type ShellProps } from "~/types";
import { NavbarDefault } from "./Navbar";
import { NavbarSearch } from "./NavbarSearch";
import { NavHeader } from "./NavHeader";

const Shell = ({ children, useNavbarSearch, setSearch, filters, setFilters }: ShellProps) => {
  const { status } = useSession();
  const router = useRouter();
  const theme = useMantineTheme();

  const [opened, setOpened] = useState(false);

  if (status === "loading") return null;
  if (status === "unauthenticated") {
    void router.push("/403");
    return null;
  }

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      }}
      layout="alt"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        useNavbarSearch ? (
          <NavbarSearch
            opened={opened}
            setOpened={setOpened}
            setSearch={setSearch}
            filters={filters}
            setFilters={setFilters}
          />
        ) : (
          <NavbarDefault opened={opened} setOpened={setOpened} />
        )
      }
      header={<NavHeader opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  );
};

export default Shell;
