import { Group, Pagination } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { PropertyCard } from "~/components/PropertyCard";
import { useTrashedProperties } from "~/hooks/useQueries";
import { type CollectionProperty } from "~/types";

const TrashedProperties: NextPage = () => {
  const { data: session, status } = useSession();
  const [activePage, setPage] = useState(1);

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

      <div className="mb-2 flex flex-row items-center">
        <IconTrash className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">Trashed Properties</h1>
      </div>

      <div className="-mx-4 mb-4 border-b border-shark-700" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {renderProperties(properties)}
      </div>

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
  );
};

export default TrashedProperties;
