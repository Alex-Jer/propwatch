import { IconBuildingEstate } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import { DisplayProperties } from "~/components/DisplayProperties";
import type { DisplayPropertiesProps } from "~/types";

const Properties: NextPage<DisplayPropertiesProps> = ({ search, setSearch }) => {
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

      <DisplayProperties search={search} setSearch={setSearch} />
    </>
  );
};

export default Properties;
