import { createStyles, Group, Pagination, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PropertyCard, errorNotification, successNotification } from "~/components/PropertyCard";
import { generateLoadingElements } from "~/lib/propertyHelper";
import { makeRequest } from "~/lib/requestHelper";
import type { CollectionProperty, DisplayPropertiesProps } from "~/types";
import { ConfirmationModal } from "./ConfirmationModal";

export function DisplayProperties({
  propData,
  isLoading,
  isError,
  activePage,
  setPage,
  refetch,
  hasFilters = false,
}: DisplayPropertiesProps) {
  const { classes } = useStyles();
  const properties = propData?.data;
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (isError) {
      errorNotification("There was an error loading your properties.");
    }
  }, [isError]);

  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [trashModalOpened, { open: openTrashModal, close: closeTrashMoodal }] = useDisclosure(false);

  const trashProperty = () => {
    if (!selectedPropId) return;
    makeRequest(`me/properties/${selectedPropId}`, "DELETE", session?.user.access_token)
      .then(() => {
        successNotification("This property has been sent to trash!", "Property deleted");
        void refetch();
      })
      .catch(() => {
        errorNotification("An unknown error occurred while trying to delete this property.");
      });
  };

  return (
    <>
      <ConfirmationModal
        opened={trashModalOpened}
        close={closeTrashMoodal}
        yesFunction={trashProperty}
        title="Trash property"
        text="Are you sure you want to send this property to the trash?"
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />

      {isLoading || (!isLoading && properties?.length !== 0) ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? generateLoadingElements(12, <PropertyCard property={{} as CollectionProperty} isLoading />)
            : properties?.map((property: CollectionProperty) => (
                <div
                  className="z-10 cursor-pointer"
                  onClick={() => {
                    void router.push(`/properties/${property.id}`);
                  }}
                  key={property.id}
                >
                  <PropertyCard
                    property={property}
                    xButton={IconTrash}
                    xButtonTooltip="Trash property"
                    executeXButton={() => {
                      setSelectedPropId(property.id);
                      openTrashModal();
                    }}
                  />
                </div>
              ))}
        </div>
      ) : (
        <div className={classes.placeholder}>
          <span>
            {router.pathname.includes("polygon") || hasFilters ? "No properties found." : "No properties added yet."}
          </span>
        </div>
      )}

      {!isLoading ? (
        propData?.meta.last_page &&
        propData?.meta.last_page > 1 && (
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
        )
      ) : (
        <>
          <Group spacing={5} position="center" className="mt-4">
            <Skeleton width="40%" height={30} />
          </Group>
        </>
      )}
    </>
  );
}

const useStyles = createStyles((theme) => ({
  placeholder: {
    "& span": {
      color: theme.colors.dark[3],
      fontWeight: 600,
    },
  },
}));
