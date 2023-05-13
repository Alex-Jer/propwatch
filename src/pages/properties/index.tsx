import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { PropertyCard } from "~/components/PropertyCard";
import { useProperties } from "~/hooks/useQueries";
import { type CollectionProperty } from "~/types";

const Properties: NextPage = () => {
  const { data: session, status } = useSession();
  const {
    data: propData,
    isLoading,
    isError,
  } = useProperties({
    session,
    status,
  });

  const properties = propData?.data;

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
          const url = `/properties/${property.id}`;
          return (
            <Link href={url} key={property.id}>
              <PropertyCard
                image={property.cover_url}
                title={property.title}
                author={property.type}
                key={property.id}
              />
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>My Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {renderProperties(properties)}
      </div>
    </>
  );
};

export default Properties;
