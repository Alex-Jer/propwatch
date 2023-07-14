import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Stepper, Paper } from "@mantine/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest, processAxiosError } from "~/lib/requestHelper";
import { useSession } from "next-auth/react";
import { type Property, type Offer, type SelectOption, type Media, type AxiosErrorResponse } from "~/types";
import {
  PropertyFormAddress,
  PropertyFormCharacteristics,
  PropertyFormMainInfo,
  PropertyFormMedia,
  PropertyFormOffers,
  type MediaItem,
} from "~/components/property";
import { useAdms, useAdms2, useAdms3, useAllCollections, useAllTags } from "~/hooks/useQueries";
import { useInputState } from "@mantine/hooks";
import { useRouter } from "next/router";
import { successNotification } from "../PropertyCard";

type PropertyType = "house" | "apartment" | "office" | "shop" | "warehouse" | "garage" | "land" | "other";
type PropertyStatus = "available" | "unavailable" | "unknown";

const TOTAL_STEPS = 5;

const schema = z.object({
  title: z
    .string()
    .nonempty({ message: "A title is required" })
    .min(5, { message: "Title must be at least 5 characters long" }),
  description: z
    .string()
    .max(5000, { message: "Description must be at most 5000 characters long" })
    .optional()
    .nullable(),
  type: z.enum(["house", "apartment", "office", "shop", "warehouse", "garage", "land", "other"]).optional().nullable(),
  typology: z.string().max(12, { message: "Typology must be at most 12 characters long" }).optional().nullable(),
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
  tags: z.array(z.string().max(32, { message: "Tag must be at most 32 characters long" })),
  lists: z.array(z.string()),
  images: z.array(z.any()),
  blueprints: z.array(z.any()),
  videos: z.array(z.any()),
  characteristics: z.array(
    z
      .object({
        name: z.string().max(30, { message: "Characteristic name must be at most 30 characters long" }),
        type: z.enum(["numerical", "textual"]),
        value: z.string().max(200, { message: "Characteristic value must be at most 200 characters long" }),
      })
      .optional()
      .nullable()
  ),
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
    .refine((value) => value === "" || /^[0-9-]*$/.test(value), {
      message: "Postal Code can only contain numbers and dashes",
    })
    .optional()
    .nullable(),
  coordinates: z.string().optional().nullable(),
  adm1_id: z.string().optional().nullable(),
  adm2_id: z.string().optional().nullable(),
  adm3_id: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
});

export type FormSchemaType = z.infer<typeof schema>;

interface PropertyFormProps {
  property?: Partial<Property>;
  close?: () => void;
  mode?: "add" | "edit";
}

