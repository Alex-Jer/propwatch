import { IconMapSearch } from "@tabler/icons-react";
import { type NextPage } from "next";
import Head from "next/head";
import { DisplayProperties } from "~/components/DisplayProperties";
import type { DisplayPropertiesProps } from "~/types";
import Map, { Layer, Source } from "react-map-gl";
import { env } from "~/env.mjs";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Grid } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import DrawControl from "~/components/map/DrawControl";
import type { DrawPolygon, DrawCreateEvent, DrawUpdateEvent } from "@mapbox/mapbox-gl-draw";
import type MapboxDraw from "@mapbox/mapbox-gl-draw";

const Properties: NextPage<DisplayPropertiesProps> = ({ search, setSearch }) => {
  const [drwCtrl, setDrwCtrl] = useState<MapboxDraw | null>(null);
  const [polygon, setPolygon] = useState<DrawPolygon | null>(null);
  const drwCtrlRef = useRef<MapboxDraw | null>(null);

  const onUpdate = useCallback(
    (e: DrawCreateEvent | DrawUpdateEvent) => {
      if (e.features.length > 0) {
        const newPolygon = e.features[0]?.geometry as DrawPolygon;
        setPolygon(newPolygon);
        drwCtrlRef.current?.deleteAll();
        drwCtrlRef.current?.add(newPolygon);
      }
    },
    [drwCtrlRef, setPolygon]
  );

  useEffect(() => {
    drwCtrlRef.current = drwCtrl;
  }, [drwCtrl]);

  const onDelete = useCallback(() => {
    setPolygon(null);
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
              setControlRef={setDrwCtrl}
            />
            {polygon && (
              <Source id="polygon" type="geojson" data={polygon}>
                <Layer
                  id="polygon"
                  type="fill"
                  paint={{
                    "fill-color": "#f00",
                    "fill-opacity": 0.5,
                  }}
                />
              </Source>
            )}
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
