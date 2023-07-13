import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";
import { useProperties } from "~/hooks/useQueries";

const PropertiesContext = createContext(undefined);
const PropertiesDispatchContext = createContext(undefined);

type PropertiesProviderProps = {
  children?: React.ReactNode;
  filters?: any;
  search?: any;
};

function PropertiesProvider({ filters, search, children }: PropertiesProviderProps) {
  const { data: session, status } = useSession();

  const [activePage, setPage] = useState(1);
  const [properties, setProperties] = useState({});

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