export function PropertyForm({ property = {}, close, mode = "add" }: PropertyFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [stepperActive, setStepperActive] = useState(0);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedBlueprints, setSelectedBlueprints] = useState<any[]>([]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [media, setMedia] = useState<Media>(property.media || { photos: [], blueprints: [], videos: [] });
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem[]>([]);
  const [offersToDelete, setOffersToDelete] = useState<Offer[]>([]);

  const [tags, setTags] = useState<SelectOption[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [countAdmFetches, setCountAdmFetches] = useState(0);

  useEffect(() => {
    if (property.offers && mode === "edit") {
      setOffers(
        property.offers.rent
          .map((offer) => ({ ...offer, listing_type: "rent" }))
          .concat(property.offers.sale.map((offer) => ({ ...offer, listing_type: "sale" })))
      );
    }
  }, [property.offers, mode]);

  const { data: tagsData, isLoading: tagsLoading, isSuccess: isTagsSuccess } = useAllTags({ session, status });
  const {
    data: collectionsData,
    isLoading: collectionsLoading,
    isSuccess: isCollectionsSuccess,
  } = useAllCollections({ session, status });

  let collections = [] as SelectOption[];

  const { data: adm1Data, isLoading: adm1IsLoading, isSuccess: isAdm1Success } = useAdms({ session, status });

  const [selectedAdm1, setSelectedAdm1] = useInputState("");

  useEffect(() => {
    if (isAdm1Success && adm1Data) {
      setSelectedAdm1(property?.address?.adm1_id?.toString());
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isAdm1Success, adm1Data]);

  const {
    data: adm2Data,
    isLoading: adm2IsLoading,
    isSuccess: isAdm2Success,
  } = useAdms2({
    session,
    status,
    parentId: selectedAdm1 ? selectedAdm1 : "1",
  });

  const [selectedAdm2, setSelectedAdm2] = useInputState("");

  useEffect(() => {
    if (isAdm2Success && adm2Data) {
      setSelectedAdm2(property?.address?.adm2_id?.toString());
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isAdm2Success, adm2Data]);

  const {
    data: adm3Data,
    isLoading: adm3IsLoading,
    isSuccess: isAdm3Success,
  } = useAdms3({
    session,
    status,
    parentId: selectedAdm2 ? selectedAdm2 : "2",
  });

  useEffect(() => {
    if (tagsData) {
      setTags(tagsData.map((tag) => ({ value: tag.name, label: tag.name })));
    }
  }, [tagsData]);

  if (collectionsData) {
    collections = collectionsData.data.map((collection) => ({
      value: collection.id.toString(),
      label: collection.name,
    }));
  }

  const defaultValues: FormSchemaType = {
    title: property.title || "",
    description: property.description || "",
    type: (property.type as PropertyType) || null,
    typology: property.typology || "",
    status: (property.status as PropertyStatus) || null,
    gross_area: property.gross_area ? parseInt(property.gross_area) : "",
    useful_area: property.useful_area ? parseInt(property.useful_area) : "",
    wc: property.wc || "",
    tags: [],
    lists: [],
    images: [],
    blueprints: [],
    videos: [],
    characteristics: property.characteristics
      ? property.characteristics.map((characteristic) => ({
          ...characteristic,
          id: undefined,
        }))
      : [{ name: "", type: "numerical", value: "" }],
    full_address: property.address?.full_address || "",
    postal_code: property.address?.postal_code || "",
    coordinates:
      property.address?.coordinates?.latitude && property.address?.coordinates?.longitude
        ? `${property.address.coordinates.latitude},${property.address.coordinates.longitude}`
        : "",
    adm1_id: null,
    adm2_id: null,
    adm3_id: null,
    rating: (property.rating && property.rating / 2) || null,
  };

  const { control, handleSubmit, reset, resetField, watch, trigger, setFocus, setValue } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep < 0 || nextStep > TOTAL_STEPS;
    if (isOutOfBounds) return;
    setStepperActive(nextStep);

    if (nextStep === 1) {
      setFocus("full_address");
    }
  };

  const resetForm = () => {
    setStepperActive(0);
    setSelectedImages([]);
    setSelectedBlueprints([]);
    setSelectedVideos([]);
    setOffers([]);
    reset();
  };

  const addProperty = async (data: FormSchemaType) => {
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
    appendIfNotNull("rating", data.rating ? data.rating * 2 : 0);
    appendIfNotNull("address[full_address]", data.full_address);
    appendIfNotNull("address[adm1_id]", data.adm1_id);
    appendIfNotNull("address[adm2_id]", data.adm2_id);
    appendIfNotNull("address[adm3_id]", data.adm3_id);
    appendIfNotNull("address[postal_code]", data.postal_code);

    if (data.coordinates) {
      const [latitude, longitude] = data.coordinates.split(",");
      appendIfNotNull("address[latitude]", latitude);
      appendIfNotNull("address[longitude]", longitude);
    }

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
      if (characteristic?.name === "" || characteristic?.value === "") {
        return;
      }

      appendIfNotNull(`characteristics[${index}][name]`, characteristic?.name);
      appendIfNotNull(`characteristics[${index}][type]`, characteristic?.type);
      appendIfNotNull(`characteristics[${index}][value]`, characteristic?.value);
    });

    offers.forEach((offer, index) => {
      appendIfNotNull(`offers[${index}][listing_type]`, offer.listing_type);
      appendIfNotNull(`offers[${index}][url]`, offer.url);
      appendIfNotNull(`offers[${index}][description]`, offer.description);
      appendIfNotNull(`offers[${index}][price]`, offer.price);
    });

    return makeRequest("me/properties", "POST", session?.user.access_token, formData, true, false);
  };

  const editProperty = async (data: FormSchemaType) => {
    if (!property.id) return;

    const formData = new FormData();

    function append(key: string, value: unknown) {
      if (value === null || value === undefined || value === "") {
        formData.append(key, "");
      } else if (Array.isArray(value)) {
        value.forEach((element) => {
          formData.append(key, element as string);
        });
      } else {
        formData.append(key, value as string);
      }
    }

    append("title", data.title);
    append("description", data?.description);
    append("type", data?.type);
    append("typology", data?.typology);
    append("status", data?.status);
    append("gross_area", data?.gross_area);
    append("useful_area", data?.useful_area);
    append("wc", data?.wc);
    append("rating", data.rating ? data.rating * 2 : 0);
    append("address[full_address]", data.full_address);
    append("address[adm1_id]", data.adm1_id);
    append("address[adm2_id]", data.adm2_id);
    append("address[adm3_id]", data.adm3_id);
    append("address[postal_code]", data.postal_code);

    if (data.coordinates) {
      const [latitude, longitude] = data.coordinates.split(",");
      append("address[latitude]", latitude);
      append("address[longitude]", longitude);
    }

    data.tags.forEach((tag, index) => {
      append(`tags[${index}]`, tag);
    });

    data.lists.forEach((list, index) => {
      append(`lists[${index}]`, list);
    });

    data.images.forEach((image, index) => {
      append(`media[images][${index}]`, image);
    });

    data.blueprints.forEach((blueprint, index) => {
      append(`media[blueprints][${index}]`, blueprint);
    });

    data.videos.forEach((video, index) => {
      append(`media[videos][${index}]`, video);
    });

    data.characteristics.forEach((characteristic, index) => {
      if (characteristic?.name === "" || characteristic?.value === "") {
        return;
      }

      append(`characteristics[${index}][name]`, characteristic?.name);
      append(`characteristics[${index}][type]`, characteristic?.type);
      append(`characteristics[${index}][value]`, characteristic?.value);
    });

    offers.forEach((offer, index) => {
      if (typeof offer.id !== "string") {
        append(`offers[${index}][id]`, offer.id);
      }
      append(`offers[${index}][listing_type]`, offer.listing_type);
      append(`offers[${index}][url]`, offer.url);
      append(`offers[${index}][description]`, offer.description);
      append(`offers[${index}][price]`, offer.price);
    });

    offersToDelete.forEach((offer, index) => {
      if (typeof offer.id !== "string") {
        append(`offers_remove[${index}]`, offer.id);
      }
    });

    mediaToDelete.forEach((media, index) => {
      append(`media[remove][${index}]`, media.id);
    });

    return makeRequest(`me/properties/${property.id}`, "PUT", session?.user.access_token, formData, true, false);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: mode === "add" ? addProperty : editProperty,
    onSuccess: () => {
      close && close();
      successNotification(
        mode === "add" ? "Your property was added successfully" : "Your property was edited successfully",
        mode === "add" ? "Property added" : "Property edited"
      );

      void queryClient.invalidateQueries({ queryKey: ["properties"] });
      void queryClient.invalidateQueries({ queryKey: ["tagsSidebar"] });
      void queryClient.invalidateQueries({ queryKey: ["tagsManage"] });
      void queryClient.invalidateQueries({ queryKey: ["collectionsSidebar"] });

      if (mode === "edit" && property.id) {
        void router.push(`/properties/${property.id}`);
      }
    },
    onError: (error: AxiosErrorResponse) => {
      if (mode == "add") processAxiosError(error, "An error occurred while adding your property");
      else processAxiosError(error, "An error occurred while editing your property");
    },
  });

  useEffect(() => {
    if (isTagsSuccess && isCollectionsSuccess && Object.keys(property).length > 0) {
      const tags = property.tags?.map((tag) => tag.name);
      const collections = property.lists?.map((list) => list.id.toString());
      tags && setValue("tags", tags);
      collections && setValue("lists", collections);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isTagsSuccess, isCollectionsSuccess, property]);

  useEffect(() => {
    if (isAdm1Success && isAdm2Success && isAdm3Success && Object.keys(property).length > 0 && countAdmFetches === 0) {
      const adm1 = property.address?.adm1_id;
      const adm2 = property.address?.adm2_id;
      const adm3 = property.address?.adm3_id;
      setValue("adm1_id", adm1?.toString());
      setValue("adm2_id", adm2?.toString());
      setValue("adm3_id", adm3?.toString());
      setCountAdmFetches(countAdmFetches + 1);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isAdm1Success, isAdm2Success, isAdm3Success, property]);

  return (
    <>
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 gap-6">
          <form
            /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
            onSubmit={handleSubmit((data) =>
              mutate(data, {
                onSuccess: () => resetForm(),
              })
            )}
          >
            <Stepper active={stepperActive} onStepClick={setStepperActive} breakpoint="sm">
              <Stepper.Step label="Main Info">
                <PropertyFormMainInfo
                  tags={tags}
                  setTags={setTags}
                  collections={collections}
                  tagsLoading={tagsLoading}
                  collectionsLoading={collectionsLoading}
                  control={control}
                  resetField={resetField}
                  setValue={setValue}
                  defaultValues={defaultValues}
                />
              </Stepper.Step>

              <Stepper.Step label="Address">
                <PropertyFormAddress
                  adm1Data={adm1Data}
                  adm2Data={adm2Data}
                  adm3Data={adm3Data}
                  adm1IsLoading={adm1IsLoading}
                  adm2IsLoading={adm2IsLoading}
                  adm3IsLoading={adm3IsLoading}
                  selectedAdm1={selectedAdm1}
                  selectedAdm2={selectedAdm2}
                  setSelectedAdm1={setSelectedAdm1}
                  setSelectedAdm2={setSelectedAdm2}
                  control={control}
                  resetField={resetField}
                />
              </Stepper.Step>

              <Stepper.Step label="Characteristics">
                <PropertyFormCharacteristics control={control} watch={watch} mode={mode} />
              </Stepper.Step>

              <Stepper.Step label="Media">
                <PropertyFormMedia
                  control={control}
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  selectedBlueprints={selectedBlueprints}
                  setSelectedBlueprints={setSelectedBlueprints}
                  selectedVideos={selectedVideos}
                  setSelectedVideos={setSelectedVideos}
                  media={media}
                  setMedia={setMedia}
                  mediaToDelete={mediaToDelete}
                  setMediaToDelete={setMediaToDelete}
                />
              </Stepper.Step>

              <Stepper.Step label="Offers">
                <PropertyFormOffers
                  offers={offers}
                  setOffers={setOffers}
                  offersToDelete={offersToDelete}
                  setOffersToDelete={setOffersToDelete}
                  mode={mode}
                />
              </Stepper.Step>

              <Stepper.Step label="Summary">
                <h1 className="mb-2 text-2xl font-semibold">Summary</h1>
                <Paper className="mb-4" shadow="xs" p="md" withBorder>
                  <PropertyFormMainInfo
                    tags={tags}
                    setTags={setTags}
                    collections={collections}
                    tagsLoading={tagsLoading}
                    collectionsLoading={collectionsLoading}
                    control={control}
                    trigger={trigger}
                  />
                  <PropertyFormAddress
                    adm1Data={adm1Data}
                    adm2Data={adm2Data}
                    adm3Data={adm3Data}
                    adm1IsLoading={adm1IsLoading}
                    adm2IsLoading={adm2IsLoading}
                    adm3IsLoading={adm3IsLoading}
                    selectedAdm1={selectedAdm1}
                    selectedAdm2={selectedAdm2}
                    setSelectedAdm1={setSelectedAdm1}
                    setSelectedAdm2={setSelectedAdm2}
                    control={control}
                    trigger={trigger}
                    resetField={resetField}
                  />
                </Paper>
              </Stepper.Step>
            </Stepper>

            <div className="flex justify-end space-x-2">
              <Button
                variant="default"
                onClick={() => handleStepChange(stepperActive - 1)}
                disabled={stepperActive === 0}
              >
                Back
              </Button>
              <Button onClick={() => handleStepChange(stepperActive + 1)} disabled={stepperActive === TOTAL_STEPS}>
                Next
              </Button>
              <Button type="submit" loading={isLoading} disabled={stepperActive !== TOTAL_STEPS && mode === "add"}>
                {mode === "add" ? "Add Property" : "Update Property"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
