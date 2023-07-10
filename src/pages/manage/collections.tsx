import { Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardBackground from "~/components/CardBackground";
import { ManagingTable } from "~/components/ManagingTable";
import { useCollections } from "~/hooks/useQueries";
import { type Collection } from "~/types";

const ManageCollections: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: colData, isLoading, isError } = useCollections({ session, status });
  const [collections, setCollections] = useState<Collection[]>([]);

  const router = useRouter();

  useEffect(() => {
    setCollections(colData?.data ?? []);
  }, [colData?.data]);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Error",
        message: "There was an error loading your collections.",
        color: "red",
        icon: <IconX size="1.5rem" />,
      });
    }
  }, [isError]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading collection.</div>;
  }

  const tableColumns = [
    {
      accessor: "id",
      title: "ID",
      width: 50,
      sortable: true,
    },
    {
      accessor: "name",
      title: "Name",
      sortable: true,
      ellipsis: true,
      width: 300,
    },
    {
      accessor: "num_properties",
      title: "Properties",
      width: 100,
      sortable: true,
    },
  ];

  return (
    <>
      <Head>
        <title>Manage Collections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CardBackground className="pt-4">
        <h1 className="mb-2">Manage Collections</h1>
        <ManagingTable
          records={collections}
          tableColumns={tableColumns}
          viewFunction={(col: Collection) => void router.push(`/collections/${col.id}`)}
          editFunction={(col: Collection) => {
            return;
          }}
          deleteFunction={(col: Collection) => {
            return;
          }}
          deleteMultipleFunction={(cols: Collection[]) => {
            return false;
          }}
        />
      </CardBackground>
    </>
  );
};

export default ManageCollections;
