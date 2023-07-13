import { type UseQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";
import { type PropertiesResponse, useProperties } from "~/hooks/useQueries";

const initialProperties: PropertiesResponse = {
  data: [],
  links: {
    first: "",
    last: "",
    next: "",
    prev: "",
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: "",
    per_page: 1,
    to: 1,
    total: 1,
  },
};

type PropertiesContextType = {
  properties: PropertiesResponse;
  isLoading: boolean;
  isError: boolean;
  activePage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => Promise<UseQueryResult>;
};

type PropertiesDispatchContextType = React.Dispatch<React.SetStateAction<PropertiesResponse>>;

const PropertiesContext = createContext<PropertiesContextType>({
  properties: initialProperties,
  isLoading: false,
  isError: false,
  activePage: 1,
  setPage: () => {
    throw new Error("setPage function must be overridden");
  },
  refetch: () => {
    throw new Error("refetch function must be overridden");
  },
});

const PropertiesDispatchContext = createContext<PropertiesDispatchContextType>(() => {
  throw new Error("setProperties function must be overridden");
});

type PropertiesProviderProps = {
  children?: React.ReactNode;
  search: string;
  filters: Record<string, unknown>;
};

function PropertiesProvider({ search, filters, children }: PropertiesProviderProps) {
  const { data: session, status } = useSession();

  const [activePage, setPage] = useState(1);
  const [properties, setProperties] = useState<PropertiesResponse>(initialProperties);

  const {
    data: propData,
    isLoading,
    isError,
    refetch,
  } = useProperties({
    session,
    status,
    search,
    filters,
    page: activePage,
    enabled: !!session?.user.access_token,
  });

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (propData) {
      setProperties(propData);
    }
  }, [propData]);

  return (
    <PropertiesContext.Provider value={{ properties, isLoading, isError, activePage, setPage, refetch }}>
      <PropertiesDispatchContext.Provider value={setProperties}>{children}</PropertiesDispatchContext.Provider>
    </PropertiesContext.Provider>
  );
}

export { PropertiesProvider, PropertiesContext, PropertiesDispatchContext };
