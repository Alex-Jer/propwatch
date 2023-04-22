import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCollection } from "~/hooks/useQueries";

const Collection: NextPage = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  const { data: session, status } = useSession();
  const { data: collection } = useCollection({ session: session!, status, collectionId: String(collectionId ?? "") });

  return (
    <>
      <h1>Collection {collectionId}</h1>
      <p>{collection?.name}</p>
    </>
  );
};

export default Collection;
