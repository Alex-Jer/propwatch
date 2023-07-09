import { Group, Text, Accordion, ActionIcon } from "@mantine/core";
import {
  IconChartInfographic,
  IconChartLine,
  IconLink,
  IconListDetails,
  IconMapPin,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { useEffect, type ReactNode, useState } from "react";
import { sortBy } from "remeda";
import { completeAddress, numberToString, priceToString, propertyDetailsResume, ucfirst } from "~/lib/propertyHelper";
import { type Offer, type Property } from "~/types";
import { ConfirmationModal } from "./ConfirmationModal";
import { useDisclosure } from "@mantine/hooks";
import { makeRequest } from "~/lib/requestHelper";
import { errorNotification, successNotification } from "./PropertyCard";
import { useSession } from "next-auth/react";

interface AccordionLabelProps {
  label: string;
  icon: React.ElementType;
  description: string;
}

function AccordionLabel({ label, icon: Icon, description }: AccordionLabelProps) {
  return (
    <Group noWrap>
      <Icon size="2rem" stroke="1.5" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" color="dimmed" weight={400}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

export type AccordionItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  content: string | ReactNode;
  open?: boolean;
};

function LabelAndValue({ label, value }: { label: string; value: string | undefined }) {
  return value ? (
    <div>
      <Text>{label}</Text>
      <Text size="sm" color="dimmed" weight={400}>
        {value ?? "N/A"}
      </Text>
    </div>
  ) : (
    <></>
  );
}

export function PropertyAccordion({ property }: { property: Property }) {
  const [offersSortStatus, setOffersSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });

  const [modalOpened, { open, close }] = useDisclosure(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offerRecords, setOfferRecords] = useState<Offer[]>([]);
  const { data: session } = useSession();

  const sortOffers = (sortStatus: DataTableSortStatus) => {
    // @ts-expect-error sortBy is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const sortedOffers = sortBy(offerRecords, (offer) => offer[sortStatus.columnAccessor]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sortedData = sortStatus.direction === "asc" ? sortedOffers : [...sortedOffers].reverse();
    setOfferRecords(sortedData);
  };

  useEffect(() => {
    sortOffers(offersSortStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offersSortStatus]);

  useEffect(() => {
    const offers = [
      ...property.offers.sale.map((offer) => ({
        ...offer,
        price_str: offer.price ? priceToString(offer.price) : "N/A",
        description: offer.description ? offer.description : "N/A",
        listing_type: "sale",
      })),
      ...property.offers.rent.map((offer) => ({
        ...offer,
        price_str: offer.price ? priceToString(offer.price) + "/month" : "N/A",
        description: offer.description ? offer.description : "N/A",
        listing_type: "rent",
      })),
    ];

    setOfferRecords(offers);
  }, [property.offers.sale, property.offers.rent, setOfferRecords]);

  const offerTableColumns = [
    {
      accessor: "listing_type",
      title: "Listing Type",
      width: 50,
      sortable: true,
      cellsClassName: "capitalize",
    },
    {
      accessor: "price_str",
      title: "Price (€)",
      width: 75,
      sortable: true,
    },
    {
      accessor: "description",
      title: "Designation",
      width: 200,
      ellipsis: true,
      sortable: true,
    },
    {
      accessor: "actions",
      title: "URL",
      width: 35,
      render: (offer: Offer) => (
        <>
          <div className="flex flex-row items-center">
            <ActionIcon onClick={() => window.open(offer.url, "_blank")}>
              <IconLink size={16} />
            </ActionIcon>
            <ActionIcon
              color="red"
              onClick={() => {
                setSelectedOffer(offer);
                open();
              }}
            >
              <IconX size={16} />
            </ActionIcon>
          </div>
        </>
      ),
    },
  ];

  const convertCharacteristicValue = (value: string, type: string) => {
    switch (type) {
      case "numerical":
        const numberValue = Number(value);
        if (Number.isNaN(numberValue)) return value;
        return numberToString(numberValue);
      case "textual":
      case "other":
      default:
        return value;
        break;
    }
  };
  const renderCharacteristics = () => {
    return property.characteristics?.map((characteristic) => {
      return (
        <LabelAndValue
          key={characteristic.id}
          label={ucfirst(characteristic.name)}
          value={convertCharacteristicValue(characteristic.value, characteristic.type) ?? "N/A"}
        />
      );
    });
  };

  const generateOffersDescription = (property: Property) => {
    switch (property.listing_type) {
      case "sale":
        return `View ${property.offers.sale.length} sale offers`;
      case "rent":
        return `View ${property.offers.rent.length} rent offers`;
      case "both":
        return `View ${property.offers.sale.length} sale offers and ${property.offers.rent.length} rent offers`;
      case "none":
      default:
        return "This property has no offers";
    }
  };

  const itemList: AccordionItem[] = [
    {
      id: "details",
      icon: IconListDetails,
      label: "Property Details",
      description: propertyDetailsResume(property),
      content: (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gridGap: "2rem" }}>
            <LabelAndValue label="Type" value={ucfirst(property.type?.toString())} />
            <LabelAndValue label="Typology" value={property.typology?.toString()} />
            <LabelAndValue label="Bathrooms" value={property.wc?.toString()} />
            {property.gross_area && (
              <LabelAndValue label="Gross Area" value={numberToString(property.gross_area) + " m²"} />
            )}
            {property.useful_area && (
              <LabelAndValue label="Net Area" value={numberToString(property.useful_area) + " m²"} />
            )}
            {/* TODO: should go to another category?? */}
            {renderCharacteristics()}
          </div>
        </>
      ),
      open: true,
    },
    {
      id: "offers",
      icon: IconChartLine,
      label: "Offers",
      description: generateOffersDescription(property),
      content: (
        <>
          <DataTable
            withBorder={false}
            borderRadius="md"
            columns={offerTableColumns}
            records={offerRecords}
            sortStatus={offersSortStatus}
            onSortStatusChange={setOffersSortStatus}
          />
        </>
      ),
    },
    {
      id: "offers_history",
      icon: IconChartInfographic,
      label: "Offers' History",
      description: "Lorem ipsum",
      content: <>Lorem ipsum</>,
    },
    {
      id: "address",
      icon: IconMapPin,
      label: "Address",
      description: completeAddress(property.address),
      content: (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gridGap: "2rem" }}>
            {/* TODO: MANTER ESTA ORDEM?? */}
            <LabelAndValue label="District" value={property.address.adm1?.toString()} />
            <LabelAndValue label="Municipality" value={property.address.adm2?.toString()} />
            <LabelAndValue label="Parish" value={property.address.adm3?.toString()} />
            <LabelAndValue label="Postal Code" value={property.address.postal_code?.toString()} />
            <LabelAndValue label="Street Address" value={property.address.full_address?.toString()} />
            <LabelAndValue label="Latitude" value={property.address.coordinates?.latitude?.toString()} />
            <LabelAndValue label="Longitude" value={property.address.coordinates?.longitude?.toString()} />
          </div>
        </>
      ),
    },
  ];

  const items = itemList.map((item) => (
    <Accordion.Item value={item.id} key={item.label}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>{item.content}</Accordion.Panel>
    </Accordion.Item>
  ));

  const deleteOffer = () => {
    if (selectedOffer && selectedOffer.id) {
      makeRequest(`me/offers/${selectedOffer.id.toString()}`, "DELETE", session?.user.access_token)
        .then(() => {
          setSelectedOffer(null);
          successNotification("This offer has been removed", "Offer removed");
        })
        .catch(() => errorNotification("An unknown error occurred while removing this offer."));
    }
  };

  return (
    <>
      <ConfirmationModal
        opened={modalOpened}
        close={close}
        yesFunction={deleteOffer}
        title="Remove offer"
        text="Are you sure you want to remove this offer?"
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />
      <Accordion defaultValue={["details"]} chevronPosition="right" variant="contained" multiple>
        {items}
      </Accordion>
    </>
  );
}
