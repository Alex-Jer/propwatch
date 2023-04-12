import { type NextPage } from "next";
import Head from "next/head";
import { useAppData } from "~/components/context/AppDataContext";
import { Collection } from "~/types";

const Lists: NextPage = () => {
  /* const { */
  /*   isLoading, */
  /*   error, */
  /*   data: res, */
  /*   isFetching, */
  /* } = useQuery({ */
  /*   queryKey: ["lists"], */
  /*   queryFn: () => axiosReq("me/lists", "GET", session?.user.access_token), */
  /*   enabled: status === "authenticated", */
  /* }); */

  const { collections, isLoadingCollections, isFetchingCollections, collectionsError } = useAppData();

  if (isLoadingCollections) {
    console.log("Loading...");
  }

  if (isFetchingCollections) {
    console.log("Fetching...");
  }

  if (collectionsError) {
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

export default Lists;
