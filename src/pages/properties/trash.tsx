import { Button, createStyles, Group, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBackUpDouble, IconTrash, IconTrashX } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { PropertyCard, errorNotification, successNotification } from "~/components/PropertyCard";
import { useTrashedProperties } from "~/hooks/useQueries";
import { PropertiesContext } from "~/lib/PropertiesProvider";
import { generateLoadingElements } from "~/lib/propertyHelper";
import { makeRequest } from "~/lib/requestHelper";
import { type CollectionProperty } from "~/types";

const TrashedProperties: NextPage = () => {
  const { classes } = useStyles();
  const { data: session, status } = useSession();
  const [activePage, setPage] = useState(1);

  const [restoreOpened, { open: openRestore, close: closeRestore }] = useDisclosure(false);
  const [emptyTrashOpened, { open: openEmptyTrash, close: closeEmptyTrash }] = useDisclosure(false);

  const { refetch: refetchProperties } = useContext(PropertiesContext);

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

  useEffect(() => {
    if (isError) {
      errorNotification("There was an error loading your properties.");
    }
  }, [isError]);

  const restoreAll = () => {
    makeRequest(`me/properties/trashed/restore`, "PATCH", session?.user.access_token)
      .then(() => {
        successNotification("All trashed properties have been restored!", "All properties restored");
      })
      .catch(() => errorNotification("An unknown error occurred while restoring all the properties."))
      .finally(() => {
        void refetch();
        void refetchProperties();
      });
  };

  const emptyTrash = () => {
    makeRequest(`me/properties/trashed`, "DELETE", session?.user.access_token)
      .then(() => {
        successNotification("All trashed properties have been permanently deleted!", "Trash emptied");
      })
      .catch(() => errorNotification("An unknown error occurred while emptying the trash."))
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
              property={property}
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
      <div className="mb-2 flex flex-row items-center justify-between space-x-2">
        <div className="flex items-center">
          <IconTrash className="-mt-1 mr-2" strokeWidth={1.5} />
          <h1 className="pb-1 text-base font-semibold">Trashed Properties</h1>
          <h3 className="ml-2 text-xs font-semibold text-gray-400">Hover over a property to delete or restore it.</h3>
        </div>

        <div className="-mt-1 space-x-2">
          <Button
            variant="default"
            size="xs"
            onClick={openRestore}
            leftIcon={<IconArrowBackUpDouble size="1rem" />}
            disabled={isLoading || !properties?.length}
          >
            Restore all
          </Button>
          <Button
            variant="default"
            size="xs"
            onClick={openEmptyTrash}
            leftIcon={<IconTrashX size="1rem" />}
            disabled={isLoading || !properties?.length}
          >
            Empty trash
          </Button>
        </div>
      </div>
      <div className="-mx-4 mb-4 border-b border-shark-700" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? generateLoadingElements(12, <PropertyCard property={{} as CollectionProperty} isLoading />)
          : renderProperties(properties)}
      </div>

      {properties?.length && properties?.length > 0 ? (
        <>
          {!isLoading && propData?.meta.last_page && propData?.meta.last_page > 1 && (
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
        <div className={classes.placeholder}>
          <span>Trash is empty.</span>
        </div>
      )}
    </>
  );
};

export default TrashedProperties;

const useStyles = createStyles((theme) => ({
  placeholder: {
    "& span": {
      color: theme.colors.dark[3],
      fontWeight: 600,
    },
  },
}));
