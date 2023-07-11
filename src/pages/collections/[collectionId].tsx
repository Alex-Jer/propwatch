import { ActionIcon, Group, MultiSelect, Pagination, Text } from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconCirclePlus, IconPlus } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardBackground from "~/components/CardBackground";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { PropertyCard, errorNotification, successNotification } from "~/components/PropertyCard";
import { useCollection, usePropertyTitles } from "~/hooks/useQueries";
import { generateLoadingElements } from "~/lib/propertyHelper";
import { makeRequest } from "~/lib/requestHelper";
import { type CollectionProperty } from "~/types";

const Collection: NextPage = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  const { data: session, status } = useSession();

  const [searchValue, onSearchChange] = useState("");
  const [queryValue, setQueryValue] = useDebouncedState("", 500);
  const [propsToAdd, setPropsToAdd] = useState<string[]>([]);
  const [addPropsModalOpened, { open: apmOpen, close: apmClose }] = useDisclosure(false);

  useEffect(() => {
    if (searchValue !== queryValue) {
      setQueryValue(searchValue);
    }
  }, [searchValue, queryValue, setQueryValue]);

  const [activePage, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useCollection({
    session,
    status,
    elementId: String(collectionId ?? ""),
    page: activePage,
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

  const addPropertiesToList = () => {
    if (collection?.id) {
      const formData = new FormData();
      propsToAdd.forEach((p, idx) => formData.append(`properties[${idx}]`, p));
      makeRequest(`me/lists/${collection.id.toString()}/properties`, "POST", session?.user.access_token, formData)
        .then(() => {
          setPropsToAdd([]);
          setPage(1);
          successNotification("Properties added to collection.", "Properties added");
        })
        .catch(() => errorNotification("An unknown error occurred while adding properties to the collection."))
        .finally(() => {
          void refetch();
        });
    }
  };

  return (
    <>
      <Head>
        <title>{collection?.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConfirmationModal
        opened={addPropsModalOpened}
        close={apmClose}
        yesFunction={addPropertiesToList}
        title="Add properties to collection"
        text={`Are you sure you wish to add ${propsToAdd.length} properties to this collection?`}
        yesBtn={{ text: "Add", color: "teal", variant: "filled", icon: <IconPlus size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />

      <CardBackground className="pt-4">
        <h1>{collection?.name}</h1>
        <div className="flex items-center">
          <Text>{collection?.description}</Text>
        </div>

        <div className="-mx-4 my-2 border-b border-shark-700" />

        <div className="mb-4 flex flex-row items-center align-middle">
          <MultiSelect
            data={props}
            label="Add properties to this collection"
            placeholder="Select the properties you wish to add to this collection"
            clearButtonProps={{ "aria-label": "Clear selection" }}
            clearable
            searchable
            value={propsToAdd}
            onChange={setPropsToAdd}
            searchValue={searchValue}
            className="w-1/2"
            onSearchChange={onSearchChange}
            nothingFound="No properties found"
          />
          <ActionIcon onClick={apmOpen} variant="filled">
            <IconCirclePlus size="1rem" />
          </ActionIcon>
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
        {collection?.properties?.meta.last_page && collection?.properties?.meta.last_page > 1 && (
          <>
            <Pagination.Root value={activePage} onChange={setPage} total={collection?.properties?.meta.last_page ?? 1}>
              <Group spacing={5} position="center" className="mt-4">
                <Pagination.First />
                <Pagination.Previous />
                <Pagination.Items />
                <Pagination.Next />
                <Pagination.Last />
              </Group>
            </Pagination.Root>
          </>
        )}
      </CardBackground>
    </>
  );
};

export default Collection;
