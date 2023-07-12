import { MultiSelect, NumberInput, RangeSlider, Text } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import type { FiltersOptions } from "~/types";

type PropertyFiltersProps = {
  filters: FiltersOptions;
  setFilters: (filters: FiltersOptions) => void;
};

const propertyNominalFilters = [
  { value: "status|available", label: "Status: Available", group: "Listing Status" },
  { value: "status|unavailable", label: "Status: Unavailable", group: "Listing Status" },
  { value: "status|unknown", label: "Status: Unknown", group: "Listing Status" },
  { value: "listing_type|both", label: "Listing: Both", group: "Listing Type" },
  { value: "listing_type|sale", label: "Listing: Sale", group: "Listing Type" },
  { value: "listing_type|rent", label: "Listing: Rent", group: "Listing Type" },
  { value: "listing_type|none", label: "Listing: None", group: "Listing Type" },
  { value: "type|house", label: "Type: House", group: "Property Type" },
  { value: "type|apartment", label: "Type: Apartment", group: "Property Type" },
  { value: "type|office", label: "Type: Office", group: "Property Type" },
  { value: "type|shop", label: "Type: Shop", group: "Property Type" },
  { value: "type|warehouse", label: "Type: Warehouse", group: "Property Type" },
  { value: "type|garage", label: "Type: Garage", group: "Property Type" },
  { value: "type|land", label: "Type: Land", group: "Property Type" },
  { value: "type|other", label: "Type: Other", group: "Property Type" },
];

export function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  useEffect(() => {
    const listingType: string[] = [];
    const listingStatus: string[] = [];
    const propertyType: string[] = [];
    selectedFilters.forEach((f) => {
      const fs = f.split("|");
      if (fs.length > 1 && fs[1]) {
        if (f.startsWith("listing_type")) {
          listingType.push(fs[1]);
        } else if (f.startsWith("status")) {
          listingStatus.push(fs[1]);
        } else if (f.startsWith("type")) {
          propertyType.push(fs[1]);
        }
      }
    });
    setFilters({ ...filters, listing_type: listingType, status: listingStatus, type: propertyType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  const [ratingValue, setRatingValue] = useState<[number, number]>([0, 10]);

  useEffect(() => {
    setFilters({ ...filters, ratingRange: ratingValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingValue]);

  const [priceMin, setPriceMin] = useDebouncedState<number>(0, 500);
  const [priceMax, setPriceMax] = useDebouncedState<number>(100000000, 500);

  useEffect(() => {
    console.log(priceMax);
    setFilters({ ...filters, priceRange: [priceMin, priceMax] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMin, priceMax]);

  return (
    <>
      <MultiSelect
        data={propertyNominalFilters}
        size="xs"
        mb="sm"
        value={selectedFilters}
        onChange={setSelectedFilters}
        label="Listing/Property Filter"
        placeholder="Pick some filters >w<"
        clearButtonProps={{ "aria-label": "Clear selection" }}
        clearable
      />
      <Text size="xs" className="font-semibold">
        Rating
      </Text>
      <RangeSlider
        mb="sm"
        label={(value) => (value / 2).toFixed(1).replace(".0", "").replace(".5", ",5")}
        defaultValue={[0, 10]}
        minRange={0}
        maxRange={10}
        marks={[{ value: 0 }, { value: 2 }, { value: 4 }, { value: 6 }, { value: 8 }, { value: 10 }]}
        min={0}
        max={10}
        onChangeEnd={setRatingValue}
      />
      <NumberInput
        label="Minimum price"
        stepHoldDelay={500}
        step={1000}
        min={0}
        max={1000000000}
        onChange={setPriceMin}
        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
      />
      <NumberInput
        label="Maximum price"
        stepHoldDelay={500}
        step={1000}
        onChange={setPriceMax}
        min={0}
        max={1000000000}
        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
      />
    </>
  );
}
