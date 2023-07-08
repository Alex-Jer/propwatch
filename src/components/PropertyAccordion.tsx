import { Group, Text, Accordion } from "@mantine/core";
import { Icon24Hours, IconAddressBook, IconCurrentLocation, IconMapPin } from "@tabler/icons-react";
import { type ReactNode } from "react";
import { completeAddress, completeAdmAddress } from "~/lib/propertyHelper";
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
};

function LabelAndValue({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div>
      <Text>{label}</Text>
      <Text size="sm" color="dimmed" weight={400}>
        {value ?? "N/A"}
      </Text>
    </div>
  );
}

export function PropertyAccordion({ property }: { property: Property }) {
  const itemList: AccordionItem[] = [
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

    {
      id: "carol",
      icon: Icon24Hours,
      label: "Carol Miller",
      description: "One of the richest people on Earth",
      content:
        "Carol Miller (born January 30, 2880), better known as Mom, is the evil chief executive officer and shareholder of 99.7% of Momcorp, one of the largest industrial conglomerates in the universe and the source of most of Earth's robots. She is also one of the main antagonists of the Futurama series.",
    },

    {
      id: "homer",
      icon: Icon24Hours,
      label: "Homer Simpson",
      description: "Overweight, lazy, and often ignorant",
      content:
        "Homer Jay Simpson (born May 12) is the main protagonist and one of the five main characters of The Simpsons series(or show). He is the spouse of Marge Simpson and father of Bart, Lisa and Maggie Simpson.",
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
    <Accordion chevronPosition="right" variant="contained" multiple>
      {items}
    </Accordion>
  );
}
