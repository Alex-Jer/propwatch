import { IconBuildingEstate } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import { useContext, useEffect } from "react";
import { DisplayProperties } from "~/components/DisplayProperties";
import { errorNotification } from "~/components/PropertyCard";
import { PropertiesContext } from "~/lib/PropertiesProvider";
import type { SearchPropertyProps } from "~/types";

const Properties: NextPage<SearchPropertyProps> = () => {
  const { properties, isLoading, isError, activePage, setPage } = useContext(PropertiesContext);

  useEffect(() => {
    if (isError) {
      errorNotification("There was an error loading your properties.");
    }
  }, [isError]);

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
        propData={properties}
        isLoading={isLoading}
        isError={isError}
        activePage={activePage}
        setPage={setPage}
      />
    </>
  );
};

export default Properties;
