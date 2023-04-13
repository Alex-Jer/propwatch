import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Collection } from "~/types";
import { useCollections } from "~/useQueries";

const Collections: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: collections, isLoading, isFetching, error } = useCollections({ session: session!, status }!);

  if (isLoading) {
    console.log("Loading...");
  }

  if (isFetching) {
    console.log("Fetching...");
  }

  if (error) {
    console.log("Error!");
  }

  return (
    <>
      <Head>
        <title>My Collections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>My Collections</h1>
        {collections?.map((collection: Collection) => (
          <div key={collection.id}>
            <h3 className="text-2xl">{collection.name}</h3>
            <p>{collection.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Collections;
