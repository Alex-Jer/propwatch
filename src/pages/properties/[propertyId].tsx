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
import { useEffect, useState } from "react";

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
    house: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" class="h-8 w-8">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
      </svg>
    ),
    apartment: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" class="h-8 w-8">
        <path
          fill-rule="evenodd"
          d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    office: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" class="h-8 w-8">
        <path
          fill-rule="evenodd"
          d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 19.5v-2.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 010 1.5h-.75A.75.75 0 016 6.75zM6.75 9a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 6a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm-.75 3.75A.75.75 0 0110.5 9h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 12a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM16.5 6.75v15h5.25a.75.75 0 000-1.5H21v-12a.75.75 0 000-1.5h-4.5zm1.5 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm.75 2.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM18 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    shop: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" class="h-8 w-8">
        <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
        <path
          fill-rule="evenodd"
          d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    warehouse: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="#FF0000" class="h-8 w-8">
        <path d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24H568c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32V488c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24V432H512l0 56c0 13.3-10.7 24-24 24zM128 400V336H512v64H128zm0-96V224H512l0 80H128z" />
      </svg>
    ),
    garage: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="#FF0000" class="h-8 w-8">
        <path d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24H568c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32V488c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24V432H512l0 56c0 13.3-10.7 24-24 24zM128 400V336H512v64H128zm0-96V224H512l0 80H128z" />
      </svg>
    ),
    default: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#FF0000" class="h-8 w-8">
        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
      </svg>
    ),
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
