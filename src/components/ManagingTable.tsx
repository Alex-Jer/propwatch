import { ActionIcon, Button, Group, Pagination, Tooltip } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import { sortBy } from "remeda";
import { ConfirmationModal } from "./ConfirmationModal";
import { useDisclosure } from "@mantine/hooks";
import { errorNotification } from "./PropertyCard";

type TableProps<T extends { id: any }> = {
  records: T[];
  tableColumns: any[];
  viewFunction?: (record: T) => void;
  editFunction?: (record: T) => void;
  deleteFunction?: (record: T) => void;
  deleteMultipleFunction?: (records: T[]) => Promise<void>;
  defaultSortStatus?: DataTableSortStatus;
  pagination?: {
    activePage: number;
    setPage: (page: number) => void;
    total: number;
  };
  title?: string;
};

export function ManagingTable<T extends { id: any }>({
  records,
  tableColumns,
  viewFunction,
  editFunction,
  deleteFunction,
  deleteMultipleFunction,
  defaultSortStatus,
  pagination,
  title,
}: TableProps<T>) {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>(
    defaultSortStatus ?? {
      columnAccessor: "id",
      direction: "asc",
    }
  );

  const [tableRecords, setTableRecords] = useState<T[]>([]);

  const [dataTableColumns, setDataTableColumns] = useState<any[]>([]);

  const [selectedRecords, setSelectedRecords] = useState<T[]>([]);

  const [modalOpened, { open, close }] = useDisclosure(false);

  const sortRecords = (records: T[], sortStatus: DataTableSortStatus) => {
    // @ts-expect-error sortBy is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
    const sortedRecords = sortBy(records, (record) => record[sortStatus.columnAccessor]);
    const sortedData = sortStatus.direction === "asc" ? sortedRecords : [...sortedRecords].reverse();
    setTableRecords(sortedData);
  };

  // Process sorts
  useEffect(() => {
    sortRecords(records, sortStatus);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [records, sortStatus]);

  useEffect(() => {
    const newCols = [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...tableColumns,
    ];

    if (viewFunction || deleteFunction || editFunction)
      setDataTableColumns([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...newCols,
        {
          accessor: "actions",
          title: "Actions",
          width: viewFunction && deleteFunction && editFunction ? 75 : 50,
          render: (record: T) => (
            <div className="flex flex-row items-center">
              {viewFunction && (
                <Tooltip label="View" color="gray" position="bottom" withArrow>
                  <ActionIcon color="blue" onClick={() => viewFunction(record)}>
                    <IconEye size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
              {editFunction && (
                <Tooltip label="Edit" color="gray" position="bottom" withArrow>
                  <ActionIcon color="yellow" onClick={() => editFunction(record)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
              {deleteFunction && (
                <Tooltip label="Delete" color="gray" position="bottom" withArrow>
                  <ActionIcon color="red" onClick={() => deleteFunction(record)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
            </div>
          ),
        },
      ]);
    else setDataTableColumns(newCols);
  }, [deleteFunction, editFunction, tableColumns, viewFunction]);

  /*const removeRecords = (recordsToRemove: T[]) => {
    sortRecords(
      tableRecords.filter((o) => !recordsToRemove.some((s) => s.id === o.id)),
      sortStatus
    );
  };*/

  const deleteSelectedRecords = () => {
    if (!deleteMultipleFunction) return;
    deleteMultipleFunction(selectedRecords)
      .then()
      .catch(() => {
        errorNotification("Something went wrong.");
      })
      .finally(() => {
        setSelectedRecords([]);
        close();
      });
  };

  const renderDeleteMultipleRecordsBtn = () => (
    <Button
      onClick={open}
      color="red"
      variant="filled"
      disabled={selectedRecords.length == 0}
      leftIcon={<IconTrash size="1rem" className="-mr-1" />}
    >
      Delete selected
    </Button>
  );

  return (
    <>
      <ConfirmationModal
        opened={modalOpened}
        close={close}
        yesFunction={deleteSelectedRecords}
        title="Delete selected records"
        text={`Are you sure you want to delete the ${selectedRecords.length} selected records?`}
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />

      <div className="mb-6 flex justify-between">
        <h1>{title}</h1>
        <div className="mt-2">{deleteMultipleFunction && renderDeleteMultipleRecordsBtn()}</div>
      </div>

      <DataTable
        withBorder={false}
        borderRadius="md"
        columns={dataTableColumns}
        records={tableRecords}
        {...(deleteMultipleFunction && {
          selectedRecords,
          onSelectedRecordsChange: setSelectedRecords,
        })}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
      {pagination && pagination.total > 1 && (
        <>
          <Pagination.Root value={pagination.activePage} onChange={pagination.setPage} total={pagination.total}>
            <Group spacing={5} position="center" className="mt-4">
              <Pagination.First />
              <Pagination.Previous />
              <Pagination.Items />
              <Pagination.Next />
              <Pagination.Last />
            </Group>
          </Pagination.Root>
        </>
      )}
    </>
  );
}
