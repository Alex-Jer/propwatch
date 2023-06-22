import { Button, Drawer, Loader, Stepper } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Textarea } from "@mantine/core";
import { Select } from "@mantine/core";
import { MultiSelect } from "@mantine/core";
import { Group } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconCurrencyEuro } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useAllCollections, useTags } from "~/hooks/useQueries";
import { type SelectOption } from "~/types";

interface AddPropertyDrawerProps {
  opened: boolean;
  close: () => void;
}

const listingType = [
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
  { value: "both", label: "Both" },
];

const propertyType = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "warehouse", label: "Warehouse" },
  { value: "garage", label: "Garage" },
  { value: "land", label: "Land" },
  { value: "other", label: "Other" },
];

const typology = [
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

const currentStatus = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "unknown", label: "Unknown" },
];

export function AddPropertyDrawer({ opened, close }: AddPropertyDrawerProps) {
  const [selectedListingType, setSelectedListingType] = useInputState("");
  const [stepperActive, setStepperActive] = useState(1);
  const nextStep = () => setStepperActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setStepperActive((current) => (current > 0 ? current - 1 : current));

  const { data: session, status } = useSession();

  const { data: tagsData, isLoading: tagsIsLoading } = useTags({ session, status });
  const { data: collectionsData, isLoading: collectionsIsLoading } = useAllCollections({ session, status });

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
    <>
      <Drawer
        title="Add Property"
        opened={opened}
        onClose={close}
        position="right"
        size="60%"
        overlayProps={{ opacity: 0.5, blur: 4 }}
        keepMounted
        styles={{
          header: {
            display: "flex",
            flexDirection: "column",
            padding: "1rem 1.5rem",
          },
          title: {
            marginBottom: "1rem",
            fontSize: "1.5rem",
            fontWeight: 700,
          },
          close: {
            position: "absolute",
            top: 0,
            right: 0,
            margin: "1rem",
          },
        }}
      >
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 gap-6">
            <Stepper active={stepperActive} onStepClick={setStepperActive} breakpoint="sm">
              <Stepper.Step label="Main Info" description="Basic info about the property">
                <TextInput className="mb-3" label="Title" placeholder="Title" />
                <Textarea
                  className="mb-3"
                  label="Description"
                  placeholder="Description"
                  autosize
                  minRows={2}
                  maxRows={5}
                />

                <Group className="mb-3" position="apart" grow>
                  <Select
                    data={propertyType}
                    label="Property Type"
                    placeholder="Property Type"
                    searchable
                    nothingFound="No options"
                  />

                  <Select data={typology} label="Typology" placeholder="Typology" searchable creatable />
                  <Select data={currentStatus} placeholder="Current Status" label="Current Status" />
                </Group>

                <Group className="mb-3" position="apart" grow>
                  <TextInput
                    label="Gross Area"
                    placeholder="Gross Area"
                    icon="m²"
                    styles={{ icon: { fontSize: "16px" } }}
                  />
                  <TextInput
                    label="Net Area"
                    placeholder="Net Area"
                    icon="m²"
                    styles={{ icon: { fontSize: "16px" } }}
                  />
                  <TextInput label="Numer of Bathrooms" placeholder="Bathrooms" />
                </Group>

                <Group position="apart" grow>
                  <MultiSelect
                    data={tags}
                    label="Tags"
                    placeholder="Tags"
                    icon={tagsIsLoading && <Loader size="1rem" />}
                    searchable
                    clearable
                    creatable
                  />

                  <MultiSelect
                    data={collections}
                    label="Collections"
                    placeholder="Collections"
                    icon={collectionsIsLoading && <Loader size="1rem" />}
                    searchable
                    clearable
                    creatable
                  />
                </Group>
              </Stepper.Step>

              <Stepper.Step label="Characteristics & Media" description="Characteristics and media">
                Step 2
              </Stepper.Step>

              <Stepper.Step label="Offers & Prices" description="Offers and prices">
                <Group position="apart" grow>
                  <Select
                    data={listingType}
                    label="Listing Type"
                    placeholder="Listing Type"
                    searchable
                    nothingFound="No options"
                    value={selectedListingType}
                    onChange={setSelectedListingType}
                  />

                  <TextInput
                    label="Current Sale Price"
                    placeholder="Current Sale Price"
                    icon={<IconCurrencyEuro size="1rem" />}
                    disabled={selectedListingType === "rent"}
                  />

                  <TextInput
                    label="Current Rent Price"
                    placeholder="Current Rent Price"
                    icon={<IconCurrencyEuro size="1rem" />}
                    disabled={selectedListingType === "sale"}
                  />
                </Group>
              </Stepper.Step>
            </Stepper>

            <div className="flex justify-end space-x-2">
              <Button variant="default" onClick={prevStep} disabled={stepperActive === 0}>
                Back
              </Button>
              <Button onClick={nextStep} disabled={stepperActive === 3}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
