import { Group, Pagination, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconX } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardBackground from "~/components/CardBackground";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { ManagingTable } from "~/components/ManagingTable";
import { errorNotification, successNotification } from "~/components/PropertyCard";
import { EditCollection } from "~/components/collections/EditCollection";
import { useCollections } from "~/hooks/useQueries";
import { makeRequest } from "~/lib/requestHelper";
import { type Collection } from "~/types";

const ManageCollections: NextPage = () => {
  const { data: session, status } = useSession();
  const [activePage, setPage] = useState(1);
  const { data: colData, isLoading, isError } = useCollections({ session, status, page: activePage });
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const [editModalOpened, { open: editOpen, close: editClose }] = useDisclosure(false);

  const [delModOpened, { open: delOpen, close: delClose }] = useDisclosure(false);

  const router = useRouter();

  useEffect(() => {
    setCollections(colData?.data ?? []);
  }, [colData?.data]);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Error",
        message: "There was an error loading your collections.",
        color: "red",
        icon: <IconX size="1.5rem" />,
      });
    }
  }, [isError]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading collection.</div>;
  }

  const deleteCollection = () => {
    if (selectedCollection && selectedCollection.id) {
      makeRequest(`me/lists/${selectedCollection.id.toString()}`, "DELETE", session?.user.access_token)
        .then(() => {
          setSelectedCollection(null);
          delClose();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          colData.data = collections.filter((col) => col.id !== selectedCollection.id);
          successNotification("This collection has been deleted", "Collection deleted");
        })
        .catch(() => errorNotification("An unknown error occurred while deleting this collection."));
    }
  };

  const tableColumns = [
    {
      accessor: "id",
      title: "ID",
      width: 50,
      sortable: true,
    },
    {
      accessor: "name",
      title: "Name",
      sortable: true,
      ellipsis: true,
      width: 300,
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
        <title>Manage Collections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EditCollection
        collections={collections}
        collection={selectedCollection}
        modalOpened={editModalOpened}
        close={editClose}
      />
      <ConfirmationModal
        opened={delModOpened}
        close={delClose}
        yesFunction={deleteCollection}
        title="Delete collection"
        text="Are you sure you want to delete this collection?"
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />
      <CardBackground className="pt-4">
        <h1 className="mb-2">Manage Collections</h1>
        <ManagingTable
          records={collections}
          tableColumns={tableColumns}
          viewFunction={(col: Collection) => void router.push(`/collections/${col.id}`)}
          editFunction={(col: Collection) => {
            setSelectedCollection(col);
            editOpen();
          }}
          deleteFunction={(col: Collection) => {
            setSelectedCollection(col);
            delOpen();
          }}
          deleteMultipleFunction={(cols: Collection[]) => {
            return false;
          }}
          defaultSortStatus={{
            columnAccessor: "name",
            direction: "asc",
          }}
          pagination={{ activePage, setPage, total: colData?.meta.last_page ?? 1 }}
        />
      </CardBackground>
    </>
  );
};

export default ManageCollections;
