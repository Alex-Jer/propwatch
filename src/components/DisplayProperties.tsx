import { Group, Pagination } from "@mantine/core";
import Link from "next/link";
import { PropertyCard } from "~/components/PropertyCard";
import type { CollectionProperty, DisplayPropertiesProps } from "~/types";

export function DisplayProperties({ propData, isLoading, isError, activePage, setPage }: DisplayPropertiesProps) {
  const properties = propData?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading properties.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {properties?.map((property: CollectionProperty) => (
          <Link href={`/properties/${property.id}`} key={property.id}>
            <PropertyCard property={property} key={property.id} />
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
