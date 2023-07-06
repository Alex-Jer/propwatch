import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Drawer, Stepper, Paper } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddPropertyMainInfo } from "./AddPropertyMainInfo";
import { notifications } from "@mantine/notifications";
import { AddPropertyMedia } from "./AddPropertyMedia";
import { AddPropertyAddress } from "./AddPropertyAddress";
import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "~/lib/requestHelper";
import { useSession } from "next-auth/react";
import { type Property } from "~/types";
import { AddPropertyOffers } from "./AddPropertyOffers";
import useOffersStore from "~/hooks/useOffersStore";
import { AddPropertyCharacteristics } from "./AddPropertyCharacteristics";

interface AddPropertyDrawerProps {
  opened: boolean;
  close: () => void;
}

type PropertyResponse = {
  message: string;
  property: Property;
};

const TOTAL_STEPS = 5;

const schema = z.object({
  title: z
    .string()
    .nonempty({ message: "A title is required" })
    .min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().max(5000, { message: "Description must be at most 5000 characters long" }),
  type: z.enum(["house", "apartment", "office", "shop", "warehouse", "garage", "land", "other"]).optional().nullable(),
  typology: z.string().max(12, { message: "Typology must be at most 12 characters long" }),
  status: z.enum(["available", "unavailable", "unknown"]).optional().nullable(),
  gross_area: z
    .union([z.number().int().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  useful_area: z
    .union([z.number().int().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  wc: z
    .union([z.number().int().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  current_price: z
    .union([z.number().nonnegative().optional().nullable(), z.string().max(16)])
    .optional()
    .nullable(),
  tags: z.array(z.string().max(32, { message: "Tag must be at most 32 characters long" })),
  lists: z.array(z.string()),
  images: z.array(z.any()),
  blueprints: z.array(z.any()),
  videos: z.array(z.any()),
  characteristics: z.array(
    z.object({
      name: z.string().max(32, { message: "Characteristic name must be at most 32 characters long" }),
      type: z.enum(["numerical", "textual"]),
      value: z.string().max(32, { message: "Characteristic value must be at most 32 characters long" }),
    })
  ),
  /* ADDRESS */
  full_address: z
    .string()
    .nonempty({ message: "Address is required" })
    .max(200, { message: "Address must be at most 200 characters long" }),
  postal_code: z
    .string()
    .max(10, { message: "Postal Code must be at most 20 characters long" })
    .refine((value) => value === "" || value.length >= 4, {
      message: "Postal Code must be at least 4 characters long",
    })
    .optional()
    .nullable(),
  latitude: z
    .union([z.number().optional().nullable(), z.string().max(24)])
    .optional()
    .nullable(),
  longitude: z
    .union([z.number().optional().nullable(), z.string().max(24)])
    .optional()
    .nullable(),
  adm1_id: z.string().optional().nullable(),
  adm2_id: z.string().optional().nullable(),
  adm3_id: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
});

const defaultValues: FormSchemaType = {
  title: "",
  description: "",
  type: null,
  typology: "",
  status: null,
  gross_area: "",
  useful_area: "",
  wc: "",
  current_price: "",
  tags: [],
  lists: [],
  images: [],
  blueprints: [],
  videos: [],
  characteristics: [{ name: "", type: "numerical", value: "" }],
  full_address: "",
  postal_code: "",
  latitude: "",
  longitude: "",
  adm1_id: null,
  adm2_id: null,
  adm3_id: null,
  rating: 0,
};

export type FormSchemaType = z.infer<typeof schema>;

export function AddPropertyDrawer({ opened, close }: AddPropertyDrawerProps) {
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

  const { data: session } = useSession();

  const addPropertyButtonRef = useRef(null);

  const { offers, clearOffers } = useOffersStore();

  const { control, handleSubmit, reset, resetField } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const resetForm = () => {
    setAddPropertyCounter(0);
    reset(defaultValues);
    setStepperActive(0);
    setSelectedImages([]);
    setSelectedBlueprints([]);
    setSelectedVideos([]);
    clearOffers();
  };

  const addPropertyMutation = async (data: FormSchemaType) => {
    const formData = new FormData();

    function appendIfNotNull(key: string, value: unknown) {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value as string);
      }
    }

    appendIfNotNull("title", data.title);
    appendIfNotNull("description", data.description);
    appendIfNotNull("type", data.type);
    appendIfNotNull("typology", data.typology);
    appendIfNotNull("status", data.status);
    appendIfNotNull("gross_area", data.gross_area);
    appendIfNotNull("useful_area", data.useful_area);
    appendIfNotNull("wc", data.wc);
    appendIfNotNull("current_price", data.current_price);
    appendIfNotNull("rating", data.rating);
    appendIfNotNull("address[full_address]", data.full_address);
    appendIfNotNull("address[adm1_id]", data.adm1_id);
    appendIfNotNull("address[adm2_id]", data.adm2_id);
    appendIfNotNull("address[adm3_id]", data.adm3_id);
    appendIfNotNull("address[postal_code]", data.postal_code);
    appendIfNotNull("address[latitude]", data.latitude);
    appendIfNotNull("address[longitude]", data.longitude);

    data.tags.forEach((tag, index) => {
      appendIfNotNull(`tags[${index}]`, tag);
    });

    data.lists.forEach((list, index) => {
      appendIfNotNull(`lists[${index}]`, list);
    });

    data.images.forEach((image, index) => {
      appendIfNotNull(`media[images][${index}]`, image);
    });

    data.blueprints.forEach((blueprint, index) => {
      appendIfNotNull(`media[blueprints][${index}]`, blueprint);
    });

    data.videos.forEach((video, index) => {
      appendIfNotNull(`media[videos][${index}]`, video);
    });

    data.characteristics.forEach((characteristic, index) => {
      appendIfNotNull(`characteristics[${index}][name]`, characteristic.name);
      appendIfNotNull(`characteristics[${index}][type]`, characteristic.type);
      appendIfNotNull(`characteristics[${index}][value]`, characteristic.value);
    });

    offers.forEach((offer, index) => {
      appendIfNotNull(`offers[${index}][listing_type]`, offer.listing_type);
      appendIfNotNull(`offers[${index}][url]`, offer.url);
      appendIfNotNull(`offers[${index}][description]`, offer.description);
      appendIfNotNull(`offers[${index}][price]`, offer.price);
    });

    return makeRequest("me/properties", "POST", session?.user.access_token, formData) as Promise<PropertyResponse>;
  };

  const mutation = useMutation(addPropertyMutation);

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

      mutation.mutate(data, {
        onSuccess: () => {
          resetForm();
          close();
          notifications.show({
            title: "Property added",
            message: "Your property has been added successfully!",
            icon: <IconCheck size="1.1rem" />,
            color: "teal",
          });
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message: "An unknown error occurred while adding your property.",
            icon: <IconX size="1.1rem" />,
            color: "red",
          });
          console.error(error);
        },
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

                <Stepper.Step label="Characteristics">
                  <AddPropertyCharacteristics control={control} />
                </Stepper.Step>

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
                  <AddPropertyOffers />
                </Stepper.Step>

                <Stepper.Completed>
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
                  loading={mutation.isLoading}
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
