import { Group, Text, Accordion } from "@mantine/core";
import {
  Icon24Hours,
  IconAddressBook,
  IconClipboardList,
  IconCurrentLocation,
  IconListDetails,
  IconMapPin,
} from "@tabler/icons-react";
import { type ReactNode } from "react";
import { completeAddress, completeAdmAddress, numberToString, propertyDetailsResume } from "~/lib/propertyHelper";
import { type Property } from "~/types";

interface AccordionLabelProps {
  label: string;
  icon: React.ElementType;
  description: string;
}

function AccordionLabel({ label, icon: Icon, description }: AccordionLabelProps) {
  return (
    <Group noWrap>
      <Icon size="2rem" />
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
          label={characteristic.name.substring(0, 1).toUpperCase() + characteristic.name.substring(1)}
          value={convertCharacteristicValue(characteristic.value, characteristic.type) ?? "N/A"}
        />
      );
    });
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
            <LabelAndValue label="Type" value={property.type?.toString()} />
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
    { id: "ipsum", icon: Icon24Hours, label: "Lorem ipsum", description: "Lorem ipsum", content: <>Lorem ipsum</> },
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

  return (
    <Accordion defaultValue={["details"]} chevronPosition="right" variant="contained" multiple>
      {items}
    </Accordion>
  );
}
