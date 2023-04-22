import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { makeRequest } from "~/lib/requestHelper";
import { UseCollectionProps, UseCollectionsProps } from "~/types";

const fetchCollections = async (session: Session) => {
  const response = await makeRequest("me/lists", "GET", session?.user.access_token);
  return response.data;
};

const fetchCollection = async (session: Session, id: string) => {
  const response = await makeRequest(`me/lists/${id}`, "GET", session?.user.access_token);
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
