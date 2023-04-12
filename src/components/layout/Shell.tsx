import { AppShell } from "@mantine/core";
import { ReactNode } from "react";
import { NavHeader } from "./Header";
import { NavbarSearch } from "./Navbar";

interface ShellProps {
  children: ReactNode;
}

const links = [
  { link: "/lists", label: "My Lists", links: [] },
  { link: "/learn", label: "Learn", links: [] },
  { link: "/about", label: "About", links: [] },
  { link: "/pricing", label: "Pricing", links: [] },
  { link: "/support", label: "Support", links: [] },
];

const Shell = ({ children }: ShellProps) => (
  <AppShell
    padding="md"
    navbar={<NavbarSearch />}
    header={<NavHeader links={links} />}
    styles={(theme) => ({
      main: { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
    })}
  >
    {children}
  </AppShell>
);

export default Shell;
