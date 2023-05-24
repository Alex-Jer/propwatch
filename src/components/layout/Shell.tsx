import { AppShell, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { type ShellProps } from "~/types";
import { NavbarDefault } from "./Navbar";
import { NavbarSearch } from "./NavbarSearch";
import { NavHeader } from "./NavHeader";

const links = [{ link: "/collections", label: "My Collections" }];

const Shell = ({ children, useNavbarSearch, search, setSearch }: ShellProps) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      layout="alt"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        useNavbarSearch ? (
          <NavbarSearch opened={opened} setOpened={setOpened} search={search} setSearch={setSearch} />
        ) : (
          <NavbarDefault opened={opened} setOpened={setOpened} />
        )
      }
      header={<NavHeader links={links} />}
    >
      {children}
    </AppShell>
  );
};

export default Shell;
