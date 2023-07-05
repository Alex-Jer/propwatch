import { IconBuildingEstate } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DisplayProperties } from "~/components/DisplayProperties";
import { useProperties } from "~/hooks/useQueries";
import type { SearchPropertyProps } from "~/types";

const Properties: NextPage<SearchPropertyProps> = ({ search, setSearch }) => {
  const { data: session, status } = useSession();
  const [activePage, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const {
    data: propData,
    isLoading,
    isError,
  } = useProperties({
    session,
    status,
    search,
    page: activePage,
  });

  return (
    <>
      <Head>
        <title>My Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-2 flex flex-row items-center">
        <IconBuildingEstate className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">All Properties</h1>
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

export default Properties;
