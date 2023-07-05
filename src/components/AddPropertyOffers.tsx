import { Button, NumberInput, SegmentedControl, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useState } from "react";
import { type Control } from "react-hook-form";
import { type Offer } from "~/types";
import { type FormSchemaType } from "./AddPropertyDrawer";

type AddPropertyOffersProps = {
  control: Control<FormSchemaType>;
};

const listingTypes = [
  { label: "Sale", value: "sale" },
  { label: "Rent", value: "rent" },
];

const offers: Offer[] = [];

export function AddPropertyOffers({ control }: AddPropertyOffersProps) {
  const [listingType, setListingType] = useState("sale");
  const [price, setPrice] = useInputState<number | "">("");
  const [url, setUrl] = useInputState("");
  const [description, setDescription] = useInputState("");

  const addOffer = () => {
    const newOffer: Offer = {
      listing_type: listingType,
      price: price === "" ? undefined : price,
      url,
      description,
    };

    offers.push(newOffer);

    console.log(offers);
  };

  return (
    <div className="my-4 grid grid-cols-12 gap-4">
      <SegmentedControl className="col-span-2" data={listingTypes} value={listingType} onChange={setListingType} />
      <NumberInput className="col-span-2" placeholder="Price" value={price} onChange={setPrice} />
      <TextInput className="col-span-4" placeholder="URL" value={url} onChange={setUrl} />
      <TextInput className="col-span-3" placeholder="Designation" value={description} onChange={setDescription} />
      <Button styles={() => ({ root: { padding: "0" } })} onClick={addOffer}>
        Add
      </Button>
    </div>
  );
}
