import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { makeRequest } from "~/lib/requestHelper";
import type {
  Property,
  Links,
  Meta,
  Collection,
  CollectionWithProperties,
  CollectionProperty,
  Tag,
  SearchOptions,
} from "~/types";

type CollectionsResponse = {
  data: Collection[];
  links: Links;
  meta: Meta;
};

type SidebarCollectionsResponse = {
  data: Collection[];
  total: string;
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

type UseProperties = {
  session: Session | null;
  status: string;
  search: SearchOptions;
  page: number;
};

type TagsResponse = {
  data: Tag[];
};

const fetchCollection = async (session: Session | null, id: string) => {
  // TODO: fix API response
  const response = (await makeRequest(`me/lists/${id}`, "GET", session?.user.access_token)) as CollectionResponse;
  return response;
};

/* Keep this one to paginate the collections page? */
const fetchCollections = async (session: Session | null) => {
  const response = (await makeRequest("me/lists", "GET", session?.user.access_token)) as CollectionsResponse;
  return response;
};

const fetchAllCollections = async (session: Session | null) => {
  const response = (await makeRequest("me/lists/all", "GET", session?.user.access_token)) as SidebarCollectionsResponse;
  return response;
};

const fetchSidebarCollections = async (session: Session | null) => {
  const response = (await makeRequest(
    "me/lists/sidebar",
    "GET",
    session?.user.access_token
  )) as SidebarCollectionsResponse;
  return response;
};

const fetchProperty = async (session: Session | null, id: string) => {
  const response = (await makeRequest(`me/properties/${id}`, "GET", session?.user.access_token)) as PropertyResponse;
  console.log("response", response); // TODO: console.log
  return response.data;
};

const fetchProperties = async (session: Session | null, search: SearchOptions = {}, page = 1) => {
  let extraFields = "";

  if (search.query) extraFields += `&query=${encodeURIComponent(search.query)}`;
  if (search.list) extraFields += `&list_id=${encodeURIComponent(search.list)}`;
  if (search.adm) extraFields += `&adm_id=${encodeURIComponent(search.adm)}`;
  if (search.include_tags) extraFields += `&include_tags=${encodeURIComponent(JSON.stringify(search.include_tags))}`;
  if (search.exclude_tags) extraFields += `&exclude_tags=${encodeURIComponent(JSON.stringify(search.exclude_tags))}`;

  const response = (await makeRequest(
    `me/properties?page=${page}${extraFields}`,
    "GET",
    session?.user.access_token
  )) as PropertiesResponse;

  return response;
};

const fetchTags = async (session: Session | null) => {
  const response = (await makeRequest("me/tags", "GET", session?.user.access_token)) as TagsResponse;
  return response.data;
};

const fetchTagsSidebar = async (session: Session | null) => {
  const response = (await makeRequest("me/tags/sidebar", "GET", session?.user.access_token)) as TagsResponse;
  return response.data;
};

export const useCollection = ({ session, status, elementId: collectionId }: UseElementWithElementId) => {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection(session, collectionId),
    enabled: status === "authenticated",
  });
};

export const useCollections = ({ session, status }: UseElement) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(session),
    enabled: status === "authenticated",
  });
};

export const useSidebarCollections = ({ session, status }: UseElement) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchSidebarCollections(session),
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

export const useProperty = ({ session, status, elementId: propertyId }: UseElementWithElementId) => {
  return useQuery<Property>({
    queryKey: ["property", propertyId],
    queryFn: () => fetchProperty(session, propertyId),
    enabled: status === "authenticated",
  });
};

export const useProperties = ({ session, status, search, page }: UseProperties) => {
  return useQuery({
    queryKey: ["properties", search, page] /* TODO: Is this worth it ? */,
    queryFn: () => fetchProperties(session, search, page),
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

export const useTagsSidebar = ({ session, status }: UseElement) => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTagsSidebar(session),
    enabled: status === "authenticated",
  });
};
