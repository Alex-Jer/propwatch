import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropertyCard } from "~/components/PropertyCard";
import { useCollection } from "~/hooks/useQueries";
import { type CollectionProperty } from "~/types";

const Collection: NextPage = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  const { data: session, status } = useSession();
  const { data, isLoading, isError } = useCollection({
    session,
    status,
    elementId: String(collectionId ?? ""),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading collection.</div>;
  }

  const { data: collection } = data;

  console.log("properties", data);

  const renderProperties = (properties: CollectionProperty[]) => {
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
        <title>{collection?.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>{collection?.name}</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {renderProperties(collection.properties.data)}
      </div>
    </>
  );
};

export default Collection;
