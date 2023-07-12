import { MultiSelect, NumberInput, RangeSlider, Text, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconBathFilled, IconHomeSearch, IconMapPinSearch } from "@tabler/icons-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { set } from "remeda";
import type { FiltersOptions } from "~/types";

type PropertyFiltersProps = {
  filters: FiltersOptions;
  setFilters: (filters: FiltersOptions) => void;
  clearFilters: boolean;
  setClearFilters: (clearFilters: boolean) => void;
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

export function PropertyFilters({
  filters: globalFilters,
  setFilters: setGlobalFilters,
  clearFilters,
  setClearFilters,
}: PropertyFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(globalFilters.listingPropertyFilters ?? []);
  const [filters, setFilters] = useDebouncedState<FiltersOptions>(globalFilters ?? {}, 500);

  useEffect(() => {
    if (clearFilters) {
      setClearFilters(false);
      return;
    }
    if (globalFilters === filters) return;
    setGlobalFilters({ ...globalFilters, ...filters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (clearFilters) {
      setFilters({});
      setSelectedFilters([]);
      setActualRatingValue([0, 10]);
      setRatingValue([0, 10]);
      setPriceMin(0);
      setPriceMax(0);
      setMinArea(0);
      setMaxArea(0);
      setBathrooms(0);
      setTypology([]);
      setAddressSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearFilters]);

  useEffect(() => {
    if (selectedFilters == filters.listingPropertyFilters) return;
    setFilters({ ...filters, listingPropertyFilters: selectedFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  const [actualRatingValue, setActualRatingValue] = useState<[number, number] | undefined>(globalFilters.ratingRange);
  const [ratingValue, setRatingValue] = useState<[number, number] | undefined>(globalFilters.ratingRange);

  useEffect(() => {
    if (ratingValue && ratingValue[0] == 0 && ratingValue[1] == 10) {
      setFilters({ ...filters, ratingRange: undefined });
    } else {
      setFilters({ ...filters, ratingRange: ratingValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingValue]);

  const [minPrice, setPriceMin] = useState<number | undefined>(globalFilters.minPrice ?? 0);
  const [maxPrice, setPriceMax] = useState<number | undefined>(globalFilters.maxPrice ?? 0);

  useEffect(() => {
    setFilters({ ...filters, minPrice, maxPrice });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  const [minArea, setMinArea] = useState<number | undefined>(globalFilters.minArea ?? 0);
  const [maxArea, setMaxArea] = useState<number | undefined>(globalFilters.maxArea ?? 0);

  useEffect(() => {
    setFilters({ ...filters, minArea, maxArea });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minArea, maxArea]);

  const [bathrooms, setBathrooms] = useState<number | undefined>(globalFilters.wcs ?? 0);

  useEffect(() => {
    setFilters({ ...filters, wcs: bathrooms });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bathrooms]);

  const [typology, setTypology] = useState<string[]>(globalFilters.typology ?? []);

  useEffect(() => {
    if (typology === null) {
      setFilters({ ...filters, typology: undefined });
    } else {
      setFilters({ ...filters, typology });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typology]);

  const [addressSearch, setAddressSearch] = useState<string | undefined>(globalFilters.addressSearch ?? undefined);

  useEffect(() => {
    if (!addressSearch || addressSearch === "") {
      setFilters({ ...filters, addressSearch: undefined });
    } else {
      setFilters({ ...filters, addressSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressSearch]);

  const numberInputOverride = (value: number | "", set: Dispatch<SetStateAction<number | undefined>>) => {
    if (value === "") {
      set(undefined);
    } else set(value);
  };

  return (
    <>
      <MultiSelect
        data={propertyNominalFilters}
        size="xs"
        mb="xs"
        defaultValue={globalFilters.listingPropertyFilters ?? []}
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
        defaultValue={globalFilters.ratingRange}
        value={actualRatingValue}
        minRange={0}
        maxRange={10}
        marks={[{ value: 0 }, { value: 2 }, { value: 4 }, { value: 6 }, { value: 8 }, { value: 10 }]}
        min={0}
        max={10}
        onChange={setActualRatingValue}
        onChangeEnd={setRatingValue}
      />
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          mb="xs"
          size="xs"
          label="Minimum price"
          defaultValue={globalFilters.minPrice ?? 0}
          stepHoldDelay={500}
          step={1000}
          min={0}
          max={1000000000}
          value={minPrice}
          onChange={(v) => numberInputOverride(v, setPriceMin)}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          parser={(value) => value.replace(/(\.*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value)) && parseInt(value) != 0
              ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")
              : ""
          }
          icon="€"
        />
        <NumberInput
          mb="xs"
          size="xs"
          label="Maximum price"
          defaultValue={globalFilters.maxPrice ?? 0}
          stepHoldDelay={500}
          step={1000}
          value={maxPrice}
          onChange={(v) => numberInputOverride(v, setPriceMax)}
          min={0}
          max={1000000000}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          parser={(value) => value.replace(/(\.*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value)) && parseInt(value) != 0
              ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")
              : ""
          }
          icon="€"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          mb="xs"
          size="xs"
          label="Minimum area"
          defaultValue={globalFilters.minArea ?? 0}
          stepHoldDelay={500}
          step={10}
          min={0}
          max={10000}
          value={minArea}
          onChange={(v) => numberInputOverride(v, setMinArea)}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          formatter={(value) => (parseInt(value) != 0 ? value : "")}
          icon="m²"
        />
        <NumberInput
          mb="xs"
          size="xs"
          label="Maximum area"
          defaultValue={globalFilters.maxArea ?? 0}
          stepHoldDelay={500}
          step={10}
          min={0}
          max={10000}
          value={maxArea}
          onChange={(v) => numberInputOverride(v, setMaxArea)}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
          formatter={(value) => (parseInt(value) != 0 ? value : "")}
          icon="m²"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MultiSelect
          mb="xs"
          size="xs"
          label="Typology"
          placeholder="Typology"
          defaultValue={globalFilters.typology ?? []}
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
          value={typology}
          onChange={setTypology}
        />
        <NumberInput
          mb="xs"
          size="xs"
          label="Number of Bathrooms"
          placeholder="Bathrooms"
          defaultValue={globalFilters.wcs ?? 0}
          icon={<IconBathFilled size="1rem" />}
          min={0}
          stepHoldDelay={500}
          value={bathrooms}
          onChange={(v) => numberInputOverride(v, setBathrooms)}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 50)}
          formatter={(value) => (parseInt(value) != 0 ? value : "")}
        />
      </div>
      <TextInput
        mb="xs"
        size="xs"
        label="Address"
        placeholder="Address search"
        defaultValue={globalFilters.addressSearch ?? ""}
        value={addressSearch}
        icon={<IconMapPinSearch size="0.8rem" stroke={1.5} />}
        onChange={(txt) => setAddressSearch(txt.target.value)}
      />
    </>
  );
}
