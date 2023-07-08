import { Burger, Button, Container, Group, Header, createStyles, rem } from "@mantine/core";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { IconHomePlus, IconSearch } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { AddPropertyDrawer } from "../AddPropertyDrawer";
import { useRouter } from "next/router";

type HeaderActionProps = {
  links?: { link: string; label: string }[];
  opened: boolean;
  setOpened: (opened: boolean) => void;
};

const HEADER_HEIGHT = rem(60);

export function NavHeader({ links, opened, setOpened }: HeaderActionProps) {
  const { classes } = useStyles();
  const { data: session } = useSession();

  const router = useRouter();

  const [drawerOpened, { open, close }] = useDisclosure(false);

  const items = links?.map((link) => {
    return (
      <Link key={link.label} href={link.link}>
        <span className={classes.link}>{link.label}</span>
      </Link>
    );
  });

  const renderButtons = () => {
    if (session) {
      return (
        <>
          <Button
            className="mr-1"
            onClick={() => {
              //HACK: Go to search page
              void router.push("/properties");
            }}
            leftIcon={<IconSearch size="1rem" className="-mr-1" />}
          >
            Search
          </Button>
          <Button onClick={open} leftIcon={<IconHomePlus size="1rem" className="-mr-1" />}>
            Add Property
          </Button>
        </>
      );
    }

    return (
      <>
        <Link href="/auth/login">
          <Button variant="default">Log in</Button>
        </Link>
        <Button>Sign up</Button>
      </>
    );
  };

  return (
    <>
      <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={20} className={classes.header}>
        <Container className={classes.inner} fluid>
          <Group>
            <Burger opened={opened} onClick={() => setOpened(!opened)} className={classes.burger} size="sm" />
            <Link href="/">
              <span className="w-44 font-bold">realtywatch</span>
            </Link>
          </Group>

          <Group spacing={5} className={classes.links}>
            {items}
          </Group>

          <Group spacing={5} className={classes.links}>
            {renderButtons()}
          </Group>
        </Container>
      </Header>

      <AddPropertyDrawer opened={drawerOpened} close={close} />
    </>
  );
}

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
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
