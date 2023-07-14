import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
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
  const {
    data: colData,
    isLoading,
    isError,
    refetch: refreshCollections,
  } = useCollections({ session, status, page: activePage });

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
      errorNotification("There was an error loading your collections.");
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
          successNotification("This collection has been deleted.", "Collection deleted");
          refreshCollections().then().catch(null);
        })
        .catch(() => errorNotification("An unknown error occurred while deleting this collection."));
    }
  };

  const deleteMultipleFunction = async (cols: Collection[]) => {
    if (cols.length > 0) {
      const ids = cols.map((col) => col.id);
      const formData = new FormData();

      ids.forEach((id, index) => {
        formData.append(`lists[${index}]`, id);
      });

      try {
        await makeRequest(`me/lists/`, "DELETE", session?.user.access_token, formData);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await refreshCollections();
        successNotification("The selected collections have been deleted.", "Selected collections were deleted");
        return;
      } catch (e) {
        errorNotification("An unknown error occurred while deleting the selected collections.");
      }
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
        <ManagingTable
          title="Manage Collections"
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
          deleteMultipleFunction={deleteMultipleFunction}
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
