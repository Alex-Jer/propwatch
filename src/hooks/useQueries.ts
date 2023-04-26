import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { makeRequest } from "~/lib/requestHelper";
import { type Property, type Links, type Meta, type Collection } from "~/types";

type CollectionsResponse = {
  data: Collection[];
  links: Links;
  meta: Meta;
};

type CollectionResponse = {
  list: Collection;
  properties: Property[];
};

type PropertyResponse = {
  data: Property;
};

type UseCollectionsProps = {
  session: Session | null;
  status: string;
};

type UseCollectionProps = {
  session: Session | null;
  status: string;
  collectionId: string;
};

type UsePropertyProps = {
  session: Session | null;
  status: string;
  propertyId: string;
};

const fetchCollections = async (session: Session | null) => {
  const response = (await makeRequest("me/lists", "GET", session?.user.access_token)) as CollectionsResponse;
  return response.data;
};

const fetchCollection = async (session: Session | null, id: string) => {
  // TODO: fix API response
  const response = (await makeRequest(`me/lists/${id}`, "GET", session?.user.access_token)) as CollectionResponse;
  return response;
};

const fetchProperty = async (session: Session | null, id: string) => {
  const response = (await makeRequest(`me/properties/${id}`, "GET", session?.user.access_token)) as PropertyResponse;
  return response.data;
};

export const useCollections = ({ session, status }: UseCollectionsProps) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(session),
    enabled: status === "authenticated",
  });
};

export const useCollection = ({ session, status, collectionId }: UseCollectionProps) => {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection(session, collectionId),
    enabled: status === "authenticated",
  });
};

export const useProperty = ({ session, status, propertyId }: UsePropertyProps) => {
  return useQuery<Property>({
    queryKey: ["property", propertyId],
    queryFn: () => fetchProperty(session, propertyId),
    enabled: status === "authenticated",
  });
};
