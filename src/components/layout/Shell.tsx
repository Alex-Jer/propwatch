import { AppShell, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { type ShellProps } from "~/types";
import { NavHeader } from "./NavHeader";
import { NavbarDefault } from "./Navbar";
import { NavbarSearch } from "./NavbarSearch";

const Shell = ({ children, useNavbarSearch }: ShellProps) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

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
          <NavbarSearch opened={opened} setOpened={setOpened} />
        ) : (
          <NavbarDefault opened={opened} setOpened={setOpened} />
        )
      }
      header={<NavHeader />}
    >
      {children}
    </AppShell>
  );
};

export default Shell;
