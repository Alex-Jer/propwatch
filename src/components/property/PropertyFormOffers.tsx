import { ActionIcon, Button, NumberInput, SegmentedControl, TextInput } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { type ChangeEventHandler, useState, useEffect } from "react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { type Offer } from "~/types";
import { IconCurrencyEuro, IconTrash } from "@tabler/icons-react";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { sortBy } from "remeda";
import { nanoid } from "nanoid";

const listingTypes = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

type PropertyFormOffersProps = {
  offers: Offer[];
  setOffers: (offers: Offer[]) => void;
  offersToDelete: Offer[];
  setOffersToDelete: (offers: Offer[]) => void;
  mode?: "add" | "edit";
};

export function PropertyFormOffers({
  offers,
  setOffers,
  offersToDelete,
  setOffersToDelete,
  mode = "add",
}: PropertyFormOffersProps) {
  const [listingType, setListingType] = useState("sale");
  const [price, setPrice] = useInputState<number | "">("");
  const [priceError, setPriceError] = useState("");
  const [url, setUrl] = useInputState("");
  const [urlError, setUrlError] = useState("");
  const [description, setDescription] = useInputState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isAddDisabled, setIsAddDisabled] = useState(true);
  const [selectedOffers, setSelectedOffers] = useState<Offer[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: "id", direction: "asc" });
  const [modalOpened, { open, close }] = useDisclosure(false);

  const columns = [
    {
      accessor: "listing_type",
      title: "Type",
      width: 100,
      sortable: true,
      cellsClassName: "capitalize",
    },
    {
      accessor: "price",
      title: "Price (€)",
      width: 100,
      sortable: true,
    },
    {
      accessor: "url",
      title: "URL",
      width: 250,
      ellipsis: true,
      sortable: true,
    },
    {
      accessor: "description",
      title: "Designation",
      width: 200,
      ellipsis: true,
      sortable: true,
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 100,
      render: (offer: Offer) => (
        <ActionIcon color="red" onClick={() => handleDelete(offer)}>
          <IconTrash size={16} />
        </ActionIcon>
      ),
    },
  ];

  const addOffer = (offer: Offer) => {
    const newOffers = offers.concat(offer);
    setOffers(newOffers);
  };

  const removeOffer = (offer: Offer) => {
    const newOffers = offers.filter((o) => o.id !== offer.id);
    setOffers(newOffers);
  };

  const removeOffers = (offersToRemove: Offer[]) => {
    const newOffers = offers.filter((o) => !offersToRemove.includes(o));
    setOffers(newOffers);
  };

  const sortOffers = (offers: Offer[], sortStatus: DataTableSortStatus) => {
    // @ts-expect-error sortBy is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const sortedOffers = sortBy(offers, (offer) => offer[sortStatus.columnAccessor]);
    const sortedData = sortStatus.direction === "asc" ? sortedOffers : [...sortedOffers].reverse();
    setOffers(sortedData);
  };

  useEffect(() => {
    sortOffers(offers, sortStatus);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [sortStatus]);

  const deleteOffer = (offer: Offer) => {
    removeOffer(offer);
  };

  const handleDelete = (offer: Offer) => {
    if (selectedOffers.length > 1 && selectedOffers.some((s) => s.id === offer.id)) {
      open();
      return;
    }

    deleteOffer(offer);

    if (mode === "edit") {
      console.log("offersToDelete", offersToDelete);
      setOffersToDelete((state) => state.concat(offer));
    }
  };

  const deleteSelectedOffers = () => {
    removeOffers(selectedOffers);
    setSelectedOffers([]);
    setOffersToDelete((state) => state.concat(selectedOffers));
    console.log("offersToDelete", offersToDelete);
    close();
  };

  const validatePrice = (price: number | "") => {
    if (price !== "" && price < 0) {
      setPriceError("Price must be greater than 0");
      setIsAddDisabled(true);
      return false;
    }

    setPriceError("");

    if (priceError === "" && urlError === "" && descriptionError === "") {
      if (url !== "" && description !== "") {
        setIsAddDisabled(false);
      }
    }

    return true;
  };

  const validateUrl = (url: string) => {
    if (url === "") {
      setUrlError("URL is required");
      setIsAddDisabled(true);
      return false;
    }

    try {
      new URL(url);
    } catch (_) {
      setUrlError("URL is not valid");
      setIsAddDisabled(true);
      return false;
    }

    setUrlError("");

    if (urlError !== "") {
      setIsAddDisabled(false);
      return true;
    }

    if (priceError === "" && urlError === "" && descriptionError === "") {
      if (description !== "") {
        setIsAddDisabled(false);
      }
    }

    return true;
  };

  const validateDescription = (description: string) => {
    if (description === "") {
      setDescriptionError("Designation is required");
      setIsAddDisabled(true);
      return false;
    }

    setDescriptionError("");

    if (descriptionError !== "") {
      setIsAddDisabled(false);
      return true;
    }

    if (priceError === "" && urlError === "" && descriptionError === "") {
      if (url !== "") {
        setIsAddDisabled(false);
      }
    }

    return true;
  };

  const handlePriceChange = (price: number | "") => {
    setPrice(price);
    validatePrice(price);
  };

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const url = event.target.value;
    setUrl(url);
    validateUrl(url);
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const description = event.target.value;
    setDescription(description);
    validateDescription(description);
  };

  const addNewOffer = () => {
    if (!validatePrice(price) || !validateUrl(url) || !validateDescription(description)) {
      return;
    }

    const newOffer: Offer = {
      id: nanoid(),
      listing_type: listingType,
      price: price === "" ? undefined : Number(price),
      url,
      description,
    };

    addOffer(newOffer);

    setPrice("");
    setUrl("");
    setDescription("");

    setIsAddDisabled(true);
  };

  return (
    <>
      <ConfirmationModal
        opened={modalOpened}
        close={close}
        yesFunction={deleteSelectedOffers}
        title="Delete selected offers"
        text={`Are you sure you want to delete the ${selectedOffers.length} selected offers?`}
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />

      <div className="mt-4 grid grid-cols-12 gap-4" style={{ minHeight: "60px" }}>
        <div className="col-span-2">
          <SegmentedControl
            styles={() => ({ root: { width: "100%" } })}
            data={listingTypes}
            value={listingType}
            onChange={setListingType}
          />
        </div>
        <NumberInput
          className="col-span-2"
          placeholder="Price"
          value={price}
          icon={<IconCurrencyEuro size="1.1rem" />}
          onChange={handlePriceChange}
          error={priceError}
          min={0}
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 50)}
        />
        <TextInput className="col-span-4" placeholder="URL" value={url} onChange={handleUrlChange} error={urlError} />
        <TextInput
          className="col-span-3"
          placeholder="Designation"
          value={description}
          onChange={handleDescriptionChange}
          error={descriptionError}
        />
        <Button styles={() => ({ root: { padding: "0" } })} onClick={addNewOffer} disabled={isAddDisabled}>
          Add
        </Button>
      </div>
      {offers?.length === 0 ? (
        <div className="mb-8 mt-4 text-center text-gray-500">
          No offers added yet. Click on the <strong>Add</strong> button to add a new offer.
        </div>
      ) : (
        <DataTable
          className="mb-4"
          columns={columns}
          records={offers}
          selectedRecords={selectedOffers}
          onSelectedRecordsChange={setSelectedOffers}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      )}
      <Button
        onClick={() => {
          console.log({ offers });
          console.log({ offersToDelete });
        }}
      >
        Test
      </Button>
    </>
  );
}
