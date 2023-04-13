import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { axiosReq } from "./lib/requestHelper";
import { UseCollectionsProps } from "./types";

const fetchCollections = async (session: Session) => {
  const response = await axiosReq("me/lists", "GET", session?.user.access_token);
  return response.data;
};

export const useCollections = ({ session, status }: UseCollectionsProps) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(session),
    enabled: status === "authenticated",
  });
};
