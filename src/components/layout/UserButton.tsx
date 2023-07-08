import { zodResolver } from "@hookform/resolvers/zod";
import { UnstyledButton, Group, Avatar, Text, createStyles, Menu, Modal, Button, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconChevronRight, IconHomePlus, IconLogout, IconTextPlus, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Textarea, TextInput } from "react-hook-form-mantine";
import { z } from "zod";
import { logout, makeRequest } from "~/lib/requestHelper";
import { type Collection, type UserButtonProps } from "~/types";

type CollectionResponse = {
  message: string;
  data: Collection;
};

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

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

export function UserButton({ image, name, icon, ...others }: UserButtonProps) {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const router = useRouter();
  const [newCollectionModalOpened, { open: openNewCollectionModal, close: closeNewCollectionModal }] =
    useDisclosure(false);

  const { control, handleSubmit, reset, setError } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleLogout = async () => {
    if (!session) return;
    await router.push("/");
    await signOut({ redirect: false });
    await logout(session.user.access_token);
  };

  const newCollection = async (data: FormSchemaType) => {
    const formData = new FormData();

    formData.append("name", data.title);

    if (data.description) {
      formData.append("description", data.description);
    }

    return (await makeRequest("me/lists", "POST", session?.user.access_token, formData)) as Promise<CollectionResponse>;
  };

  const { mutate } = useMutation({
    mutationFn: newCollection,
    onSuccess: () => {
      reset(defaultValues);
      closeNewCollectionModal();
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
            <TextInput label="Title" name="title" control={control} mb="xs" withAsterisk />
            <Textarea label="Description" name="description" control={control} autosize minRows={2} maxRows={4} />

            <Group position="center" mt="lg">
              <Button type="submit">Create Collection</Button>
            </Group>
          </Box>
        </form>
      </Modal>
      <Group position="center">
        <Menu withArrow width={280} position="bottom" transitionProps={{ transition: "pop" }} withinPortal>
          <Menu.Target>
            <UnstyledButton className={classes.user} {...others}>
              <Group>
                <Avatar src={image} size="sm" radius="xl" />

                <div style={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {name}
                  </Text>
                </div>

                {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconTextPlus size="0.9rem" stroke={1.5} />} onClick={openNewCollectionModal}>
              New Collection
            </Menu.Item>
            <Menu.Item icon={<IconHomePlus size="0.9rem" stroke={1.5} />}>Add Property</Menu.Item>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item icon={<IconLogout size="0.9rem" stroke={1.5} />} onClick={() => void handleLogout()}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </>
  );
}
