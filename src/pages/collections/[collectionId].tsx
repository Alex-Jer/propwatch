import { ActionIcon, Collapse, MultiSelect, Text } from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardBackground from "~/components/CardBackground";
import { PropertyCard } from "~/components/PropertyCard";
import { useCollection, usePropertyTitles } from "~/hooks/useQueries";
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

  const {
    data: propData,
    isLoading: propIsLoading,
    isError: propIsError,
  } = usePropertyTitles({
    session,
    status,
    search: queryValue,
  });

  const [props, setProps] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (propData) {
      setProps(
        propData.map((prop) => ({
          value: prop.id,
          label: `(${prop.id}) ${prop.title}`,
          disabled: prop.collection_ids.includes(parseInt(collectionId as string)),
        }))
      );
    }
  }, [propData, collectionId]);

  const [descOpened, { toggle: toggleDesc }] = useDisclosure(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading collection.</div>;
  }

  const { data: collection } = data;
  const TRIMMING_LENGTH = (window.innerWidth ?? 33) / 18;
  const descriptionNeedsTrimming = collection?.description?.length > TRIMMING_LENGTH;

  return (
    <>
      <Head>
        <title>{collection?.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CardBackground className="pt-4">
        <h1>{collection?.name}</h1>
        {!propIsLoading && !propIsError && (
          <MultiSelect
            data={props}
            label="Add properties to this collection"
            placeholder="Select the properties you wish to add to this collection"
            clearButtonProps={{ "aria-label": "Clear selection" }}
            clearable
            searchable
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            nothingFound="No properties found"
          />
        )}
        <div className="flex max-w-2xl items-center pb-3">
          {descriptionNeedsTrimming ? (
            <>
              {!descOpened && <Text>{collection?.description?.substring(0, TRIMMING_LENGTH - 3) + "..."}</Text>}
              <Collapse in={descOpened}>
                <Text className="flex items-center">
                  {collection?.description}
                  <ActionIcon onClick={toggleDesc}>
                    <IconCaretUp size="1.125rem" />
                  </ActionIcon>
                </Text>
              </Collapse>
              {!descOpened && (
                <ActionIcon onClick={toggleDesc}>
                  <IconCaretDown size="1.125rem" />
                </ActionIcon>
              )}
            </>
          ) : (
            <Text>{collection?.description}</Text>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {collection?.properties?.data.map((property: CollectionProperty) => (
            <Link href={`/properties/${property.id}`} key={property.id}>
              <PropertyCard property={property} key={property.id} />
            </Link>
          ))}
        </div>
        {collection?.properties?.data.length === 0 && <Text>There are no properties in this collection.</Text>}
      </CardBackground>
    </>
  );
};

export default Collection;
