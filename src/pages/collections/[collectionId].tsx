import { MultiSelect, Text } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardBackground from "~/components/CardBackground";
import { PropertyCard } from "~/components/PropertyCard";
import { useCollection, usePropertyTitles } from "~/hooks/useQueries";
import { generateLoadingElements } from "~/lib/propertyHelper";
import { type CollectionProperty } from "~/types";

const Collection: NextPage = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  const { data: session, status } = useSession();

  const [searchValue, onSearchChange] = useState("");
  const [queryValue, setQueryValue] = useDebouncedState("", 500);

  useEffect(() => {
    if (searchValue !== queryValue) {
      setQueryValue(searchValue);
    }
  }, [searchValue, queryValue, setQueryValue]);

  const { data, isLoading, isError } = useCollection({
    session,
    status,
    elementId: String(collectionId ?? ""),
  });

  const { data: propData } = usePropertyTitles({
    session,
    status,
    search: queryValue,
  });

  const [idsFetched, setIdsFetched] = useState<string[]>([]);

  const [props, setProps] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const newIds: string[] = [];
    if (propData) {
      const newProps = propData
        .filter((p) => !idsFetched.includes(p.id))
        .map((prop) => {
          newIds.push(prop.id);
          return {
            value: prop.id,
            label: `(${prop.id}) ${prop.title}`,
            disabled: prop.collection_ids.includes(parseInt(collectionId as string)),
          };
        });
      setIdsFetched([...idsFetched, ...newIds]);
      setProps([...props, ...newProps]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propData, collectionId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading collection.</div>;
  }

  const { data: collection } = data;

  return (
    <>
      <Head>
        <title>{collection?.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CardBackground className="pt-4">
        <h1>{collection?.name}</h1>
        <div className="flex items-center">
          <Text>{collection?.description}</Text>
        </div>

        <div className="-mx-4 my-2 border-b border-shark-700" />

        <div className="mb-4 flex flex-row items-center">
          <MultiSelect
            data={props}
            label="Add properties to this collection"
            placeholder="Select the properties you wish to add to this collection"
            clearButtonProps={{ "aria-label": "Clear selection" }}
            clearable
            searchable
            searchValue={searchValue}
            className="w-1/2"
            onSearchChange={onSearchChange}
            nothingFound="No properties found"
          />
        </div>

        <div className="-mx-4 mb-4 border-b border-shark-700" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? generateLoadingElements(12, <PropertyCard property={{} as CollectionProperty} isLoading />)
            : null}
          {!isLoading &&
            collection?.properties?.data.map((property: CollectionProperty) => (
              <Link href={`/properties/${property.id}`} key={property.id}>
                <PropertyCard property={property} key={property.id} />
              </Link>
            ))}
        </div>
        {!isLoading && collection?.properties?.data.length === 0 && (
          <Text>There are no properties in this collection.</Text>
        )}
      </CardBackground>
    </>
  );
};

export default Collection;
