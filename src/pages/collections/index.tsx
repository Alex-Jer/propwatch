import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { CollectionCard } from "~/components/CollectionCard";
import { useCollections } from "~/hooks/useQueries";
import { type Collection } from "~/types";
import { IconListNumbers, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

const Collections: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: colData, isLoading, isError } = useCollections({ session, status });
  const collections = colData?.data;

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Error",
        message: "There was an error loading your collections.",
        color: "red",
        icon: <IconX size="1.5rem" />,
      });
    }
  }, [isError]);

  const generateLoadingCards = (count: number) => {
    const loadingCards = [];
    for (let i = 0; i < count; i++) {
      loadingCards.push(<CollectionCard key={i} covers={[]} title={""} description={""} date={""} isLoading />);
    }

    return loadingCards;
  };

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

      {isLoading ? <span className="grid grid-cols-1 gap-4">{generateLoadingCards(10)}</span> : null}

      <span className="grid grid-cols-1 gap-4">
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
    </>
  );
};

export default Collections;
