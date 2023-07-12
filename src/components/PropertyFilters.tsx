import { MultiSelect, NumberInput, RangeSlider, Text } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconBathFilled, IconHomeSearch } from "@tabler/icons-react";
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
    if (filters.listing_type == listingType && filters.status == listingStatus && filters.type == propertyType) return;
    setFilters({ ...filters, listing_type: listingType, status: listingStatus, type: propertyType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  const [ratingValue, setRatingValue] = useState<[number, number]>([0, 10]);

  useEffect(() => {
    if (filters.ratingRange && filters.ratingRange[0] == ratingValue[0] && filters.ratingRange[1] == ratingValue[1])
      return;
    setFilters({ ...filters, ratingRange: ratingValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingValue]);

  const [priceMin, setPriceMin] = useDebouncedState<number>(0, 500);
  const [priceMax, setPriceMax] = useDebouncedState<number>(100000000, 500);

  useEffect(() => {
    if (filters.priceRange && filters.priceRange[0] == priceMin && filters.priceRange[1] == priceMax) return;
    setFilters({ ...filters, priceRange: [priceMin, priceMax] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMin, priceMax]);

  const [minArea, setMinArea] = useDebouncedState<number>(0, 500);
  const [maxArea, setMaxArea] = useDebouncedState<number>(10000, 500);

  useEffect(() => {
    if (filters.areaRange && filters.areaRange[0] == minArea && filters.areaRange[1] == maxArea) return;
    setFilters({ ...filters, areaRange: [minArea, maxArea] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minArea, maxArea]);

  const [bathrooms, setBathrooms] = useDebouncedState<number>(0, 500);

  useEffect(() => {
    if (bathrooms == filters.wcs) return;
    setFilters({ ...filters, wcs: bathrooms });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bathrooms]);

  const [typology, setTypology] = useDebouncedState<string[]>([], 500);

  useEffect(() => {
    if (typology == filters.typology) return;
    if (typology === null) {
      setFilters({ ...filters, typology: undefined });
    } else {
      setFilters({ ...filters, typology });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typology]);

  return (
    <>
      <MultiSelect
        data={propertyNominalFilters}
        size="xs"
        mb="xs"
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
        mb="xs"
        label={(value) => (value / 2).toFixed(1).replace(".0", "").replace(".5", ",5")}
        defaultValue={[0, 10]}
        minRange={0}
        maxRange={10}
        marks={[{ value: 0 }, { value: 2 }, { value: 4 }, { value: 6 }, { value: 8 }, { value: 10 }]}
        min={0}
        max={10}
        onChangeEnd={setRatingValue}
      />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          mb="xs"
          size="xs"
          label="Minimum price"
          stepHoldDelay={500}
          step={1000}
          min={0}
          max={1000000000}
          onChange={setPriceMin}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          parser={(value) => value.replace(/(\.*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".") : ""
          }
          icon="€"
        />
        <NumberInput
          mb="xs"
          size="xs"
          label="Maximum price"
          stepHoldDelay={500}
          step={1000}
          onChange={setPriceMax}
          min={0}
          max={1000000000}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          parser={(value) => value.replace(/(\.*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".") : ""
          }
          icon="€"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          mb="xs"
          size="xs"
          label="Minimum area"
          stepHoldDelay={500}
          step={10}
          min={0}
          max={10000}
          onChange={setMinArea}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          icon="m²"
        />
        <NumberInput
          mb="xs"
          size="xs"
          label="Maximum area"
          stepHoldDelay={500}
          step={10}
          min={0}
          max={10000}
          onChange={setMaxArea}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          icon="m²"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MultiSelect
          mb="xs"
          size="xs"
          label="Typology"
          placeholder="Typology"
          icon={<IconHomeSearch size="1rem" />}
          data={[
            { value: "T0", label: "T0" },
            { value: "T1", label: "T1" },
            { value: "T2", label: "T2" },
            { value: "T3", label: "T3" },
            { value: "T4", label: "T4" },
            { value: "T5", label: "T5" },
            { value: "T6+", label: "T6+" },
          ]}
          onChange={setTypology}
        />
        <NumberInput
          mb="xs"
          size="xs"
          label="Number of Bathrooms"
          placeholder="Bathrooms"
          icon={<IconBathFilled size="1rem" />}
          min={0}
          stepHoldDelay={500}
          onChange={setBathrooms}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 50)}
        />
      </div>
    </>
  );
}
