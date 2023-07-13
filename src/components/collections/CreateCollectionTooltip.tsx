import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Box, Button, Group, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Textarea, TextInput } from "react-hook-form-mantine";
import { z } from "zod";
import { makeRequest, processAxiosError } from "~/lib/requestHelper";
import { type AxiosErrorResponse, type Collection } from "~/types";
import { successNotification } from "../PropertyCard";

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

type CreateCollectionTooltipProps = {
  refetch: () => Promise<unknown>;
};

export function CreateCollectionTooltip({ refetch }: CreateCollectionTooltipProps) {
  const { data: session } = useSession();

  const [newCollectionModalOpened, { open: openNewCollectionModal, close: closeNewCollectionModal }] =
    useDisclosure(false);

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
      successNotification("Collection created successfully", "Collection created");
    },
    onError: (error: AxiosErrorResponse) => {
      if (error.response?.status === 409) {
        setError("title", {
          type: "custom",
          message: "A collection with that name already exists",
        });
        return;
      }
      processAxiosError(error, "An error occurred while creating the collection");
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
      <Tooltip color="gray" label="Create collection" withArrow position="right">
        <ActionIcon variant="default" size={18} onClick={openNewCollectionModal}>
          <IconPlus size="0.8rem" stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
