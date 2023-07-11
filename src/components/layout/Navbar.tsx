import {
  createStyles,
  Navbar,
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
  Modal,
  Box,
  Button,
} from "@mantine/core";
import {
  IconPlus,
  IconSelector,
  IconListNumbers,
  IconTrash,
  IconFolder,
  IconBuildingEstate,
  IconMapSearch,
  IconCheck,
  IconX,
  IconAdjustmentsAlt,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAllCollections } from "~/hooks/useQueries";
import { type Collection } from "~/types";
import { UserButton } from "./UserButton";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { makeRequest } from "~/lib/requestHelper";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { type AxiosError } from "axios";
import { Textarea, TextInput as TextInputForm } from "react-hook-form-mantine";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
};

type CollectionResponse = {
  message: string;
  data: Collection;
};

const schema = z.object({
  title: z
    .string()
    .nonempty({ message: "A title is required" })
    .min(1, { message: "Title must be at least 1 character long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z.string().max(5000, { message: "Description must be at most 5000 characters long" }),
});

const defaultValues: FormSchemaType = {
  title: "",
  description: "",
};

type FormSchemaType = z.infer<typeof schema>;

export function NavbarDefault({ opened, setOpened }: Props) {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const [newCollectionModalOpened, { open: openNewCollectionModal, close: closeNewCollectionModal }] =
    useDisclosure(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: colData, isLoading, isError, refetch } = useAllCollections({ session, status });
  const collections = colData?.data;

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        //HACK: redirect to search page
        void router.push("/properties");
      }
    });
  });

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
    },
    { icon: IconMapSearch, url: "/properties/polygon", label: "Map search" },
    { icon: IconTrash, url: "/properties/trash", label: "Trash" },
    { icon: IconAdjustmentsAlt, url: "/manage", label: "Control panel" },
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

  const { control, handleSubmit, reset, setError } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const newCollection = async (data: FormSchemaType) => {
    const formData = new FormData();

    formData.append("name", data.title);

    if (data.description) {
      formData.append("description", data.description);
    }

    return (await makeRequest(
      "me/lists",
      "POST",
      session?.user.access_token,
      formData,
      false,
      false
    )) as Promise<CollectionResponse>;
  };

  const { mutate } = useMutation({
    mutationFn: newCollection,
    onSuccess: () => {
      reset(defaultValues);
      closeNewCollectionModal();
      refetch().then().catch(null);
      notifications.show({
        title: "Collection created",
        message: "Collection created successfully",
        color: "teal",
        icon: <IconCheck size="1.5rem" />,
        autoClose: 10000,
      });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        setError("title", {
          type: "custom",
          message: "A collection with that name already exists",
        });
        return;
      }

      notifications.show({
        title: "Error",
        message: "An error occurred while creating the collection",
        color: "red",
        icon: <IconX size="1.5rem" />,
        autoClose: 10000,
      });
    },
  });

  return (
    <>
      <Modal opened={newCollectionModalOpened} onClose={closeNewCollectionModal} title="New Collection">
        <form
          /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
          onSubmit={handleSubmit(
            (data) => mutate(data),
            (error) => {
              console.log({ error });
            }
          )}
        >
          <Box maw={320} mx="auto">
            <TextInputForm label="Title" name="title" control={control} mb="xs" withAsterisk />
            <Textarea label="Description" name="description" control={control} autosize minRows={2} maxRows={4} />

            <Group position="center" mt="lg">
              <Button type="submit">Create Collection</Button>
            </Group>
          </Box>
        </form>
      </Modal>
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

        <Navbar.Section className={classes.section}>
          <div className={classes.mainLinks}>{mainLinks}</div>
        </Navbar.Section>

        <Navbar.Section className={classes.section}>
          <Group className={classes.sectionHeader} position="apart">
            <Text size="xs" weight={500} color="dimmed">
              My Collections
            </Text>
            <Tooltip color="gray" label="Create collection" withArrow position="right">
              <ActionIcon variant="default" size={18} onClick={openNewCollectionModal}>
                <IconPlus size="0.8rem" stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div className={classes.sectionContent}>{collectionLinks}</div>
        </Navbar.Section>
      </Navbar>
    </>
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
