import { Group, Pagination, UnstyledButton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PropertyCard } from "~/components/PropertyCard";
import { generateLoadingElements } from "~/lib/propertyHelper";
import { makeRequest } from "~/lib/requestHelper";
import type { CollectionProperty, DisplayPropertiesProps } from "~/types";

export function DisplayProperties({ propData, isLoading, isError, activePage, setPage }: DisplayPropertiesProps) {
  const properties = propData?.data;
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Error",
        message: "There was an error loading your properties.",
        color: "red",
        icon: <IconX size="1.5rem" />,
      });
    }
  }, [isError]);

  const trashProperty = (propId: string) => {
    if (!propId) return;
    makeRequest(`me/properties/${propId}`, "DELETE", session?.user.access_token)
      .then(() => {
        const sendSuccess = () => {
          successNotification("This property has been sent to trash!", "Property deleted");
        };
        router.push("/properties").then(sendSuccess).catch(sendSuccess); //TODO: Should we redirect to trash?
      })
      .catch(() => {
        errorNotification("An unknown error occurred while trying to delete this property.");
      });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {isLoading ? generateLoadingElements(12, <PropertyCard property={{} as CollectionProperty} isLoading />) : null}
        {properties?.map((property: CollectionProperty) => (
          <UnstyledButton
            className="z-10"
            onClick={() => {
              void router.push(`/properties/${property.id}`);
            }}
            key={property.id}
          >
            <PropertyCard
              property={property}
              xButton={IconTrash}
              xButtonTooltip="Trash property"
              executeXButton={() => trashProperty(property.id)}
            />
          </UnstyledButton>
        ))}
      </div>

      {propData?.meta.last_page && propData?.meta.last_page > 1 && (
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
  );
}
