import { IconBuildingEstate, IconMapSearch } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import { DisplayProperties } from "~/components/DisplayProperties";
import type { DisplayPropertiesProps } from "~/types";
import Map from "react-map-gl";
import { env } from "~/env.mjs";
import "mapbox-gl/dist/mapbox-gl.css";

const Properties: NextPage<DisplayPropertiesProps> = ({ search, setSearch }) => {
  const renderMap = () => {
    const latitude = 39.4;
    const longitude = -8.2;
    return (
      <>
        <div className="h-3/6 w-1/2">
          <Map
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              latitude,
              longitude,
              zoom: 7,
            }}
            style={{ width: "100%", height: "400px", borderRadius: "12px" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          ></Map>
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Map Search - My Properties</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-2 flex flex-row items-center">
        <IconMapSearch className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">Map Search</h1>
      </div>

      <div className="-mx-4 mb-4 border-b border-shark-700" />

      {renderMap()}

      <div className="mb-2 flex flex-row items-center">
        <IconBuildingEstate className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">Properties</h1>
      </div>

      <div className="-mx-4 mb-4 border-b border-shark-700" />

      <DisplayProperties search={search} setSearch={setSearch} />
    </>
  );
};

export default Properties;
