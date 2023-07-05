import { IconMapSearch } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import { DisplayProperties } from "~/components/DisplayProperties";
import type { DisplayPropertiesProps } from "~/types";
import Map from "react-map-gl";
import { env } from "~/env.mjs";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Grid } from "@mantine/core";
import { useCallback, useState } from "react";
import DrawControl from "~/components/map/DrawControl";
import type { DrawPolygon, DrawCreateEvent, DrawUpdateEvent, DrawDeleteEvent } from "@mapbox/mapbox-gl-draw";

const Properties: NextPage<DisplayPropertiesProps> = ({ search, setSearch }) => {
  const [features, setFeatures] = useState<{ [key: string]: DrawPolygon }>({});

  console.log(features);

  const onUpdate = useCallback((e: DrawCreateEvent | DrawUpdateEvent) => {
    setFeatures((currFeatures) => {
      const newFeatures: { [key: string]: DrawPolygon } = { ...currFeatures };
      for (const f of e.features) {
        if (f.id) newFeatures[f.id] = f.geometry as DrawPolygon;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e: DrawDeleteEvent) => {
    setFeatures((currFeatures) => {
      const newFeatures: { [key: string]: DrawPolygon } = { ...currFeatures };
      for (const f of e.features) {
        if (f.id) delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const renderMap = () => {
    const latitude = 39.4;
    const longitude = -8.2;
    return (
      <>
        <div className="h-3/6 w-full">
          <Map
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              latitude,
              longitude,
              zoom: 7,
            }}
            style={{ width: "100%", height: "400px", borderRadius: "12px" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <DrawControl
              position="top-left"
              displayControlsDefault={false}
              controls={{
                polygon: true,
                trash: true,
              }}
              defaultMode="draw_polygon"
              onCreate={onUpdate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </Map>
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
      <Grid>
        <Grid.Col span={12}>{renderMap()}</Grid.Col>
      </Grid>

      {/* <div className="mb-2 mt-6 flex flex-row items-center">
        <IconBuildingEstate className="-mt-1 mr-2" strokeWidth={1.5} />
        <h1 className="pb-1 text-base font-semibold">Properties</h1>
      </div> */}

      <div className="-mx-4 mb-4 mt-4 border-b border-shark-700" />

      <DisplayProperties search={search} setSearch={setSearch} />
    </>
  );
};

export default Properties;
