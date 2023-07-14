import {
  createStyles,
  Navbar,
  TextInput,
  Code,
  UnstyledButton,
  Badge,
  Text,
  Group,
  rem,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import {
  IconSearch,
  IconSelector,
  IconListNumbers,
  IconTrash,
  IconFolder,
  IconBuildingEstate,
  IconTag,
  IconMapSearch,
  IconFilterOff,
  IconFolderOff,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSidebarCollections, useTagsSidebar } from "~/hooks/useQueries";
import type { FiltersOptions, Collection, Tag } from "~/types";
import { UserButton } from "./UserButton";
import { useEffect, useRef } from "react";
import { PropertyFilters } from "../PropertyFilters";
import { CreateCollectionTooltip } from "../collections/CreateCollectionTooltip";
import { useDebouncedState } from "@mantine/hooks";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  setSearch?: (search: string) => void;
  filters: FiltersOptions;
  setFilters: (search: FiltersOptions) => void;
};

export function NavbarSearch({ opened, setOpened, setSearch, filters, setFilters }: Props) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { query } = useRouter();

  const { data: colData } = useSidebarCollections({ session, status });
  const { data: tags } = useTagsSidebar({ session, status });

  const collections = colData?.data;

  const searchInputRef = useRef(null);
  const [clearFilters, setClearFilters] = useDebouncedState(false, 100);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "k" && searchInputRef.current) {
        event.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        searchInputRef.current.focus();
      }
    });
  }, []);

  const links = [
    { icon: IconBuildingEstate, label: "All properties", url: "/properties" },
    {
      icon: IconListNumbers,
      label: "All collections",
      url: "/collections",
    },
    { icon: IconMapSearch, url: "/properties/polygon", label: "Map search" },
    { icon: IconTrash, url: "/properties/trash", label: "Trash" },
  ];

  const mainLinks = links.map((link) => {
    const isActive = router.pathname === link.url;
    return (
      <Link href={link.url} key={link.label}>
        <UnstyledButton
          key={link.label}
          className={`${classes.mainLink} ${isActive ? classes.activeLink : ""}`}
          onClick={() => {
            setFilters({});
          }}
        >
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

  const collectionLinks = collections?.map((collection: Collection) => {
    const active = filters.list == collection.id;
    const color = active ? classes.active : "";

    return (
      <UnstyledButton
        onClick={() => {
          if (!active) {
            setFilters({ ...filters, list: collection.id });
          } else {
            setFilters({ ...filters, list: undefined });
          }
        }}
        key={collection.id}
        className={classes.mainLink}
      >
        <div className={`${classes.mainLinkInner} ${color}`}>
          <IconFolder size={20} className={`${classes.mainLinkIcon} ${color}`} stroke={1.5} />
          <p className="w-60 overflow-hidden truncate">{collection.name}</p>
        </div>
      </UnstyledButton>
    );
  });

  const noCollectionLink = () => {
    const active = filters.list == "-1";
    const color = active ? classes.active : "";

    return (
      <UnstyledButton
        onClick={() => {
          if (!active) {
            setFilters({ ...filters, list: "-1" });
          } else {
            setFilters({ ...filters, list: undefined });
          }
        }}
        key={"-1"}
        className={classes.mainLink}
      >
        <div className={`${classes.mainLinkInner} ${color}`}>
          <IconFolderOff size={20} className={`${classes.mainLinkIcon} ${color}`} stroke={1.5} />
          <p className="w-60 overflow-hidden truncate">Unsorted</p>
        </div>
      </UnstyledButton>
    );
  };

  const addToList = (list: string[] | undefined, newElement: string): string[] => {
    const listReturn = list ?? [];
    listReturn.push(newElement);
    return listReturn;
  };

  const removeFromList = (list: string[] | undefined, element: string): string[] => {
    const listReturn = list ?? [];
    listReturn.splice(listReturn.indexOf(element), 1);
    return listReturn;
  };

  const tagLinks = tags?.map((tag: Tag) => {
    const enabledTags = filters.include_tags?.includes(tag.id.toString());
    const disabledTags = filters.exclude_tags?.includes(tag.id.toString());
    const color = enabledTags ? classes.enabled : disabledTags ? classes.disabled : "";

    return (
      <UnstyledButton
        onClick={() => {
          if (!enabledTags && !disabledTags) {
            setFilters({ ...filters, include_tags: addToList(filters.include_tags, tag.id.toString()) });
          } else if (enabledTags) {
            setFilters({
              ...filters,
              include_tags: removeFromList(filters.include_tags, tag.id.toString()),
              exclude_tags: addToList(filters.exclude_tags, tag.id.toString()),
            });
          } else if (disabledTags) {
            setFilters({ ...filters, exclude_tags: removeFromList(filters.exclude_tags, tag.id.toString()) });
          }
        }}
        key={tag.id}
        className={`${classes.mainLink} ${color}`}
      >
        <div className={`${classes.mainLinkInner}`}>
          <IconTag size={20} className={`${classes.mainLinkIcon} ${color}`} stroke={1.5} />
          <span>{tag.name}</span>
        </div>
      </UnstyledButton>
    );
  });

  return (
    <Navbar
      width={{ sm: 300 }}
      p="md"
      pt={0}
      className={`${classes.navbar} overflow-auto`}
      hiddenBreakpoint="sm"
      hidden={!opened}
    >
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

      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </Navbar.Section>

      <TextInput
        placeholder="Search by title or description"
        size="xs"
        icon={<IconSearch size="0.8rem" stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ rightSection: { pointerEvents: "none" } }}
        onChange={(event) => {
          if (!!event.target && setSearch) setSearch(event.target.value);
        }}
        defaultValue={query?.searchQuery ?? ""}
        mb="sm"
        ref={searchInputRef}
      />

      <PropertyFilters
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        setClearFilters={setClearFilters}
      />

      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>
          <UnstyledButton
            className={classes.mainLink}
            onClick={() => {
              if (setSearch) setSearch("");
              setFilters({});
              setClearFilters(true);
            }}
          >
            <div className={classes.mainLinkInner}>
              <IconFilterOff className={classes.mainLinkIcon} size={20} stroke={1.5} />
              <span>Reset Filters</span>
            </div>
          </UnstyledButton>
        </div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.sectionHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            My Collections
          </Text>
          <CreateCollectionTooltip />
        </Group>
        <div className={classes.sectionContent}>
          {noCollectionLink()}
          {collectionLinks}
        </div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.sectionHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            My Tags
          </Text>
        </Group>
        <div className={classes.sectionContent}>{tagLinks}</div>
      </Navbar.Section>
    </Navbar>
  );
}

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
    "&::-webkit-scrollbar": {
      display: "none" /* Chromium */,
    },
    scrollbarWidth: "none" /* Firefox */,
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `${rem(1)} solid ${theme.colors.dark[4]}`,
    },
  },

  searchCode: {
    fontWeight: 700,
    fontSize: rem(10),
    backgroundColor: theme.colors.dark[7],
    border: `${rem(1)} solid ${theme.colors.dark[7]}`,
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
    color: theme.colors.dark[0],

    "&:hover": {
      backgroundColor: theme.colors.dark[6],
      color: theme.white,
    },
  },

  activeLink: {
    backgroundColor: theme.colors.dark[6],
    color: theme.white,

    "&:hover": {
      backgroundColor: theme.colors.dark[6],
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  active: {
    color: theme.colors.blue[5],
  },

  enabled: {
    color: theme.colors.blue[5],

    "&:hover": {
      color: theme.colors.blue[5],
    },
  },

  disabled: {
    textDecoration: "line-through",
    color: theme.colors.dark[3],

    "&:hover": {
      color: theme.colors.dark[3],
    },
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colors.dark[2],
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
