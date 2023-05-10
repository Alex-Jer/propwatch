import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useQueries";
import { Property } from "~/types";
import { CardsCarousel } from "~/components/CardsCarousel";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "~/env.mjs";

const Property: NextPage = () => {
  const router = useRouter();
  const { propertyId } = router.query;

  const { data: session, status } = useSession();
  const { data: property, isLoading, isError } = useProperty({ session, status, propertyId: String(propertyId ?? "") });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading property.</div>;
  }

  const {
    media: { photos },
  } = property;

  const renderHeader = (property: Property) => {
    return (
      <>
        <div className="mb-2 flex justify-between">
          <h1 className="text-4xl">{property.title}</h1>
          {property.current_price_sale ? (
            <div className="text-4xl">{property.current_price_sale}€</div>
          ) : (
            <div className="text-4xl">{property.current_price_rent}€</div>
          )}
        </div>
      </>
    );
  };

  const renderGallery = () => {
    const coverUrl = `${property.cover_url}`;

    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <Image src={coverUrl} alt="Main Image" width={1000} height={600} className="rounded-lg" />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <CardsCarousel data={photos} />
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
    return (
      <>
        <h2 className="mt-4 text-3xl">Location</h2>
        <div className="h-3/6 w-auto">
          {/* TODO: token */}
          <Map
            mapboxAccessToken="pk.eyJ1IjoiYWxleGplciIsImEiOiJjbGhkbHlqZ2UwbnJ1M2ZudmtuMnZuZnJwIn0.H-iqt45XSgHUA3wU35eQ7Q"
            initialViewState={{
              longitude: -8.83075580229916,
              latitude: 39.7329434886251,
              zoom: 15,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <Marker longitude={-8.83075580229916} latitude={39.7329434886251}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="red"
                className="h-6 w-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
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

      {renderHeader(property)}
      {renderGallery()}
      {renderDescription(property)}
      {renderMap()}
    </>
  );
};

export default Property;
