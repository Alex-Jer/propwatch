import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useQueries";
import { Property } from "~/types";
import { CardsCarousel } from "~/components/CardsCarousel";

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

  const images = [
    {
      image:
        "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    },
  ];

  const renderHeader = (property: Property) => {
    return (
      <>
        <div className="flex justify-between">
          <h1>{property.title}</h1>
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
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <Image
              src="https://placehold.it/500x300"
              alt="Main Image"
              width={1000}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <CardsCarousel data={images} />
          </div>
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

      <div className="mt-4">
        <h2 className="text-xl">Description</h2>
        <div>{property.description}</div>
      </div>
    </>
  );
};

export default Property;
