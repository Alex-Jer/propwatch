import { ActionIcon, Group, Loader, Text } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconArrowBack, IconBathFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { type UseFormTrigger, type Control, type UseFormResetField } from "react-hook-form";
import { TextInput, Select, MultiSelect, NumberInput, Rating, Textarea } from "react-hook-form-mantine";
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

type AddPropertyMainInfoProps = {
  control: Control<FormSchemaType>;
  trigger?: UseFormTrigger<FormSchemaType>;
  disabled?: boolean;
  resetField?: UseFormResetField<FormSchemaType>;
};

export function AddPropertyMainInfo({ control, trigger, disabled, resetField }: AddPropertyMainInfoProps) {
  const { data: session, status } = useSession();
  const { data: tagsData, isLoading: tagsIsLoading } = useTags({ session, status });
  const { data: collectionsData, isLoading: collectionsIsLoading } = useAllCollections({ session, status });

  const [selectedPropertyType, setSelectedPropertyType] = useInputState("");
  const [isUndoRatingVisible, setIsUndoRatingVisible] = useState(false);

  let tags = [] as SelectOption[];
  let collections = [] as SelectOption[];

  if (tagsData) {
    tags = tagsData.map((tag) => ({
      value: tag.name,
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
      <TextInput
        className="mb-3"
        name="title"
        label="Title"
        placeholder="Title"
        control={control}
        withAsterisk
        data-autofocus
        required
        onBlur={() => trigger && void trigger("title")}
        disabled={disabled}
      />
      <Textarea
        className="mb-3"
        name="description"
        label="Description"
        placeholder="Description"
        control={control}
        disabled={disabled}
      />
      <Group className="mb-3" position="apart" grow>
        <Select
          data={propertyTypes}
          name="type"
          label="Property Type"
          placeholder="Property Type"
          control={control}
          searchable
          nothingFound="No options"
          onChange={setSelectedPropertyType}
          disabled={disabled}
        />
        <Select
          data={currentStatuses}
          name="status"
          placeholder="Current Status"
          label="Current Status"
          control={control}
          disabled={disabled}
        />
        <Select
          data={typologies}
          name="typology"
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
          disabled={selectedPropertyType === "land" || disabled}
        />
      </Group>

      <Group className="mb-3" position="apart" grow>
        <NumberInput
          name="gross_area"
          label="Gross Area"
          placeholder="Gross Area"
          control={control}
          icon="m²"
          step={5}
          min={0}
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 50)}
          styles={{ icon: { fontSize: "16px" } }}
          disabled={disabled}
        />
        <NumberInput
          name="useful_area"
          label="Net Area"
          placeholder="Net Area"
          control={control}
          icon="m²"
          step={5}
          min={0}
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 50)}
          styles={{ icon: { fontSize: "16px" } }}
          disabled={disabled}
        />
        <NumberInput
          name="wc"
          label="Number of Bathrooms"
          placeholder="Bathrooms"
          control={control}
          icon={<IconBathFilled size="1rem" />}
          min={0}
          stepHoldDelay={500}
          stepHoldInterval={(t) => Math.max(1000 / t ** 2, 50)}
          disabled={disabled}
        />
      </Group>

      <Group className="mb-3" position="apart" grow>
        <MultiSelect
          data={tags}
          name="tags"
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
          disabled={disabled}
        />
        <MultiSelect
          data={collections}
          name="lists"
          label="Collections"
          placeholder="Collections"
          control={control}
          icon={collectionsIsLoading && <Loader size="1rem" />}
          searchable
          clearable
          disabled={disabled}
        />
      </Group>
      <Text size="sm" weight={600}>
        Rating
      </Text>
      <Group className="-ml-px -mt-1">
        <Rating
          name="rating"
          fractions={2}
          control={control}
          readOnly={disabled}
          onChange={() => setIsUndoRatingVisible(true)}
        />
        <div className={`-ml-3 ${isUndoRatingVisible ? "" : "invisible"}`}>
          <ActionIcon
            onClick={() => {
              resetField && resetField("rating");
              setIsUndoRatingVisible(false);
            }}
          >
            <IconArrowBack size="1rem" />
          </ActionIcon>
        </div>
      </Group>
    </div>
  );
}
