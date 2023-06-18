import { Button, Drawer } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Textarea } from "@mantine/core";
import { Select } from "@mantine/core";
import { MultiSelect } from "@mantine/core";
import { Group } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconCurrencyEuro } from "@tabler/icons-react";

interface NewPropertyDrawerProps {
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

const status = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "unknown", label: "Unknown" },
];

const tags = [
  { value: "tag1", label: "Tag 1" },
  { value: "tag2", label: "Tag 2" },
  { value: "tag3", label: "Tag 3" },
];

const lists = [
  { value: "list1", label: "List 1" },
  { value: "list2", label: "List 2" },
  { value: "list3", label: "List 3" },
];

export function NewPropertyDrawer({ opened, close }: NewPropertyDrawerProps) {
  const [selectedListingType, setSelectedListingType] = useInputState("");

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Add Property"
        position="right"
        size="60%"
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 gap-6">
            <TextInput label="Title" placeholder="Title" />
            <Textarea label="Description" placeholder="Description" autosize minRows={2} maxRows={5} />

            <Group position="apart" grow>
              <Select
                data={listingType}
                label="Listing Type"
                searchable
                nothingFound="No options"
                value={selectedListingType}
                onChange={setSelectedListingType}
              />

              <Select data={propertyType} label="Property Type" searchable nothingFound="No options" />
              <Select data={typology} label="Typology" searchable creatable />
              <Select data={status} label="Current Status" />
            </Group>

            <Group position="apart" grow>
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

            <Group position="apart" grow>
              <TextInput
                label="Gross Area"
                placeholder="Gross Area"
                icon="m²"
                styles={{ icon: { fontSize: "16px" } }}
              />
              <TextInput label="Net Area" placeholder="Net Area" icon="m²" styles={{ icon: { fontSize: "16px" } }} />
              <TextInput label="Numer of Bathrooms" placeholder="Bathrooms" />
            </Group>

            <Group position="apart" grow>
              <MultiSelect data={tags} label="Tags" placeholder="Tags" searchable clearable creatable />
              <MultiSelect data={lists} label="Lists" placeholder="Lists" searchable clearable creatable />
            </Group>

            <Button variant="light" fullWidth>
              Add Property
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
