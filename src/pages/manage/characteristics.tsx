import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconX } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import CardBackground from "~/components/CardBackground";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { ManagingTable } from "~/components/ManagingTable";
import { errorNotification, successNotification } from "~/components/PropertyCard";
import { useCharacteristicsPaginated } from "~/hooks/useQueries";
import { makeRequest } from "~/lib/requestHelper";
import { type BareCharacteristic } from "~/types";

const ManageCharacteristics: NextPage = () => {
  const { data: session, status } = useSession();
  const [activePage, setPage] = useState(1);
  const {
    data: crcData,
    isLoading,
    isError,
    refetch: refreshCharacteristics,
  } = useCharacteristicsPaginated({ session, status, page: activePage });
  const [crcs, setCrcs] = useState<BareCharacteristic[]>([]);
  const [selectedCrcs, setSelectedCrcs] = useState<BareCharacteristic | null>(null);

  const [delModOpened, { open: delOpen, close: delClose }] = useDisclosure(false);

  useEffect(() => {
    setCrcs(crcData?.data ?? []);
  }, [crcData?.data]);

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

  const deleteCharacteristic = () => {
    if (selectedCrcs && selectedCrcs.id) {
      makeRequest(`me/characteristics/${selectedCrcs.id.toString()}`, "DELETE", session?.user.access_token)
        .then(() => {
          setSelectedCrcs(null);
          delClose();
          successNotification("This characteristic has been deleted.", "Characteristic deleted");
          refreshCharacteristics().then().catch(null);
        })
        .catch(() => errorNotification("An unknown error occurred while deleting this characteristic."));
    }
  };

  const deleteMultipleFunction = async (crcs: BareCharacteristic[]) => {
    if (crcs.length > 0) {
      const ids = crcs.map((crc) => crc.id);
      const formData = new FormData();

      ids.forEach((id, index) => {
        formData.append(`characteristics[${index}]`, id.toString());
      });
      console.log(formData);
      try {
        await makeRequest(`me/characteristics/`, "DELETE", session?.user.access_token, formData);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        await refreshCharacteristics();
        successNotification("The selected characteristics have been deleted.", "Selected characteristics were deleted");
        return;
      } catch (e) {
        errorNotification("An unknown error occurred while deleting the selected characteristics.");
      }
    }
  };

  const tableColumns = [
    {
      accessor: "id",
      title: "ID",
      width: 75,
      sortable: true,
    },
    {
      accessor: "name",
      title: "Name",
      sortable: true,
      ellipsis: true,
      width: 150,
    },
    {
      accessor: "type",
      title: "Type",
      width: 75,
      sortable: true,
    },
  ];

  return (
    <>
      <Head>
        <title>Manage Characteristics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmationModal
        opened={delModOpened}
        close={delClose}
        yesFunction={deleteCharacteristic}
        title="Delete characteristic"
        text="Are you sure you want to delete this characteristic?"
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />
      <CardBackground className="pt-4">
        <h1 className="mb-2">Manage Characteristics</h1>
        <ManagingTable
          records={crcs}
          tableColumns={tableColumns}
          deleteFunction={(tag: BareCharacteristic) => {
            setSelectedCrcs(tag);
            delOpen();
          }}
          deleteMultipleFunction={deleteMultipleFunction}
          defaultSortStatus={{
            columnAccessor: "name",
            direction: "asc",
          }}
          pagination={{ activePage, setPage, total: crcData?.meta.last_page ?? 1 }}
        />
      </CardBackground>
    </>
  );
};

export default ManageCharacteristics;
