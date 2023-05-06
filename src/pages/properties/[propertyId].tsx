import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useQueries";
import { Property } from "~/types";

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

  const images: string[] = [
    "https://placehold.it/300x300?text=Image+1",
    "https://placehold.it/300x300?text=Image+2",
    "https://placehold.it/300x300?text=Image+3",
    "https://placehold.it/300x300?text=Image+4",
    "https://placehold.it/300x300?text=Image+5",
  ];

  const renderHeader = (property: Property) => {
    return (
      <>
        {/* <div>{property.title}</div> */}
        {/* render the title on the left, and the price on the right */}
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
          <div className="col-span-1  md:col-span-2">
            <img src="https://placehold.it/500x300" alt="Main Image" width={840} height={560} className="rounded-lg" />
          </div>
          <div className="col-span-1 md:col-span-1">
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative h-24">
                  <img src={image} alt="" className="rounded-lg" />
                </div>
              ))}
            </div>
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
