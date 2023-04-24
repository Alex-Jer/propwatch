import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { makeRequest } from "~/lib/requestHelper";
import { Property, UseCollectionProps, UseCollectionsProps, UsePropertyProps } from "~/types";

const fetchCollections = async (session: Session) => {
  const response = await makeRequest("me/lists", "GET", session?.user.access_token);
  return response.data;
};

const fetchCollection = async (session: Session, id: string) => {
  const response = await makeRequest(`me/lists/${id}`, "GET", session?.user.access_token);
  return response;
};

const fetchProperty = async (session: Session, id: string) => {
  const response = await makeRequest(`me/properties/${id}`, "GET", session?.user.access_token);
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
