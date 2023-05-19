import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { makeRequest } from "~/lib/requestHelper";
import type { Property, Links, Meta, Collection, CollectionWithProperties, CollectionProperty, Tag } from "~/types";

type CollectionsResponse = {
  data: Collection[];
  links: Links;
  meta: Meta;
};

type AllCollectionsResponse = {
  data: Collection[];
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

type UseElement = {
  session: Session | null;
  status: string;
};

type UseElementWithElementId = {
  session: Session | null;
  status: string;
  elementId: string;
};

type UseElementWithPageNumber = {
  session: Session | null;
  status: string;
  page: number;
};

type TagsResponse = {
  data: Tag[];
};

/* Keep this one to paginate the collections page? */
const fetchCollections = async (session: Session | null) => {
  const response = (await makeRequest("me/lists", "GET", session?.user.access_token)) as CollectionsResponse;
  return response;
};

const fetchAllCollections = async (session: Session | null) => {
  const response = (await makeRequest("me/lists/all", "GET", session?.user.access_token)) as AllCollectionsResponse;
  return response;
};

const fetchCollection = async (session: Session | null, id: string) => {
  // TODO: fix API response
  const response = (await makeRequest(`me/lists/${id}`, "GET", session?.user.access_token)) as CollectionResponse;
  return response;
};

const fetchProperties = async (session: Session | null, page = 1) => {
  const response = (await makeRequest(
    `me/properties?page=${page}`,
    "GET",
    session?.user.access_token
  )) as PropertiesResponse;
  return response;
};

const fetchProperty = async (session: Session | null, id: string) => {
  const response = (await makeRequest(`me/properties/${id}`, "GET", session?.user.access_token)) as PropertyResponse;
  console.log("response", response);
  return response.data;
};

const fetchTags = async (session: Session | null) => {
  const response = (await makeRequest("me/tags", "GET", session?.user.access_token)) as TagsResponse;
  return response.data;
};

export const useCollections = ({ session, status }: UseElement) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(session),
    enabled: status === "authenticated",
  });
};

export const useAllCollections = ({ session, status }: UseElement) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchAllCollections(session),
    enabled: status === "authenticated",
  });
};

export const useCollection = ({ session, status, elementId: collectionId }: UseElementWithElementId) => {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection(session, collectionId),
    enabled: status === "authenticated",
  });
};

export const useProperty = ({ session, status, elementId: propertyId }: UseElementWithElementId) => {
  return useQuery<Property>({
    queryKey: ["property", propertyId],
    queryFn: () => fetchProperty(session, propertyId),
    enabled: status === "authenticated",
  });
};

export const useProperties = ({ session, status, page }: UseElementWithPageNumber) => {
  return useQuery({
    queryKey: ["properties", page],
    queryFn: () => fetchProperties(session, page),
    enabled: status === "authenticated",
  });
};

export const useTags = ({ session, status }: UseElement) => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags(session),
    enabled: status === "authenticated",
  });
};
