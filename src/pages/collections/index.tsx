import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { CollectionCard } from "~/components/CollectionCard";
import { useCollections } from "~/hooks/useQueries";
import { type Collection } from "~/types";

const Collections: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: collections, isLoading, isFetching, error } = useCollections({ session, status });

  if (isLoading) {
    console.log("Loading...");
  }

  if (isFetching) {
    console.log("Fetching...");
  }

  if (error) {
    console.log("Error!");
  }

  function renderCollections(collections: Collection[] | undefined) {
    return (
      <span className="grid grid-cols-1 gap-4">
        {collections?.map((collection: Collection) => (
          <Link href={`/collections/${collection.id}`} key={collection.id}>
            <CollectionCard
              key={collection.id}
              date={collection.num_properties.toString() + " properties"}
              image={""}
              title={collection.name}
              category={collection.description}
            />
          </Link>
        ))}
      </span>
    );
  }

  return (
    <>
      <Head>
        <title>My Collections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {renderCollections(collections)}
    </>
  );
};

export default Collections;
