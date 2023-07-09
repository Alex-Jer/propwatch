import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useQueries";
import { Property } from "~/types";
import { CardsCarousel } from "~/components/CardsCarousel";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { type FunctionComponent, type SVGProps, useEffect, useState, useRef } from "react";
import { Apartment, House, Office, Shop, Warehouse, Garage, Default } from "public/icons";
import { MainCarousel } from "~/components/MainCarousel";
import { useDisclosure } from "@mantine/hooks";
import { Button, Drawer, Group, Rating, Title } from "@mantine/core";
import CardBackground from "~/components/CardBackground";
import { env } from "~/env.mjs";
import { IconPhoto, IconPhotoCheck, IconPhotoX, IconTrash, IconVideo, IconWallpaper } from "@tabler/icons-react";
import { makeRequest } from "~/lib/requestHelper";
import { errorNotification, successNotification } from "~/components/PropertyCard";
import { priceToString } from "~/lib/propertyHelper";
import { PropertyAccordion } from "~/components/PropertyAccordion";

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
  const { propertyId } = router.query;

  const { data: session, status } = useSession();
  const { data: property, isLoading, isError } = useProperty({ session, status, elementId: String(propertyId ?? "") });

  const [coverUrl, setCoverUrl] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(property?.cover_url);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imagesOpened, { open: openImages, close: closeImages }] = useDisclosure(false);
  const [videosOpened, { open: openVideos, close: closeVideos }] = useDisclosure(false);
  const [blueprintsOpened, { open: openBlueprints, close: closeBlueprints }] = useDisclosure(false);

  const [rating, setRating] = useState(0);

  const photos = property?.media?.photos;

  const [isCurrentCover, setIsCurrentCover] = useState(false);

  const hasSetRatingOnce = useRef(false);

  useEffect(() => {
    if (property?.rating && !hasSetRatingOnce.current) {
      setRating(property.rating / 2);
      hasSetRatingOnce.current = true;
    }
  }, [hasSetRatingOnce, property?.rating]);

  useEffect(() => {
    if (!isLoading && !isError && property) {
      if ((selectedUrl == "" || !selectedUrl) && photos && photos[0]) setSelectedUrl(photos[0].url);
      setIsCurrentCover(property?.cover_url != selectedUrl || !property?.cover_url);
      setCoverUrl(property.cover_url);
    }
  }, [isLoading, isError, property, selectedUrl, photos, isCurrentCover, setIsCurrentCover]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading property.</div>;
  }

  if (!photos) return <div>Error loading property.</div>;

  const videos = property?.media?.videos;
  const blueprints = property?.media?.blueprints;
  const coordinates = property?.address?.coordinates;

  const renderPrice = () => {
    switch (property.listing_type) {
      case "sale":
        return priceToString(property.current_price_sale);
      case "rent":
        return priceToString(property.current_price_rent);
      case "both":
        return `${priceToString(property.current_price_sale)} / ${priceToString(property.current_price_rent)}`;
      default:
        return "";
    }
  };

  const renderCover = () => {
    if (photos?.length == 0) return <div>Loading...</div>;
    return (
      <>
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3"> */}
        {/* <span onClick={open}> */}
        <MainCarousel images={photos} setSelectedUrl={setSelectedUrl} setPhotoIndex={setPhotoIndex} />
        {/* </span> */}
        {/* </div> */}
      </>
    );
  };

  const renderImageDrawer = () => {
    return (
      <Drawer opened={imagesOpened} onClose={closeImages} position="bottom" size="100%">
        <div className="flex h-screen items-center">
          <CardsCarousel data={photos} currentUrl={coverUrl} setCover={setCoverUrl} />
        </div>
      </Drawer>
    );
  };

  const renderVideoDrawer = () => {
    return (
      <Drawer opened={videosOpened} onClose={closeVideos} position="bottom" size="100%">
        <div className="flex h-screen items-center">
          <CardsCarousel data={videos} isImage={false} />
        </div>
      </Drawer>
    );
  };

  const renderBlueprintDrawer = () => {
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
      .catch(() => errorNotification("An error as occurred while rating this property."));
  };

  const renderHeader = (property: Property) => {
    return (
      <div className="mt-4">
        <div className="flex flex-wrap items-center">
          <Title className="mb-2" order={2}>
            {property?.title}
          </Title>
          <Rating className="ml-3" value={rating} onChange={handleRatingChange} fractions={2} />
        </div>
        <div className="mt-1">{property.description}</div>
      </div>
    );
  };

  const markerType = property?.type?.toLowerCase();
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
        };
        router.push("/properties").then(sendSuccess).catch(sendSuccess); //TODO: Should we redirect to trash?
      })
      .catch((err) => {
        errorNotification("An unknown error occurred while deleting this property.");
        //TODO
        console.log("Error: ", err, " when trashing property.");
      });
  };

  const coverButtonClick = () => {
    if (!property?.id) return;
    if (selectedUrl == "" || !selectedUrl) return;

    if (property.cover_url != selectedUrl) {
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

      <CardBackground className="pt-6 xl:mx-12 2xl:mx-48">
        {renderCover()}
        {renderImageDrawer()}
        {renderVideoDrawer()}
        {renderBlueprintDrawer()}
        {/* TODO: Test Button */}
        <Group position="left" className="mt-4">
          <Button.Group>
            <Button
              disabled={photos.length < 2} // If it only has a photo, it's the cover
              onClick={openImages}
              variant="light"
              leftIcon={<IconPhoto size="1rem" className="-mr-1" />}
            >
              Images
            </Button>
            <Button
              disabled={videos.length == 0}
              onClick={openVideos}
              variant="light"
              leftIcon={<IconVideo size="1rem" className="-mr-1" />}
            >
              Videos
            </Button>
            <Button
              disabled={blueprints.length == 0}
              onClick={openBlueprints}
              variant="light"
              leftIcon={<IconWallpaper size="1rem" className="-mr-1" />}
            >
              Blueprints
            </Button>
          </Button.Group>
          <Button
            disabled={selectedUrl == ""}
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
          <Button
            onClick={trashProperty}
            color="red"
            variant="light"
            leftIcon={<IconTrash size="1rem" className="-mr-1" />}
          >
            Delete
          </Button>
        </Group>
        {renderHeader(property)}
        <div className="-ml-6 -mr-6 mb-4  border-b border-shark-700 pb-4" />
        <PropertyAccordion property={property} />
        <div className="-ml-6 -mr-6 border-b border-shark-700 pb-4" />
        {coordinates && <>{renderMap()}</>}
      </CardBackground>
    </>
  );
};

export default Property;
