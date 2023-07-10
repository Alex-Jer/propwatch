import { Group, Pagination } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";
import { PropertyCard } from "~/components/PropertyCard";
import { generateLoadingElements } from "~/lib/propertyHelper";
import type { CollectionProperty, DisplayPropertiesProps } from "~/types";

export function DisplayProperties({ propData, isLoading, isError, activePage, setPage }: DisplayPropertiesProps) {
  const properties = propData?.data;

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

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {isLoading ? generateLoadingElements(12, <PropertyCard property={{} as CollectionProperty} isLoading />) : null}
        {properties?.map((property: CollectionProperty) => (
          <Link href={`/properties/${property.id}`} key={property.id}>
            <PropertyCard property={property} />
          </Link>
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
