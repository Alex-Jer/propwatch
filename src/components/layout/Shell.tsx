import { AppShell, useMantineTheme } from "@mantine/core";
import { ReactNode, useState } from "react";
import { NavHeader } from "./Header";
import { NavbarSearch } from "./Navbar";

interface ShellProps {
  children: ReactNode;
}

const links = [
  { link: "/lists", label: "My Lists", links: [] },
  { link: "/about", label: "About", links: [] },
  { link: "/pricing", label: "Pricing", links: [] },
  { link: "/support", label: "Support", links: [] },
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
      navbar={<NavbarSearch opened={opened} setOpened={setOpened} />}
      header={<NavHeader links={links} />}
    >
      {children}
    </AppShell>
  );
};

export default Shell;
