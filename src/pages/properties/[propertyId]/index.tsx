import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useQueries";
import { Property } from "~/types";
import { CardsCarousel } from "~/components/CardsCarousel";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { type FunctionComponent, type SVGProps, useEffect, useState, useRef, useContext } from "react";
import { Apartment, House, Office, Shop, Warehouse, Garage, Default } from "public/icons";
import { MainCarousel } from "~/components/MainCarousel";
import { useDisclosure } from "@mantine/hooks";
import {
  Badge,
  Button,
  Card,
  createStyles,
  Drawer,
  Group,
  Rating,
  Skeleton,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import CardBackground from "~/components/CardBackground";
import { env } from "~/env.mjs";
import {
  IconCalendarDollar,
  IconEdit,
  IconHomeDollar,
  IconPhoto,
  IconPhotoCheck,
  IconPhotoX,
  IconTrash,
  IconVideo,
  IconWallpaper,
} from "@tabler/icons-react";
import { makeRequest } from "~/lib/requestHelper";
import { errorNotification, successNotification } from "~/components/PropertyCard";
import { priceToString } from "~/lib/propertyHelper";
import { PropertyAccordion } from "~/components/PropertyAccordion";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import Link from "next/link";
import { PropertiesContext } from "~/lib/PropertiesProvider";

type MarkerIconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

const markerIcons: { [key: string]: MarkerIconComponent } = {
  house: House,
  apartment: Apartment,
  office: Office,
  shop: Shop,
  warehouse: Warehouse,
  garage: Garage,
  default: Default,
};

const Property: NextPage = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const { data: session, status } = useSession();

  const { propertyId } = router.query;
  const { data: property, isLoading, isError } = useProperty({ session, status, elementId: String(propertyId ?? "") });
  const { refetch } = useContext(PropertiesContext);

  const [coverUrl, setCoverUrl] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(property?.cover_url);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [isCurrentCover, setIsCurrentCover] = useState(false);
  const hasSetRatingOnce = useRef(false);

  const [imagesOpened, { open: openImages, close: closeImages }] = useDisclosure(false);
  const [videosOpened, { open: openVideos, close: closeVideos }] = useDisclosure(false);
  const [blueprintsOpened, { open: openBlueprints, close: closeBlueprints }] = useDisclosure(false);
  const [delConfirmOpened, { open: delConfirmOpen, close: delConfirmClose }] = useDisclosure(false);

  const photos = property?.media?.photos;

  useEffect(() => {
    if (property?.rating && !hasSetRatingOnce.current) {
      setRating(property?.rating / 2);
      hasSetRatingOnce.current = true;
    }
  }, [hasSetRatingOnce, property?.rating]);

  useEffect(() => {
    if (!isLoading && !isError && property) {
      if ((selectedUrl == "" || !selectedUrl) && photos && photos[0]) setSelectedUrl(photos[0].url);
      setIsCurrentCover(property?.cover_url != selectedUrl || !property?.cover_url);
      setCoverUrl(property?.cover_url);
    }
  }, [isLoading, isError, property, selectedUrl, photos, isCurrentCover, setIsCurrentCover]);

  useEffect(() => {
    if (isError) {
      errorNotification("Error", "There was an error loading the property...");
    }
  }, [isError]);

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Text size="lg" weight={500} className="mb-4">
          There was an error loading the property...
        </Text>
      </div>
    );
  }

  const videos = property?.media?.videos;
  const blueprints = property?.media?.blueprints;
  const coordinates = property?.address?.coordinates;

  const renderPrice = () => {
    if (!property || isLoading || (!property.current_price_sale && !property.current_price_rent)) return "";

    switch (property?.listing_type) {
      case "sale":
        return (
          <>
            <IconHomeDollar size="1.5rem" stroke={1.5} className="-mr-3" />
            <Title order={3} style={{ fontWeight: "normal" }}>
              {priceToString(property?.current_price_sale)}
            </Title>
          </>
        );
      case "rent":
        return (
          <>
            <IconCalendarDollar size="1.5rem" stroke={1.5} className="-mr-3" />
            <Title order={3} style={{ fontWeight: "normal" }}>
              {priceToString(property?.current_price_rent)}
            </Title>
            <Text size="sm" className="-ml-4">
              /month
            </Text>
          </>
        );
      case "both":
        return (
          <>
            <IconCalendarDollar size="1.5rem" stroke={1.5} className="-mr-3" />
            <Title order={3} style={{ fontWeight: "normal" }}>
              {priceToString(property?.current_price_rent)}
            </Title>
            <Text size="sm" className="-ml-4">
              /month
            </Text>
            <IconHomeDollar size="1.5rem" stroke={1.5} className="-mr-3" />
            <Title order={3} style={{ fontWeight: "normal" }}>
              {priceToString(property?.current_price_sale)}
            </Title>
          </>
        );
      default:
        return "";
    }
  };

  const renderCover = () => {
    if (isLoading) {
      return (
        <Card radius="md" withBorder p={0} className={classes.card}>
          <Skeleton radius="md" height="440" />
        </Card>
      );
    }

    if (photos?.length == 0 || photos == undefined)
      return (
        <Card radius="md" withBorder p={0} className={classes.card}>
          <div className={`flex items-center justify-center ${classes.placeholder}`}>
            <span>No images added</span>
          </div>
        </Card>
      );
    return (
      <>
        <MainCarousel images={photos} setSelectedUrl={setSelectedUrl} setPhotoIndex={setPhotoIndex} />
      </>
    );
  };

  const renderImageDrawer = () => {
    if (!photos) return null;
    return (
      <Drawer opened={imagesOpened} onClose={closeImages} position="bottom" size="100%">
        <div className="flex h-screen items-center">
          <CardsCarousel data={photos} currentUrl={coverUrl} setCover={setCoverUrl} />
        </div>
      </Drawer>
    );
  };

  const renderVideoDrawer = () => {
    if (!videos) return null;
    return (
      <Drawer opened={videosOpened} onClose={closeVideos} position="bottom" size="100%">
        <div className="flex h-screen items-center">
          <CardsCarousel data={videos} isImage={false} />
        </div>
      </Drawer>
    );
  };

  const renderBlueprintDrawer = () => {
    if (!blueprints) return null;
    return (
      <Drawer opened={blueprintsOpened} onClose={closeBlueprints} position="bottom" size="100%">
        <div className="flex h-screen items-center">
          <CardsCarousel data={blueprints} />
        </div>
      </Drawer>
    );
  };

  const handleRatingChange = (value: number) => {
    if (!property?.id) return;
    if (value == rating) value = 0;
    const formData = new FormData();
    formData.append("rating", (value * 2).toString());
    makeRequest(`me/properties/${property.id}/rating`, "PATCH", session?.user.access_token, formData)
      .then(() => {
        setRating(value);
        property.rating = value * 2;
      })
      .catch(() => errorNotification("An error has occurred while rating this property."));
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge color="green" variant="filled" className="mb-2 mr-2">
            Available
          </Badge>
        );
      case "unavailable":
        return (
          <Badge color="red" variant="filled" className="mb-2 mr-2">
            Unavailable
          </Badge>
        );
      case "unknown":
      default:
        return (
          <Badge color="gray" variant="filled" className="mb-2 mr-2">
            Unknown Status
          </Badge>
        );
    }
  };

  const renderHeader = (property: Property) => {
    return (
      <div className="mt-4">
        <div className="flex flex-wrap items-center">
          {!isLoading ? (
            <>
              <Title className="mb-2" order={2}>
                {property?.title}
              </Title>
              <Rating className="ml-3 mt-1" value={rating} onChange={handleRatingChange} fractions={2} />
            </>
          ) : (
            <Skeleton width="70%" height="2.1rem" className="mb-px" />
          )}
        </div>

        {!isLoading ? (
          <div className="mt-1">{property?.description}</div>
        ) : (
          <Skeleton width="100%" height="2.5rem" className="mb-px mt-2" />
        )}

        <Group noWrap spacing="xs" className="mt-2">
          {!isLoading ? (
            <Text size="xs" color="dimmed">
              <Tooltip color="gray" label="Property Availability Status" position="bottom" withArrow>
                {renderStatus(property?.status)}
              </Tooltip>
              {property?.tags?.map((tag) => (
                <Badge key={tag.id} color="blue" variant="light" className="mb-2 mr-2">
                  #{tag.name}
                </Badge>
              ))}
            </Text>
          ) : (
            <>
              <Skeleton width="10%" height="1.3rem" className="mb-px" radius="xl" />
              <Skeleton width="10%" height="1.3rem" className="mb-px" radius="xl" />
              <Skeleton width="10%" height="1.3rem" className="mb-px" radius="xl" />
            </>
          )}
        </Group>
      </div>
    );
  };

  const markerType = property?.type?.toLowerCase() || "default";
  const MarkerIcon = (markerIcons[markerType] as MarkerIconComponent) || markerIcons.default;

  const onMarkerClick = () => {
    if (coordinates?.latitude && coordinates?.longitude)
      navigator.clipboard
        .writeText(`${coordinates?.latitude}, ${coordinates?.longitude}`)
        .then(() => successNotification("The coordinates have been copied to your clipboard.", "Coordinates copied"))
        .catch(null);
  };

  const renderMap = () => {
    if (coordinates == null) return <></>;
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;

    return (
      <>
        <div className="mt-5 h-3/6 w-auto">
          {!isLoading ? (
            <Map
              mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              initialViewState={{
                longitude,
                latitude,
                zoom: 15,
              }}
              style={{ width: "100%", height: "400px", borderRadius: "12px" }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
            >
              <Marker onClick={onMarkerClick} longitude={longitude} latitude={latitude}>
                <MarkerIcon className="h-8" />
              </Marker>
            </Map>
          ) : (
            <Skeleton width="100%" height="400px" className="mb-px mt-2" />
          )}
        </div>
      </>
    );
  };

  const trashProperty = () => {
    if (!property?.id) return;
    makeRequest(`me/properties/${property.id}`, "DELETE", session?.user.access_token)
      .then(() => {
        const sendSuccess = () => {
          successNotification("This property has been sent to trash!", "Property deleted");
          void refetch();
        };
        router.push("/properties").then(sendSuccess).catch(sendSuccess);
      })
      .catch(() => {
        errorNotification("An unknown error occurred while trying to delete this property.");
      });
  };

  const coverButtonClick = () => {
    if (!property?.id) return;
    if (selectedUrl == "" || !selectedUrl) return;

    if (property?.cover_url !== selectedUrl) {
      const formData = new FormData();
      const newCover = selectedUrl;
      formData.append("index", photoIndex.toString());
      makeRequest(`me/properties/${property.id}/cover`, "PATCH", session?.user.access_token, formData)
        .then(() => {
          property.cover_url = newCover;
          setIsCurrentCover(property?.cover_url != selectedUrl || !property?.cover_url); //HACK: useEffect wasn't enough for some reason
          successNotification("The property's cover was set to the current image.", "Cover set");
        })
        .catch(() => errorNotification("An unknown error occurred while setting this property's cover."));
    } else {
      makeRequest(`me/properties/${property.id}/cover`, "DELETE", session?.user.access_token)
        .then(() => {
          property.cover_url = "NULL"; //HACK: Ideally this would be null
          setIsCurrentCover(property?.cover_url != selectedUrl || !property?.cover_url); //HACK: useEffect wasn't enough for some reason
          successNotification("The property's cover has been removed.", "Cover removed");
        })
        .catch(() => errorNotification("An unknown error occurred while removing this property's cover."));
    }
  };

  return (
    <>
      <Head>
        <title>{property?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConfirmationModal
        opened={delConfirmOpened}
        close={delConfirmClose}
        yesFunction={trashProperty}
        title="Trash property"
        text="Are you sure you want to send this property to the trash?"
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />

      <CardBackground className="pt-6 xl:mx-12 2xl:mx-48">
        {renderCover()}
        {renderImageDrawer()}
        {renderVideoDrawer()}
        {renderBlueprintDrawer()}
        <Group position="left" className="mt-4">
          <Button.Group>
            <Button
              disabled={isLoading || (photos && photos.length < 2)} // If it only has a photo, it's the cover
              onClick={openImages}
              variant="light"
              leftIcon={<IconPhoto size="1rem" className="-mr-1" />}
            >
              Images
            </Button>
            <Button
              disabled={isLoading || (videos && videos.length == 0)}
              onClick={openVideos}
              variant="light"
              leftIcon={<IconVideo size="1rem" className="-mr-1" />}
            >
              Videos
            </Button>
            <Button
              disabled={isLoading || (blueprints && blueprints.length == 0)}
              onClick={openBlueprints}
              variant="light"
              leftIcon={<IconWallpaper size="1rem" className="-mr-1" />}
            >
              Blueprints
            </Button>
          </Button.Group>
          <Button
            disabled={isLoading || selectedUrl == "" || property?.media?.photos?.length == 0}
            color="yellow"
            variant="default"
            onClick={coverButtonClick}
            leftIcon={
              isCurrentCover ? (
                <IconPhotoCheck size="1rem" className="-mb-0.5 -mr-1" />
              ) : (
                <IconPhotoX size="1rem" className="-mb-0.5 -mr-1" />
              )
            }
          >
            {isCurrentCover ? "Set as cover" : "Remove cover"}
          </Button>
          <Button.Group>
            <Button
              onClick={() => {
                if (!property?.id) return;
                void router.push(`/properties/${property.id}/edit`);
              }}
              color="yellow"
              variant="light"
              leftIcon={<IconEdit size="1rem" className="-mr-1" />}
              disabled={isLoading}
            >
              {!property?.id ? "Edit" : <Link href={`/properties/${property?.id}/edit`}>Edit</Link>}
            </Button>
            <Button
              onClick={delConfirmOpen}
              color="red"
              variant="light"
              leftIcon={<IconTrash size="1rem" className="-mr-1" />}
              disabled={isLoading}
            >
              Trash
            </Button>
          </Button.Group>
          <div style={{ flex: 1 }}></div>
          <Group>{renderPrice()}</Group>
        </Group>
        {property && renderHeader(property)}
        <div className="-ml-6 -mr-6 -mt-2 mb-4 border-b border-shark-700 pb-4" />
        <PropertyAccordion property={property} isLoading={isLoading} />
        {coordinates?.longitude && coordinates?.latitude && (
          <>
            <div className="-ml-6 -mr-6 border-b border-shark-700 pb-4" />
            {renderMap()}
          </>
        )}
      </CardBackground>
    </>
  );
};

export default Property;

const useStyles = createStyles((theme) => ({
  card: {
    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },

    [theme.fn.largerThan("md")]: {
      width: "calc(100% - 1px)",
      height: "440px",
    },
  },

  placeholder: {
    backgroundColor: theme.colors.dark[7],
    borderRadius: theme.radius.md,
    height: "100%",

    "& span": {
      color: theme.colors.dark[3],
      fontWeight: 600,
    },
  },
}));
