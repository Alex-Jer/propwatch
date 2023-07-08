import {
  createStyles,
  Navbar,
  TextInput,
  Code,
  UnstyledButton,
  Badge,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconSelector,
  IconListNumbers,
  IconTrash,
  IconFolder,
  IconBuildingEstate,
  IconMapSearch,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAllCollections } from "~/hooks/useQueries";
import { type Collection } from "~/types";
import { UserButton } from "./UserButton";
import { useEffect, useRef } from "react";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
};

export function NavbarDefault({ opened, setOpened }: Props) {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: colData, isLoading, isError } = useAllCollections({ session, status });
  const collections = colData?.data;

  const searchInputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "k" && searchInputRef.current) {
        event.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        searchInputRef.current.focus();
      }
    });
  }, []);

  //TODO: Better organization; Better error/loading processing; Better planning

  if (isLoading) {
    console.log("Loading...");
  }

  if (isError) {
    console.log("Error!");
  }

  const links = [
    { icon: IconBuildingEstate, label: "All properties", url: "/properties" },
    {
      icon: IconListNumbers,
      label: "All collections",
      url: "/collections",
      notifications: colData?.total ?? 0,
    },
    { icon: IconMapSearch, url: "/properties/polygon", label: "Map search" },
    { icon: IconTrash, url: "/properties/trash", label: "Trash" },
  ];

  const mainLinks = links.map((link) => {
    const isActive = router.pathname === link.url;
    return (
      <Link href={link.url} key={link.label}>
        <UnstyledButton key={link.label} className={`${classes.mainLink} ${isActive ? classes.activeLink : ""}`}>
          <div className={classes.mainLinkInner}>
            <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
            <span>{link.label}</span>
          </div>
          {link.notifications && (
            <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
              {link.notifications}
            </Badge>
          )}
        </UnstyledButton>
      </Link>
    );
  });

  const collectionLinks = collections?.map((collection: Collection) => (
    <Link href={`/collections/${collection.id}`} key={collection.id}>
      <UnstyledButton key={collection.name} className={classes.mainLink}>
        <div className={classes.mainLinkInner}>
          <IconFolder size={20} className={classes.mainLinkIcon} stroke={1.5} />
          <p className="w-60 overflow-hidden truncate">{collection.name}</p>
        </div>
      </UnstyledButton>
    </Link>
  ));

  return (
    <Navbar width={{ sm: 300 }} p="md" pt={0} className={classes.navbar} hiddenBreakpoint="sm" hidden={!opened}>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger opened={opened} onClick={() => setOpened(!opened)} size="sm" color={theme.colors.gray[6]} mr="xl" />
      </MediaQuery>

      <Navbar.Section className={classes.section}>
        <UserButton
          image={session?.user?.photo_url || ""}
          name={session?.user?.name || "User"}
          icon={<IconSelector size="0.9rem" stroke={1.5} />}
        />
      </Navbar.Section>

      <TextInput
        placeholder="Search"
        size="xs"
        icon={<IconSearch size="0.8rem" stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ rightSection: { pointerEvents: "none" } }}
        mb="sm"
        onFocus={() => {
          //HACK: redirect to search page
          void router.push("/properties");
        }}
        ref={searchInputRef}
      />

      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.sectionHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            My Collections
          </Text>
          <Tooltip color="gray" label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size="0.8rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.sectionContent}>{collectionLinks}</div>
      </Navbar.Section>
    </Navbar>
  );
}

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    },
  },

  searchCode: {
    fontWeight: 700,
    fontSize: rem(10),
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
    border: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]}`,
  },

  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  activeLink: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: "none",
  },

  sectionContent: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md,
  },

  sectionHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5),
  },

  sectionLink: {
    display: "block",
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));
