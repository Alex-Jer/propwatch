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
  const {
    data: property,
    isLoading,
    isError,
  } = useProperty({
    session: session!,
    status,
    propertyId: String(propertyId ?? ""),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading property.</div>;
  }

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

  return (
    <>
      <Head>
        <title>{property.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {renderHeader(property)}
    </>
  );
};

export default Property;
