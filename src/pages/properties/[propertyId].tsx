import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useQueries";
import { Property } from "~/types";
import { CardsCarousel } from "~/components/CardsCarousel";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { type FunctionComponent, type SVGProps, useEffect, useState } from "react";
import { Apartment, House, Office, Shop, Warehouse, Garage, Default } from "public/icons";
import { MainCarousel } from "~/components/MainCarousel";
import { useDisclosure } from "@mantine/hooks";
import { Button, Drawer, Group } from "@mantine/core";
import CardBackground from "~/components/CardBackground";
import { env } from "~/env.mjs";

type MarkerIconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

const markerIcons: { [key: string]: MarkerIconComponent } = {
  house: House,
  apartment: Apartment,
  office: Office,
  shop: Shop,
  warehouse: Warehouse,
  garage: Garage,
  default: Default,
};

const Property: NextPage = () => {
  const router = useRouter();
  const { propertyId } = router.query;

  const { data: session, status } = useSession();
  const { data: property, isLoading, isError } = useProperty({ session, status, elementId: String(propertyId ?? "") });

  const [coverUrl, setCoverUrl] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!isLoading && !isError && property) {
      setCoverUrl(property.cover_url);
    }
  }, [isLoading, isError, property]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading property.</div>;
  }

  const {
    media: { photos },
    address: { coordinates },
  } = property;

  const renderHeader = () => {
    return (
      <>
        <div className="mb-2 flex justify-between">
          <h1 className="text-3xl">{property.title}</h1>
          {property.current_price_sale ? (
            <div className="text-3xl">{property.current_price_sale}€</div>
          ) : (
            <div className="text-3xl">{property.current_price_rent}€</div>
          )}
        </div>
      </>
    );
  };

  const renderCover = () => {
    if (coverUrl == null) return <div>Loading...</div>;
    return (
      <>
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3"> */}
        {/* <span onClick={open}> */}
        <MainCarousel images={photos} />
        {/* </span> */}
        {/* </div> */}
      </>
    );
  };

  const renderDrawer = () => {
    return (
      <Drawer opened={opened} onClose={close} position="bottom" size="100%">
        <div className="flex h-screen items-center">
          <CardsCarousel data={photos} currentUrl={coverUrl} setCover={setCoverUrl} />
        </div>
      </Drawer>
    );
  };

  const renderDescription = (property: Property) => {
    return (
      <div className="mt-4">
        <h2 className="text-3xl">Description</h2>
        <div>{property.description}</div>
      </div>
    );
  };

  const markerType = property?.type.toLowerCase();
  const MarkerIcon = (markerIcons[markerType] as MarkerIconComponent) || markerIcons.default;

  const renderMap = () => {
    //TODO: If coordinates are null? Can they even be null?
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;

    return (
      <>
        <h2 className="my-2 text-3xl">Location</h2>
        <div className="h-3/6 w-auto">
          <Map
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude,
              latitude,
              zoom: 15,
            }}
            style={{ width: "100%", height: "400px", borderRadius: "12px" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <Marker longitude={longitude} latitude={latitude}>
              <MarkerIcon className="h-8" />
            </Marker>
          </Map>
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{property.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CardBackground className="pt-6">
        {renderHeader()}
        {renderCover()}
        {renderDrawer()}

        {/* TODO: Test Button */}
        <Group position="left" className="mt-4">
          <Button onClick={open}>Open Drawer</Button>
        </Group>

        <div className="-ml-6 -mr-6 border-b border-shark-700 pb-4" />

        {renderDescription(property)}

        <div className="-ml-6 -mr-6 border-b border-shark-700 pb-4" />

        {coordinates && renderMap()}
      </CardBackground>
    </>
  );
};

export default Property;
