import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, NumberInput } from "react-hook-form-mantine";
import { useInputState } from "@mantine/hooks";
import { Button, Drawer, Stepper, Group, Paper } from "@mantine/core";
import { IconCheck, IconCurrencyEuro } from "@tabler/icons-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddPropertyMainInfo } from "./AddPropertyMainInfo";
import { notifications } from "@mantine/notifications";
import { AddPropertyMedia } from "./AddPropertyMedia";
import { AddPropertyAddress } from "./AddPropertyAddress";

interface AddPropertyDrawerProps {
  opened: boolean;
  close: () => void;
}

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
  Description: z.string().max(5000, { message: "Description must be at most 5000 characters long" }),
  "Property Type": z
    .enum(["house", "apartment", "office", "shop", "warehouse", "garage", "land", "other"])
    .optional()
    .nullable(),
  Typology: z.string().max(12, { message: "Typology must be at most 12 characters long" }),
  "Current Status": z.enum(["available", "unavailable", "unknown"]).optional().nullable(),
  "Gross Area": z
    .union([z.number().int().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  "Net Area": z
    .union([z.number().int().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  "Number of Bathrooms": z
    .union([z.number().int().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  "Listing Type": z.enum(["sale", "rent", "both", "none"]).optional().nullable(),
  "Current Sale Price": z
    .union([z.number().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  "Current Rent Price": z
    .union([z.number().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  Tags: z.array(z.string().max(32, { message: "Tag must be at most 32 characters long" })),
  Collections: z.array(z.string()),
  Images: z.array(z.any()),
  Blueprints: z.array(z.any()),
  Videos: z.array(z.any()),
  /* ADDRESS */
  "Full Address": z.string().max(200, { message: "Address must be at most 200 characters long" }),
  "Postal Code": z
    .string()
    .max(10, { message: "Postal Code must be at most 20 characters long" })
    .refine((value) => value === "" || value.length >= 4, {
      message: "Postal Code must be at least 4 characters long",
    })
    .optional()
    .nullable(),
  Latitude: z
    .union([z.number().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  Longitude: z
    .union([z.number().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  Adm1: z.string().optional().nullable(),
  Adm2: z.string().optional().nullable(),
  Adm3: z.string().optional().nullable(),
  Rating: z.number().optional().nullable(),
});

const defaultValues: FormSchemaType = {
  Title: "",
  Description: "",
  "Property Type": null,
  Typology: "",
  "Current Status": null,
  "Gross Area": "",
  "Net Area": "",
  "Number of Bathrooms": "",
  "Listing Type": null,
  "Current Sale Price": "",
  "Current Rent Price": "",
  Tags: [],
  Collections: [],
  Images: [],
  Blueprints: [],
  Videos: [],
  "Full Address": "",
  "Postal Code": "",
  Latitude: "",
  Longitude: "",
  Adm1: null,
  Adm2: null,
  Adm3: null,
  Rating: 0,
};

export type FormSchemaType = z.infer<typeof schema>;

export function AddPropertyDrawer({ opened, close }: AddPropertyDrawerProps) {
  const [selectedListingType, setSelectedListingType] = useInputState("");
  const [stepperActive, setStepperActive] = useState(0);
  const [addPropertyCounter, setAddPropertyCounter] = useState(0);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedBlueprints, setSelectedBlueprints] = useState<any[]>([]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);

  const nextStep = () => setStepperActive((current) => (current < TOTAL_STEPS ? current + 1 : current));
  const prevStep = () => setStepperActive((current) => (current > 0 ? current - 1 : current));

  const addPropertyButtonRef = useRef(null);

  const { control, handleSubmit, reset, resetField, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const resetForm = () => {
    setValue("Gross Area", 0);
    setAddPropertyCounter(0);
    reset(defaultValues);
    setStepperActive(0);
    setSelectedImages([]);
    setSelectedBlueprints([]);
    setSelectedVideos([]);
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

      notifications.show({
        title: "Property added",
        message: "Your property has been added successfully!",
        icon: <IconCheck size="1.1rem" />,
        color: "teal",
      });
    }
  };

  return (
    <>
      <Drawer
        title="Add Property"
        opened={opened}
        onClose={close}
        position="right"
        size="75%"
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

                <Stepper.Step label="Address">
                  <AddPropertyAddress control={control} resetField={resetField} />
                </Stepper.Step>

                <Stepper.Step label="Characteristics"></Stepper.Step>

                <Stepper.Step label="Media & Blueprints">
                  <AddPropertyMedia
                    control={control}
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    selectedBlueprints={selectedBlueprints}
                    setSelectedBlueprints={setSelectedBlueprints}
                    selectedVideos={selectedVideos}
                    setSelectedVideos={setSelectedVideos}
                  />
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
                      stepHoldDelay={500}
                      stepHoldInterval={(t) => Math.max(1000 / t ** 2, 50)}
                      disabled={selectedListingType === "rent"}
                    />
                    <NumberInput
                      name="Current Rent Price"
                      label="Current Rent Price"
                      placeholder="Current Rent Price"
                      control={control}
                      icon={<IconCurrencyEuro size="1rem" />}
                      min={0}
                      stepHoldDelay={500}
                      stepHoldInterval={(t) => Math.max(1000 / t ** 2, 50)}
                      disabled={selectedListingType === "sale"}
                    />
                  </Group>
                </Stepper.Step>

                <Stepper.Completed>
                  {/* make a centered header saying "Summary" */}
                  <h1 className="mb-2 text-2xl font-semibold">Summary</h1>
                  <Paper className="mb-4" shadow="xs" p="md" withBorder>
                    <AddPropertyMainInfo control={control} disabled />
                    <AddPropertyAddress control={control} resetField={resetField} disabled />
                  </Paper>
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
