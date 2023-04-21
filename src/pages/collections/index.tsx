import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { CollectionCard } from "~/components/CollectionCard";
import { useCollections } from "~/hooks/useQueries";
import { Collection } from "~/types";

const Collections: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: collections, isLoading, isFetching, error } = useCollections({ session: session!, status });

  if (isLoading) {
    console.log("Loading...");
  }

  if (isFetching) {
    console.log("Fetching...");
  }

  if (error) {
    console.log("Error!");
  }

  function renderCollections(collections: Collection[]) {
    return (
      <span className="grid grid-cols-1 gap-4">
        {collections.map((collection: Collection) => (
          <div className="cursor-pointer">
            <CollectionCard
              key={collection.id}
              date={collection.id}
              image={""}
              title={collection.name}
              category={collection.description}
            />
          </div>
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
