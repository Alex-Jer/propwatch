import { Button, NumberInput, SegmentedControl, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { ChangeEventHandler, useState } from "react";
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
    title: "Description",
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

  const handlePriceChange = (value: number | "") => {
    setPrice(value);

    if (value < 0) {
      setPriceError("Price must be positive");
      setIsAddDisabled(true);
    } else {
      setPriceError("");
    }

    if (value === "") {
      setIsAddDisabled(true);
    }

    if (value >= 0 && url !== "" && description !== "") {
      setIsAddDisabled(false);
    }
  };

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setUrl(value);

    if (value === "") {
      setUrlError("URL is required");
      setIsAddDisabled(true);
    } else {
      setUrlError("");
    }

    if (value !== "" && price !== "" && description !== "") {
      setIsAddDisabled(false);
    }
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setDescription(value);

    if (value === "") {
      setDescriptionError("Description is required");
      setIsAddDisabled(true);
    } else {
      setDescriptionError("");
    }

    if (value !== "" && price !== "" && url !== "") {
      setIsAddDisabled(false);
    }
  };

  const addOffer = () => {
    let isValid = true;

    if (price === "") {
      setPriceError("Price is required");
      isValid = false;
    } else if (price < 0) {
      setPriceError("Price must be positive");
      isValid = false;
    } else {
      setPriceError("");
    }

    if (url === "") {
      setUrlError("URL is required");
      isValid = false;
    } else {
      setUrlError("");
    }

    if (description === "") {
      setDescriptionError("Description is required");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!isValid) {
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
  };

  return (
    <>
      <div className="my-4 grid grid-cols-12 gap-4">
        <SegmentedControl className="col-span-2" data={listingTypes} value={listingType} onChange={setListingType} />
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
      <DataTable columns={columns} records={offers} />
    </>
  );
}
