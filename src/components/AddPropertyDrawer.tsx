import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Textarea, Select, MultiSelect, NumberInput } from "react-hook-form-mantine";
import { useInputState } from "@mantine/hooks";
import { Button, Drawer, Loader, Stepper, Group, createStyles, Divider } from "@mantine/core";
import { IconBathFilled, IconCurrencyEuro } from "@tabler/icons-react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useSession } from "next-auth/react";
import { type SelectOption } from "~/types";
import { useAllCollections, useTags } from "~/hooks/useQueries";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddPropertyDrawerProps {
  opened: boolean;
  close: () => void;
}

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const TOTAL_STEPS = 5;

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

const schema = z.object({
  Title: z.string().nonempty({ message: "A title is required" }),
  Description: z.string(),
  "Property Type": z.string(),
  Typology: z.string(),
  "Current Status": z.string(),
  "Gross Area": z.number().positive().optional(),
  "Net Area": z.number().positive().optional(),
  "Number of Bathrooms": z.number().positive().optional(),
  "Listing Type": z.string(),
  "Current Sale Price": z.number().positive().optional(),
  "Current Rent Price": z.number().positive().optional(),
  "Media Type": z.string(),
  Tags: z.array(z.string()),
  Collections: z.array(z.string()),
  Files: z.array(z.any()),
  Blueprints: z.array(z.any()),
});

const defaultValues: FormSchemaType = {
  Title: "",
  Description: "",
  "Property Type": "",
  Typology: "",
  "Current Status": "",
  "Gross Area": undefined,
  "Net Area": undefined,
  "Number of Bathrooms": undefined,
  "Listing Type": "",
  "Current Sale Price": undefined,
  "Current Rent Price": undefined,
  "Media Type": "",
  Tags: [],
  Collections: [],
  Files: [],
  Blueprints: [],
};

type FormSchemaType = z.infer<typeof schema>;

export function AddPropertyDrawer({ opened, close }: AddPropertyDrawerProps) {
  const { classes } = useStyles();
  const [selectedListingType, setSelectedListingType] = useInputState("");
  const [stepperActive, setStepperActive] = useState(0);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedBlueprints, setSelectedBlueprints] = useState<any[]>([]);

  const nextStep = () => setStepperActive((current) => (current < TOTAL_STEPS ? current + 1 : current));
  const prevStep = () => setStepperActive((current) => (current > 0 ? current - 1 : current));

  const { data: session, status } = useSession();
  const { control, handleSubmit } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

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
        size="65%"
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
            <form
              onSubmit={handleSubmit(
                (data) => console.log(data),
                (error) => console.log(error)
              )}
            >
              <Stepper active={stepperActive} onStepClick={setStepperActive} breakpoint="sm">
                <Stepper.Step label="Main Info">
                  <TextInput
                    className="mb-3"
                    name="Title"
                    label="Title"
                    placeholder="Title"
                    control={control}
                    withAsterisk
                  />
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
                      data={propertyType}
                      name="Property Type"
                      label="Property Type"
                      placeholder="Property Type"
                      control={control}
                      searchable
                      nothingFound="No options"
                    />
                    <Select
                      data={typology}
                      name="Typology"
                      label="Typology"
                      placeholder="Typology"
                      control={control}
                      searchable
                      creatable
                      getCreateLabel={(query) => `+ Create ${query} `}
                      onCreate={(query) => {
                        const newTypology = { value: query, label: query };
                        typology.push(newTypology);
                        typology.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
                        return newTypology;
                      }}
                    />
                    <Select
                      data={currentStatus}
                      name="Current Status"
                      placeholder="Current Status"
                      label="Current Status"
                      control={control}
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
                </Stepper.Step>

                <Stepper.Step label="Address"></Stepper.Step>

                <Stepper.Step label="Characteristics"></Stepper.Step>

                <Stepper.Step label="Media & Blueprints">
                  <div className="mb-8">
                    <Divider my="xs" label="Images and Videos" labelPosition="center" />
                    <Controller
                      name="Files"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <FilePond
                          className={classes.filePond}
                          files={selectedFiles}
                          onupdatefiles={(fileItems) => {
                            const files = fileItems.map((fileItem) => fileItem.file);
                            setSelectedFiles(files);
                            onChange(files);
                          }}
                          labelIdle="Drag & Drop your media or <span class='filepond--label-action'>click to browse</span>"
                          allowMultiple={true}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <Divider my="xs" label="Blueprints" labelPosition="center" />
                    <Controller
                      name="Blueprints"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <FilePond
                          className={classes.filePond}
                          files={selectedBlueprints}
                          onupdatefiles={(blueprintItems) => {
                            const blueprints = blueprintItems.map((blueprintItem) => blueprintItem.file);
                            setSelectedBlueprints(blueprints);
                            onChange(blueprints);
                          }}
                          labelIdle="Drag & Drop your blueprints or <span class='filepond--label-action'>click to browse</span>"
                          allowMultiple={true}
                          acceptedFileTypes={["image/*", "application/pdf"]}
                        />
                      )}
                    />
                  </div>
                </Stepper.Step>

                <Stepper.Step label="Offers & Prices">
                  <Group className="mb-3" position="apart" grow>
                    <Select
                      data={listingType}
                      name="Listing Type"
                      label="Listing Type"
                      placeholder="Listing Type"
                      control={control}
                      nothingFound="No options"
                      clearable
                      onChange={setSelectedListingType}
                    />
                    <NumberInput
                      name="Current Sale Price"
                      label="Current Sale Price"
                      placeholder="Current Sale Price"
                      control={control}
                      icon={<IconCurrencyEuro size="1rem" />}
                      min={0}
                      disabled={selectedListingType === "rent"}
                    />
                    <NumberInput
                      name="Current Rent Price"
                      label="Current Rent Price"
                      placeholder="Current Rent Price"
                      control={control}
                      icon={<IconCurrencyEuro size="1rem" />}
                      min={0}
                      disabled={selectedListingType === "sale"}
                    />
                  </Group>
                </Stepper.Step>

                <Stepper.Completed>
                  <div className="flex flex-col items-center justify-center space-y-2">
                    Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi
                    Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
                    Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est
                    proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat
                    reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident
                    adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit
                    commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea
                    consectetur et est culpa et culpa duis.
                  </div>
                </Stepper.Completed>
              </Stepper>

              <div className="flex justify-end space-x-2">
                <Button variant="default" onClick={prevStep} disabled={stepperActive === 0}>
                  Back
                </Button>
                <Button type={stepperActive === TOTAL_STEPS ? "submit" : "button"} onClick={nextStep}>
                  {stepperActive === TOTAL_STEPS ? "Submit" : "Next"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Drawer>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  filePond: {
    "& .filepond--drop-label": {
      color: theme.colors.dark[0],

      "& .filepond--label-action": {
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },

    "& .filepond--panel-root": {
      backgroundColor: theme.colors.dark[5],
    },

    "& .filepond--drip-blob": {
      backgroundColor: theme.colors.dark[1],
    },

    "& .filepond--item-panel": {
      backgroundColor: theme.colors.dark[4],
    },

    "& .filepond--credits": {
      color: theme.colors.gray[0],
    },
  },
}));
