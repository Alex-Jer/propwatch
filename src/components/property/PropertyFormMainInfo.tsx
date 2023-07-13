import { ActionIcon, Group, Loader, Text, Tooltip } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconArrowBack, IconBathFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { type UseFormTrigger, type Control, type UseFormResetField, type UseFormSetValue } from "react-hook-form";
import { TextInput, Select, MultiSelect, NumberInput, Rating, Textarea } from "react-hook-form-mantine";
import { type SelectOption } from "~/types";
import { type FormSchemaType } from "./PropertyForm";

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
  { value: "T0", label: "T0" },
  { value: "T1", label: "T1" },
  { value: "T2", label: "T2" },
  { value: "T3", label: "T3" },
  { value: "T4", label: "T4" },
  { value: "T5", label: "T5" },
  { value: "T6", label: "T6" },
  { value: "T7", label: "T7" },
  { value: "T8", label: "T8" },
  { value: "T9", label: "T9" },
  { value: "T10", label: "T10" },
];

const currentStatuses = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "unknown", label: "Unknown" },
];

type PropertyFormMainInfoProps = {
  tags: SelectOption[];
  collections: SelectOption[];
  tagsLoading: boolean;
  collectionsLoading: boolean;
  control: Control<FormSchemaType>;
  trigger?: UseFormTrigger<FormSchemaType>;
  disabled?: boolean;
  resetField?: UseFormResetField<FormSchemaType>;
  setValue?: UseFormSetValue<FormSchemaType>;
  defaultValues?: FormSchemaType;
};

export function PropertyFormMainInfo({
  tags,
  collections,
  tagsLoading,
  collectionsLoading,
  control,
  trigger,
  disabled,
  resetField,
  setValue,
  defaultValues,
}: PropertyFormMainInfoProps) {
  const [selectedPropertyType, setSelectedPropertyType] = useInputState("");
  const [isUndoRatingVisible, setIsUndoRatingVisible] = useState(false);
  const [previousRating, setPreviousRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(defaultValues?.rating || 0);

  const handleRatingChange = (value: number) => {
    if (value === currentRating) {
      setValue && setValue("rating", 0);
      setCurrentRating(0);
    } else {
      setValue && setValue("rating", value);
      setCurrentRating(value);
    }
  };

  useEffect(() => {
    if (currentRating === defaultValues?.rating || defaultValues?.rating === null) {
      setIsUndoRatingVisible(false);
    } else {
      setIsUndoRatingVisible(true);
    }
  }, [currentRating, defaultValues?.rating]);

  useEffect(() => {
    if (currentRating === previousRating) {
      setValue && setValue("rating", 0);
      setCurrentRating(0);
    } else {
      setValue && setValue("rating", currentRating);
    }

    setPreviousRating(currentRating);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [currentRating, setValue]);

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
          icon={tagsLoading && <Loader size="1rem" />}
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
          icon={collectionsLoading && <Loader size="1rem" />}
          searchable
          clearable
          disabled={disabled}
        />
      </Group>
      {!trigger && (
        <div className="-mb-10">
          <Text size="sm" weight={600}>
            Rating
          </Text>
          <Group className="-ml-px -mt-1">
            <Rating name="rating" fractions={2} control={control} readOnly={disabled} onChange={handleRatingChange} />
            <div className={`-ml-3 ${isUndoRatingVisible ? "" : "invisible"}`}>
              <Tooltip label="Undo">
                <ActionIcon
                  onClick={() => {
                    resetField && resetField("rating");
                    setCurrentRating(defaultValues?.rating || 0);
                    setIsUndoRatingVisible(false);
                  }}
                >
                  <IconArrowBack size="1rem" />
                </ActionIcon>
              </Tooltip>
            </div>
          </Group>
        </div>
      )}
    </div>
  );
}
