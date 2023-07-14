import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { CollectionCard } from "~/components/CollectionCard";
import { useCollections } from "~/hooks/useQueries";
import { type Collection } from "~/types";
import { IconListNumbers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { generateLoadingElements } from "~/lib/propertyHelper";
import { createStyles, Group, Pagination } from "@mantine/core";
import { errorNotification } from "~/components/PropertyCard";

const Collections: NextPage = () => {
  const { classes } = useStyles();
  const { data: session, status } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activePage, setPage] = useState(1);
  const { data: colData, isLoading, isError } = useCollections({ session, status, page: activePage });

  useEffect(() => {
    setCollections(colData?.data ?? []);
  }, [colData?.data]);

  useEffect(() => {
    if (isError) {
      errorNotification("There was an error loading your collections.");
    }
  }, [isError]);

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

      {isLoading || (collections && collections.length > 0) ? (
        <>
          <span className="grid grid-cols-1 gap-4">
            {isLoading
              ? generateLoadingElements(
                  10,
                  <CollectionCard covers={[]} title={""} description={""} date={""} isLoading />
                )
              : null}

            {collections?.map((collection: Collection) => (
              <Link href={`/collections/${collection.id}`} key={collection.id}>
                <CollectionCard
                  key={collection.id}
                  covers={collection.covers}
                  title={collection.name}
                  description={collection.description}
                  date={collection.num_properties.toString() + " properties"}
                />
                <div className="border-b border-shark-700 pb-4" />
              </Link>
            ))}
          </span>
          {colData?.meta.last_page && colData?.meta.last_page > 1 && (
            <>
              <Pagination.Root value={activePage} onChange={setPage} total={colData?.meta.last_page ?? 1}>
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
      ) : (
        <div className={classes.placeholder}>
          <span>No collections added yet.</span>
        </div>
      )}
    </>
  );
};

export default Collections;

const useStyles = createStyles((theme) => ({
  placeholder: {
    height: "100%",
    width: "100%",

    "& span": {
      color: theme.colors.dark[3],
      fontWeight: 600,
    },
  },
}));
