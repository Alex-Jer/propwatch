import { ActionIcon, Button, NumberInput, SegmentedControl, TextInput } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { type ChangeEventHandler, useState, useEffect } from "react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { type Offer } from "~/types";
import { IconTrash } from "@tabler/icons-react";
import useOffersStore from "~/hooks/useOffersStore";
import { ConfirmationModal } from "./ConfirmationModal";

const listingTypes = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

export function AddPropertyOffers() {
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

  const { offers, totalOffers, addOffer, removeOffer, removeOffers, sortOffers } = useOffersStore();

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
      title: "Price",
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
  };

  const deleteSelectedOffers = () => {
    removeOffers(selectedOffers);
    setSelectedOffers([]);
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

    setUrlError("");

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
      id: totalOffers + 1,
      listing_type: listingType,
      price: Number(price),
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
        text="Are you sure you want to delete the {selectedOffers.length} selected offers?"
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      ></ConfirmationModal>

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
          onChange={handlePriceChange}
          error={priceError}
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
      {offers.length === 0 ? (
        <div className="my-4 text-center text-gray-500">
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
    </>
  );
}
