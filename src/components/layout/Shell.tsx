import { AppShell, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { type ShellProps } from "~/types";
import { NavHeader } from "./Header";
import { NavbarDefault } from "./Navbar";

const links = [
  { link: "/collections", label: "My Collections", links: [] },
  { link: "/about", label: "About", links: [] },
];

const Shell = ({ children }: ShellProps) => {
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
      navbar={<NavbarDefault opened={opened} setOpened={setOpened} />}
      header={<NavHeader links={links} />}
    >
      {children}
    </AppShell>
  );
};

export default Shell;
