import { IconBuildingEstate, IconTrash } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { DisplayProperties } from "~/components/DisplayProperties";
import { useTrashedProperties } from "~/hooks/useQueries";

const TrashedProperties: NextPage = () => {
  const { data: session, status } = useSession();
  const [activePage, setPage] = useState(1);

  const {
    data: propData,
    isLoading,
    isError,
  } = useTrashedProperties({
    session,
    status,
    page: activePage,
  });

  return (
    <>
      <Head>
        <title>Trash - Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-2 flex flex-row items-center">
        <IconTrash className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">Trashed Properties</h1>
      </div>

      <div className="-mx-4 mb-4 border-b border-shark-700" />

      <DisplayProperties
        propData={propData}
        isLoading={isLoading}
        isError={isError}
        activePage={activePage}
        setPage={setPage}
      />
    </>
  );
};

export default TrashedProperties;
