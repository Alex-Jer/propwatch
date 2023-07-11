import { MultiSelect, RangeSlider } from "@mantine/core";
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

      <RangeSlider
        mb="sm"
        defaultValue={[1, 2]}
        minRange={1}
        maxRange={10}
        marks={[{ value: 0 }, { value: 5 }, { value: 10 }]}
        min={0}
        max={10}
      />
    </>
  );
}
