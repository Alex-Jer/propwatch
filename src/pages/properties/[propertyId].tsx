import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { SVGProps, ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useQueries";
import { Property } from "~/types";
import { CardsCarousel } from "~/components/CardsCarousel";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import { Apartment, House, Office, Shop, Warehouse, Garage, Default } from "public/icons";

const Property: NextPage = () => {
  const router = useRouter();
  const { propertyId } = router.query;

  const { data: session, status } = useSession();
  const { data: property, isLoading, isError } = useProperty({ session, status, propertyId: String(propertyId ?? "") });

  const [coverUrl, setCoverUrl] = useState("");

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

  const renderHeader = (property: Property) => {
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

  const renderGallery = () => {
    if (coverUrl == null) return <div>Loading...</div>;
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <Image
              src={coverUrl}
              alt="Main Image"
              width={1000}
              height={600}
              /*style={{ maxHeight: 400, objectFit: "contain", backgroundColor: "darkgray" }}*/
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <CardsCarousel data={photos} currentUrl={coverUrl} setCover={setCoverUrl} />
          </div>
        </div>
      </>
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

  const renderMap = () => {
    //TODO: If coordinates are null? Can they even be null?
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;
    return (
      <>
        <h2 className="mt-4 text-3xl">Location</h2>
        <div className="h-3/6 w-auto">
          {/* TODO: token */}
          <Map
            mapboxAccessToken="pk.eyJ1IjoiYWxleGplciIsImEiOiJjbGhkbHlqZ2UwbnJ1M2ZudmtuMnZuZnJwIn0.H-iqt45XSgHUA3wU35eQ7Q"
            initialViewState={{
              longitude,
              latitude,
              zoom: 15,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <Marker longitude={longitude} latitude={latitude}>
              {markerIcons[property.type] || markerIcons.default}
            </Marker>
          </Map>
        </div>
      </>
    );
  };

  const markerIcons = {
    house: House,
    apartment: Apartment,
    office: Office,
    shop: Shop,
    warehouse: Warehouse,
    garage: Garage,
    default: Default,
  };

  return (
    <>
      <Head>
        <title>{property.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {renderHeader(property)}
      {renderGallery()}
      {renderDescription(property)}
      {renderMap()}
    </>
  );
};

export default Property;
