import { Button, Group, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBackUpDouble, IconTrash, IconTrashX } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { PropertyCard, errorNotification, successNotification } from "~/components/PropertyCard";
import { useTrashedProperties } from "~/hooks/useQueries";
import { makeRequest } from "~/lib/requestHelper";
import { type CollectionProperty } from "~/types";

const TrashedProperties: NextPage = () => {
  const { data: session, status } = useSession();
  const [activePage, setPage] = useState(1);

  const [restoreOpened, { open: openRestore, close: closeRestore }] = useDisclosure(false);
  const [emptyTrashOpened, { open: openEmptyTrash, close: closeEmptyTrash }] = useDisclosure(false);

  const {
    data: propData,
    isLoading,
    isError,
    refetch,
  } = useTrashedProperties({
    session,
    status,
    page: activePage,
  });

  const properties: CollectionProperty[] | undefined = propData?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading properties.</div>;
  }

  const restoreAll = () => {
    makeRequest(`me/properties/trashed/restore`, "PATCH", session?.user.access_token)
      .then(() => {
        successNotification("All trashed properties have been restored!", "All properties restored");
      })
      .catch((err) => {
        errorNotification("An unknown error occurred while restoring this property.");
        //TODO
        console.log("Error: ", err, " while restoring all properties.");
      })
      .finally(() => {
        void refetch();
      });
  };

  const emptyTrash = () => {
    makeRequest(`me/properties/trashed`, "DELETE", session?.user.access_token)
      .then(() => {
        successNotification("All trashed properties have been permanently deleted!", "Trash emptied");
      })
      .catch((err) => {
        errorNotification("An unknown error occurred while emptying the trash.");
        //TODO
        console.log("Error: ", err, " while permanently deleting all properties.");
      })
      .finally(() => {
        void refetch();
      });
  };

  const renderProperties = (properties: CollectionProperty[] | undefined) => {
    if (!properties) {
      return <></>;
    }

    return (
      <>
        {properties.map((property: CollectionProperty) => {
          return (
            <PropertyCard
              image={property.cover_url}
              title={property.title}
              author={property.type}
              key={property.id}
              id={property.id}
              trashButtons={true}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              refresh={refetch}
            />
          );
        })}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Trash - Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConfirmationModal
        opened={restoreOpened}
        close={closeRestore}
        yesFunction={restoreAll}
        yesBtn={{ text: "Restore", color: "teal", variant: "filled" }}
        noBtn={{ text: "Cancel", variant: "default" }}
        text="Are you sure you want to restore all properties?"
      />

      <ConfirmationModal
        opened={emptyTrashOpened}
        close={closeEmptyTrash}
        yesFunction={emptyTrash}
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrashX size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
        text="Are you sure you want to permanently delete all the properties in the trash?"
      />

      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <IconTrash className="-mt-1 mr-2" strokeWidth={1.5} />
          <h1 className="pb-1 text-base font-semibold">Trashed Properties</h1>
          <h3 className="ml-2 text-xs font-semibold text-gray-600">Hover over a property to delete or restore it.</h3>
        </div>

        <div>
          <Button
            className="mr-2"
            variant="default"
            onClick={openRestore}
            leftIcon={<IconArrowBackUpDouble size="1rem" />}
          >
            Restore all
          </Button>
          <Button variant="default" onClick={openEmptyTrash} leftIcon={<IconTrashX size="1rem" />}>
            Empty trash
          </Button>
        </div>
      </div>

      <div className="-mx-4 mb-4 border-b border-shark-700" />
      {properties?.length && properties?.length > 4 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {renderProperties(properties)}
          </div>

          {propData?.meta.last_page > 1 && (
            <>
              <Pagination.Root value={activePage} onChange={setPage} total={propData?.meta.last_page ?? 1}>
                <Group spacing={5} position="center" className="mt-4">
                  <Pagination.First />
                  <Pagination.Previous />
                  <Pagination.Items />
                  <Pagination.Next />
                  <Pagination.Last />
                </Group>
              </Pagination.Root>
            </>
          )}
        </>
      ) : (
        <div className="flex h-5/6 flex-col items-center justify-center">
          <h1 className="text-xl text-gray-500">Trash is empty.</h1>
        </div>
      )}
    </>
  );
};

export default TrashedProperties;
