import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { makeRequest } from "~/lib/requestHelper";
import type { Property, Links, Meta, Collection, CollectionWithProperties, CollectionProperty } from "~/types";

type CollectionsResponse = {
  data: Collection[];
  links: Links;
  meta: Meta;
};

type CollectionResponse = {
  data: CollectionWithProperties;
};

type PropertyResponse = {
  data: Property;
};

type PropertiesResponse = {
  data: CollectionProperty[];
  links: Links;
  meta: Meta;
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

type UsePropertiesProps = {
  session: Session | null;
  status: string;
};

const fetchCollections = async (session: Session | null) => {
  const response = (await makeRequest("me/lists", "GET", session?.user.access_token)) as CollectionsResponse;
  return response;
};

const fetchCollection = async (session: Session | null, id: string) => {
  // TODO: fix API response
  const response = (await makeRequest(`me/lists/${id}`, "GET", session?.user.access_token)) as CollectionResponse;
  return response;
};

const fetchProperties = async (session: Session | null) => {
  const response = (await makeRequest(`me/properties`, "GET", session?.user.access_token)) as PropertiesResponse;
  return response;
};

const fetchProperty = async (session: Session | null, id: string) => {
  const response = (await makeRequest(`me/properties/${id}`, "GET", session?.user.access_token)) as PropertyResponse;
  console.log("response", response);
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

export const useProperties = ({ session, status }: UsePropertiesProps) => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(session),
    enabled: status === "authenticated",
  });
};
