import { Button, NumberInput, SegmentedControl, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useState } from "react";
import { DataTable } from "mantine-datatable";
import { type Control } from "react-hook-form";
import { type Offer } from "~/types";
import { type FormSchemaType } from "./AddPropertyDrawer";

type AddPropertyOffersProps = {
  control: Control<FormSchemaType>;
  offers: Offer[];
  setOffers: (offers: Offer[]) => void;
};

const listingTypes = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

export function AddPropertyOffers({ control, offers, setOffers }: AddPropertyOffersProps) {
  const [listingType, setListingType] = useState("sale");
  const [price, setPrice] = useInputState<number | "">("");
  const [url, setUrl] = useInputState("");
  const [description, setDescription] = useInputState("");

  const addOffer = () => {
    const newOffer: Offer = {
      id: offers.length + 1,
      listing_type: listingType,
      price: price === "" ? undefined : price,
      url,
      description,
    };

    setOffers([...offers, newOffer]);
  };

  return (
    <>
      <div className="my-4 grid grid-cols-12 gap-4">
        <SegmentedControl className="col-span-2" data={listingTypes} value={listingType} onChange={setListingType} />
        <NumberInput className="col-span-2" placeholder="Price" value={price} onChange={setPrice} />
        <TextInput className="col-span-4" placeholder="URL" value={url} onChange={setUrl} />
        <TextInput className="col-span-3" placeholder="Designation" value={description} onChange={setDescription} />
        <Button styles={() => ({ root: { padding: "0" } })} onClick={addOffer}>
          Add
        </Button>
      </div>
      <DataTable
        columns={[
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
        ]}
        records={offers}
      />
    </>
  );
}
