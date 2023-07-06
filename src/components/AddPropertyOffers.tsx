import { Button, NumberInput, SegmentedControl, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { type ChangeEventHandler, useState } from "react";
import { DataTable } from "mantine-datatable";
import { type Offer } from "~/types";

type AddPropertyOffersProps = {
  offers: Offer[];
  setOffers: (offers: Offer[]) => void;
};

const listingTypes = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

const columns = [
  {
    accessor: "listing_type",
    title: "Listing Type",
  },
  {
    accessor: "price",
    title: "Price",
  },
  {
    accessor: "url",
    title: "URL",
  },
  {
    accessor: "description",
    title: "Designation",
  },
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
        <DataTable className="mb-4" columns={columns} records={offers} />
      )}
    </>
  );
}
