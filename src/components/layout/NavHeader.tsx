import { Burger, Button, Container, Group, Header, createStyles, rem, Drawer } from "@mantine/core";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { IconAlertTriangle, IconHomePlus, IconSearch } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { PropertyForm } from "~/components/property";

type HeaderActionProps = {
  links?: { link: string; label: string }[];
  opened?: boolean;
  setOpened?: (opened: boolean) => void;
  isHero?: boolean;
};

const HEADER_HEIGHT = rem(60);

export function NavHeader({ links, opened, setOpened, isHero }: HeaderActionProps) {
  const { classes } = useStyles();
  const { data: session } = useSession();

  const router = useRouter();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

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
            color="gray"
            onClick={() => {
              //TODO: remove this
              void router.push("/manage/collections");
            }}
            leftIcon={<IconAlertTriangle size="1rem" className="-mr-1" />}
          >
            Temporary
          </Button>
          <Button
            className="mr-1"
            color="gray"
            onClick={() => {
              //HACK: Go to search page
              void router.push("/properties");
            }}
            leftIcon={<IconSearch size="1rem" className="-mr-1" />}
          >
            Search
          </Button>
          <Button onClick={openDrawer} leftIcon={<IconHomePlus size="1rem" className="-mr-1" />}>
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
        <Link href="/auth/signup">
          <Button>Sign up</Button>
        </Link>
      </>
    );
  };

  return (
    <>
      <Header
        height={HEADER_HEIGHT}
        sx={{ borderBottom: 0 }}
        mb={20}
        className={isHero ? classes.headerHero : classes.header}
      >
        <Container className={classes.inner} fluid>
          <Group>
            {!isHero && (
              <Burger
                opened={opened as boolean}
                onClick={() => setOpened?.(!opened)}
                className={classes.burger}
                size="sm"
              />
            )}
            <span className="w-44 cursor-default font-bold">realtywatch</span>
          </Group>

          <Group spacing={5} className={classes.links}>
            {items}
          </Group>

          <Group spacing={5} className={classes.links}>
            {renderButtons()}
          </Group>
        </Container>
      </Header>

      <Drawer
        title="Add Property"
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="75%"
        overlayProps={{ opacity: 0.5, blur: 4 }}
        keepMounted
        styles={{
          header: {
            display: "flex",
            flexDirection: "column",
            padding: "1rem 1.5rem",
          },
          title: {
            marginBottom: "1rem",
            fontSize: "1.5rem",
            fontWeight: 700,
          },
          close: {
            position: "absolute",
            top: 0,
            right: 0,
            margin: "1rem",
          },
        }}
      >
        <PropertyForm close={closeDrawer} />
      </Drawer>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: 0,
  },

  headerHero: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
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
