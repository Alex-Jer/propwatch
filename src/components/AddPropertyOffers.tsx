import { ActionIcon, Button, NumberInput, SegmentedControl, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { type ChangeEventHandler, useState, useEffect } from "react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { type Offer } from "~/types";
import { IconTrash } from "@tabler/icons-react";
import { sortBy } from "remeda";

type AddPropertyOffersProps = {
  offers: Offer[];
  setOffers: (offers: Offer[]) => void;
};

const listingTypes = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

export function AddPropertyOffers({ offers, setOffers }: AddPropertyOffersProps) {
  const [listingType, setListingType] = useState("sale");
  const [price, setPrice] = useInputState<number | "">("");
  const [priceError, setPriceError] = useState("");
  const [url, setUrl] = useInputState("");
  const [urlError, setUrlError] = useState("");
  const [description, setDescription] = useInputState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isAddDisabled, setIsAddDisabled] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState<Offer[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: "id", direction: "asc" });

  useEffect(() => {
    // @ts-expect-error sortBy is not typed
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-return
    const data = sortBy(offers, (offer) => offer[sortStatus.columnAccessor]) as Offer[];
    setOffers(sortStatus.direction === "asc" ? data : [...data].reverse());
  }, [sortStatus, offers, setOffers]);

  const deleteOffer = (offer: Offer) => {
    const newOffers = offers.filter((o) => o.id !== offer.id);
    setOffers(newOffers);
  };

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
      render: (row: Offer) => (
        <ActionIcon color="red" onClick={() => deleteOffer(row)}>
          <IconTrash size={16} />
        </ActionIcon>
      ),
    },
  ];

  const validatePrice = (price: number | "") => {
    if (price === "") {
      setPriceError("Price is required");
      setIsAddDisabled(true);
      return false;
    } else if (price < 0) {
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
      if (price !== "" && description !== "") {
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
      if (price !== "" && url !== "") {
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

  const addOffer = () => {
    if (!validatePrice(price) || !validateUrl(url) || !validateDescription(description)) {
      return;
    }

    const newOffer: Offer = {
      id: offers.length + 1,
      listing_type: listingType,
      price: Number(price),
      url,
      description,
    };

    setOffers([...offers, newOffer]);

    setPrice("");
    setUrl("");
    setDescription("");
  };

  return (
    <>
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
        <Button styles={() => ({ root: { padding: "0" } })} onClick={addOffer} disabled={isAddDisabled}>
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
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      )}
    </>
  );
}
