import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, NumberInput } from "react-hook-form-mantine";
import { useInputState } from "@mantine/hooks";
import { Button, Drawer, Stepper, Group, createStyles, Divider } from "@mantine/core";
import { IconCurrencyEuro } from "@tabler/icons-react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { AddPropertyMainInfo } from "./AddPropertyMainInfo";

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
  { value: "none", label: "None" },
];

const schema = z.object({
  Title: z
    .string()
    .nonempty({ message: "A title is required" })
    .min(5, { message: "Title must be at least 5 characters long" }),
  Description: z.string(),
  "Property Type": z.string(),
  Typology: z.string(),
  "Current Status": z.string(),
  "Gross Area": z.number().nonnegative().optional(),
  "Net Area": z.number().nonnegative().optional(),
  "Number of Bathrooms": z.number().nonnegative().optional(),
  "Listing Type": z.string(),
  "Current Sale Price": z.number().nonnegative().optional(),
  "Current Rent Price": z.number().nonnegative().optional(),
  Tags: z.array(z.string().max(32, { message: "Tag must be at most 32 characters long" })),
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
  Tags: [],
  Collections: [],
  Files: [],
  Blueprints: [],
};

export type FormSchemaType = z.infer<typeof schema>;

export function AddPropertyDrawer({ opened, close }: AddPropertyDrawerProps) {
  const { classes } = useStyles();
  const [selectedListingType, setSelectedListingType] = useInputState("");
  const [stepperActive, setStepperActive] = useState(0);
  const [addPropertyCounter, setAddPropertyCounter] = useState(0);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedBlueprints, setSelectedBlueprints] = useState<any[]>([]);

  const nextStep = () => setStepperActive((current) => (current < TOTAL_STEPS ? current + 1 : current));
  const prevStep = () => setStepperActive((current) => (current > 0 ? current - 1 : current));

  const addPropertyButtonRef = useRef(null);

  const { control, handleSubmit, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const resetForm = () => {
    setAddPropertyCounter(0);
    reset(defaultValues);
    setStepperActive(0);
    setSelectedFiles([]);
    setSelectedBlueprints([]);
  };

  const addProperty = (data: FormSchemaType) => {
    if (addPropertyButtonRef.current === null) {
      return;
    }

    const addPropertyButtonElement = addPropertyButtonRef.current as HTMLElement;
    const buttonText = addPropertyButtonElement?.querySelector(".mantine-Button-label")?.textContent;
    const containsAddProperty = buttonText?.includes("Add Property");

    // HACK: Check if the button text contains "Add Property"
    if (containsAddProperty) {
      setAddPropertyCounter((current) => current + 1);

      // HACK: Only submit the form if the button has been clicked twice
      if (addPropertyCounter === 0) {
        return;
      }

      console.log({ data });
      resetForm();
      close();
    }
  };

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
              /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
              onSubmit={handleSubmit(
                (data: FormSchemaType) => addProperty(data),
                (error) => console.log({ error })
              )}
            >
              <Stepper active={stepperActive} onStepClick={setStepperActive} breakpoint="sm">
                <Stepper.Step label="Main Info">
                  <AddPropertyMainInfo control={control} />
                </Stepper.Step>

                <Stepper.Step label="Address"></Stepper.Step>

                <Stepper.Step label="Characteristics"></Stepper.Step>

                <Stepper.Step label="Media & Blueprints">
                  <div className="mb-8">
                    <Divider my="xs" label="Images and Videos" labelPosition="center" />
                    <Controller
                      name="Files"
                      control={control}
                      defaultValue={[]}
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
                <Button
                  ref={addPropertyButtonRef}
                  type={stepperActive === TOTAL_STEPS ? "submit" : "button"}
                  onClick={nextStep}
                >
                  {stepperActive === TOTAL_STEPS ? "Add Property" : "Next"}
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
