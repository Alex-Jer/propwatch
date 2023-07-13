import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import CardBackground from "~/components/CardBackground";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { ManagingTable } from "~/components/ManagingTable";
import { errorNotification, successNotification } from "~/components/PropertyCard";
import { useTagsManage } from "~/hooks/useQueries";
import { makeRequest } from "~/lib/requestHelper";
import { type TagManage } from "~/types";

const ManageTags: NextPage = () => {
  const { data: session, status } = useSession();
  const [activePage, setPage] = useState(1);
  const {
    data: tagData,
    isLoading,
    isError,
    refetch: refreshTags,
  } = useTagsManage({ session, status, page: activePage });
  const [tags, setTags] = useState<TagManage[]>([]);
  const [selectedTag, setSelectedTags] = useState<TagManage | null>(null);

  const [delModOpened, { open: delOpen, close: delClose }] = useDisclosure(false);

  useEffect(() => {
    setTags(tagData?.data ?? []);
  }, [tagData?.data]);

  useEffect(() => {
    if (isError) {
      errorNotification("There was an error loading your tags.");
    }
  }, [isError]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading collection.</div>;
  }

  const deleteTag = () => {
    if (selectedTag && selectedTag.id) {
      makeRequest(`me/tags/${selectedTag.id.toString()}`, "DELETE", session?.user.access_token)
        .then(() => {
          setSelectedTags(null);
          delClose();
          successNotification("This tag has been deleted.", "Tag deleted");
          refreshTags().then().catch(null);
        })
        .catch(() => errorNotification("An unknown error occurred while deleting this tag."));
    }
  };

  const deleteMultipleFunction = async (tags: TagManage[]) => {
    if (tags.length > 0) {
      const ids = tags.map((tag) => tag.id);
      const formData = new FormData();

      ids.forEach((id, index) => {
        formData.append(`tags[${index}]`, id.toString());
      });

      try {
        await makeRequest(`me/tags/`, "DELETE", session?.user.access_token, formData);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await refreshTags();
        successNotification("The selected tags have been deleted.", "Selected tags were deleted");
        return;
      } catch (e) {
        errorNotification("An unknown error occurred while deleting the selected tags.");
      }
    }
  };

  const tableColumns = [
    {
      accessor: "id",
      title: "ID",
      width: 75,
      sortable: true,
    },
    {
      accessor: "name",
      title: "Name",
      sortable: true,
      ellipsis: true,
      width: 150,
    },
    {
      accessor: "num_properties",
      title: "Properties",
      width: 100,
      sortable: true,
    },
  ];

  return (
    <>
      <Head>
        <title>Manage Tags</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmationModal
        opened={delModOpened}
        close={delClose}
        yesFunction={deleteTag}
        title="Delete tag"
        text="Are you sure you want to delete this tag?"
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />
      <CardBackground className="pt-4">
        <ManagingTable
          title="Manage Tags"
          records={tags}
          tableColumns={tableColumns}
          deleteFunction={(tag: TagManage) => {
            setSelectedTags(tag);
            delOpen();
          }}
          deleteMultipleFunction={deleteMultipleFunction}
          defaultSortStatus={{
            columnAccessor: "name",
            direction: "asc",
          }}
          pagination={{ activePage, setPage, total: tagData?.meta.last_page ?? 1 }}
        />
      </CardBackground>
    </>
  );
};

export default ManageTags;
