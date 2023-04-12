import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext } from "react";
import { axiosReq } from "~/lib/requestHelper";
import { Collection } from "~/types";

type AppData = {
  collections: Collection[];
  isLoadingCollections: boolean;
  isFetchingCollections: boolean;
  collectionsError: any;
};

const AppDataContext = createContext<AppData | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
};

const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  // const queryClient = useQueryClient();

  const fetchCollections = async () => {
    const res = await axiosReq("me/lists", "GET", session?.user.access_token);
    return res.data;
  };

  const {
    data: collections,
    isLoading: isLoadingCollections,
    isFetching: isFetchingCollections,
    error: collectionsError,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
    enabled: status === "authenticated",
  });

  return (
    <AppDataContext.Provider
      value={{
        collections,
        isLoadingCollections,
        isFetchingCollections,
        collectionsError,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export default AppDataProvider;
