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
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type Collection } from "~/types";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { makeRequest } from "~/lib/requestHelper";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { type AxiosError } from "axios";
import { Textarea, TextInput as TextInputForm } from "react-hook-form-mantine";
import { useEffect, useState } from "react";

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

type FormSchemaType = z.infer<typeof schema>;

const defaultDefaultValues: FormSchemaType = {
  title: "",
  description: "",
};

type EditCollectionProps = {
  collection: Collection | null;
  modalOpened: boolean;
  close: () => void;
};

export function EditCollection({ collection, modalOpened, close }: EditCollectionProps) {
  const { data: session, status } = useSession();

  const [defaultValues, setDefaultValues] = useState<FormSchemaType>(defaultDefaultValues);

  const { control, handleSubmit, reset, setError } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    setDefaultValues({
      title: collection?.name ?? "",
      description: collection?.description ?? "",
    });
  }, [collection?.name, collection?.description, setDefaultValues]);

  const updateCollection = async (data: FormSchemaType) => {
    if (!collection?.id) return;
    const formData = new FormData();

    formData.append("name", data.title);

    if (data.description) {
      formData.append("description", data.description);
    }

    return (await makeRequest(
      `me/lists/${collection.id}`,
      "PUT",
      session?.user.access_token,
      formData
    )) as Promise<CollectionResponse>;
  };

  const { mutate } = useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      reset(defaultValues);
      close();
      notifications.show({
        title: "Collection edited",
        message: "Collection edited successfully",
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
        message: "An error occurred while editing the collection",
        color: "red",
        icon: <IconX size="1.5rem" />,
        autoClose: 10000,
      });
    },
  });

  return (
    <>
      <Modal opened={modalOpened} onClose={close} title="Edit Collection">
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
              <Button type="submit">Edit Collection</Button>
            </Group>
          </Box>
        </form>
      </Modal>
    </>
  );
}
