import { NextPage } from "next";
import { useRouter } from "next/router";

const Collection: NextPage = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  return <h1>Collection {collectionId}</h1>;
};

export default Collection;
