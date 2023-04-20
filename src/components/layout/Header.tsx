import { Burger, Button, Container, Group, Header, createStyles, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import { HeaderActionProps } from "~/types";

const HEADER_HEIGHT = rem(60);

export function NavHeader({ links }: HeaderActionProps) {
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();

  const items = links.map((link) => {
    // const menuItems = link.links?.map((item) => <Menu.Item key={item.link}>{item.label}</Menu.Item>);

    // if (menuItems) {
    //   return (
    //     <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
    //       <Menu.Target>
    //         <a href={link.link} className={classes.link} onClick={(event) => event.preventDefault()}>
    //           <Center>
    //             <span className={classes.linkLabel}>{link.label}</span>
    //             {/* <IconChevronDown size={rem(12)} stroke={1.5} /> */}
    //           </Center>
    //         </a>
    //       </Menu.Target>
    //       {/* <Menu.Dropdown>{menuItems}</Menu.Dropdown> */}
    //     </Menu>
    //   );
    // }

    return (
      <Link key={link.label} href={link.link}>
        <span className={classes.link}>{link.label}</span>
      </Link>
    );
  });

  const redirectToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={20} className={classes.header}>
      <Container className={classes.inner} fluid>
        <Group>
          <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
          {/* <MantineLogo size={28} /> */}
          <Link href="/">
            <span className="w-44">Lorem Ipsum</span>
          </Link>
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group spacing={5} className={classes.links}>
          <Button variant="default" onClick={redirectToLogin}>
            Log in
          </Button>
          <Button>Sign up</Button>
        </Group>
      </Container>
    </Header>
  );
}

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    borderBottom: 0,
  },

  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));
