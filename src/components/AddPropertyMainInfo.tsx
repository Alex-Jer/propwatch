import { Group, Loader } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconBathFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { type Control } from "react-hook-form";
import { TextInput, Textarea, Select, MultiSelect, NumberInput } from "react-hook-form-mantine";
import { useAllCollections, useTags } from "~/hooks/useQueries";
import { type SelectOption } from "~/types";
import { type FormSchemaType } from "./AddPropertyDrawer";

const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "warehouse", label: "Warehouse" },
  { value: "garage", label: "Garage" },
  { value: "land", label: "Land" },
  { value: "other", label: "Other" },
];

const typologies = [
  { value: "t0", label: "T0" },
  { value: "t1", label: "T1" },
  { value: "t2", label: "T2" },
  { value: "t3", label: "T3" },
  { value: "t4", label: "T4" },
  { value: "t5", label: "T5" },
  { value: "t6", label: "T6" },
  { value: "t7", label: "T7" },
  { value: "t8", label: "T8" },
  { value: "t9", label: "T9" },
  { value: "t10", label: "T10" },
];

const currentStatuses = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "unknown", label: "Unknown" },
];

export function AddPropertyMainInfo({ control }: { control: Control<FormSchemaType> }) {
  const { data: session, status } = useSession();
  const { data: tagsData, isLoading: tagsIsLoading } = useTags({ session, status });
  const { data: collectionsData, isLoading: collectionsIsLoading } = useAllCollections({ session, status });

  const [selectedPropertyType, setSelectedPropertyType] = useInputState("");

  let tags = [] as SelectOption[];
  let collections = [] as SelectOption[];

  if (tagsData) {
    tags = tagsData.map((tag) => ({
      value: tag.id.toString(),
      label: tag.name,
    }));
  }

  if (collectionsData) {
    collections = collectionsData.data.map((collection) => ({
      value: collection.id.toString(),
      label: collection.name,
    }));
  }

  return (
    <div>
      <TextInput className="mb-3" name="Title" label="Title" placeholder="Title" control={control} withAsterisk />
      <Textarea
        className="mb-3"
        name="Description"
        label="Description"
        placeholder="Description"
        control={control}
        autosize
        minRows={2}
        maxRows={5}
      />
      <Group className="mb-3" position="apart" grow>
        <Select
          data={propertyTypes}
          name="Property Type"
          label="Property Type"
          placeholder="Property Type"
          control={control}
          searchable
          nothingFound="No options"
          onChange={setSelectedPropertyType}
        />
        <Select
          data={currentStatuses}
          name="Current Status"
          placeholder="Current Status"
          label="Current Status"
          control={control}
        />
        <Select
          data={typologies}
          name="Typology"
          label="Typology"
          placeholder="Typology"
          control={control}
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query} `}
          onCreate={(query) => {
            const newTypology = { value: query, label: query };
            typologies.push(newTypology);
            typologies.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
            return newTypology;
          }}
          disabled={selectedPropertyType === "land"}
        />
      </Group>

      <Group className="mb-3" position="apart" grow>
        <NumberInput
          name="Gross Area"
          label="Gross Area"
          placeholder="Gross Area"
          control={control}
          icon="m²"
          step={5}
          min={0}
          styles={{ icon: { fontSize: "16px" } }}
        />
        <NumberInput
          name="Net Area"
          label="Net Area"
          placeholder="Net Area"
          control={control}
          icon="m²"
          step={5}
          min={0}
          styles={{ icon: { fontSize: "16px" } }}
        />
        <NumberInput
          name="Number of Bathrooms"
          label="Number of Bathrooms"
          placeholder="Bathrooms"
          control={control}
          icon={<IconBathFilled size="1rem" />}
          min={0}
        />
      </Group>

      <Group className="mb-3" position="apart" grow>
        <MultiSelect
          data={tags}
          name="Tags"
          label="Tags"
          placeholder="Tags"
          control={control}
          icon={tagsIsLoading && <Loader size="1rem" />}
          maxSelectedValues={10}
          searchable
          clearable
          creatable
          getCreateLabel={(query) => `+ Create ${query} `}
          onCreate={(query) => {
            const newTag = { value: query, label: query };
            tags.push(newTag);
            tags.sort((a, b) => a.label.localeCompare(b.label));
            return newTag;
          }}
        />
        <MultiSelect
          data={collections}
          name="Collections"
          label="Collections"
          placeholder="Collections"
          control={control}
          icon={collectionsIsLoading && <Loader size="1rem" />}
          searchable
          clearable
        />
      </Group>
    </div>
  );
}
