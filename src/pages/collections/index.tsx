import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { CollectionCard } from "~/components/CollectionCard";
import { useCollections } from "~/hooks/useQueries";
import { type Collection } from "~/types";
import { IconListNumbers } from "@tabler/icons-react";

const Collections: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: colData, isLoading, isFetching, error } = useCollections({ session, status });
  const collections = colData?.data;
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
              covers={collection.covers}
              title={collection.name}
              description={collection.description}
              tags={collection.tags}
              date={collection.num_properties.toString() + " properties"}
            />
            <div className="border-b border-shark-700 pb-4" />
          </Link>
        ))}
      </span>
    );
  }

  return (
    <>
      <Head>
        <title>All Collections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-2 flex flex-row items-center">
        <IconListNumbers className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">All Collections</h1>
      </div>

      <div className="-mx-4 mb-4 border-b border-shark-700" />

      {renderCollections(collections)}
    </>
  );
};

export default Collections;
