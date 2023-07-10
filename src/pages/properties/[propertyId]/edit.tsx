import { Center, Text } from "@mantine/core";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import CardBackground from "~/components/CardBackground";
import { PropertyForm } from "~/components/property";
import { type Property } from "~/types";

const EditProperty: NextPage = () => {
  const router = useRouter();
  const { property: propertyJson } = router.query;

  const property = JSON.parse(propertyJson as string) as Property;

  return (
    <>
      <CardBackground>
        <Center>
          <Text size="xl" weight={700} pt="sm" pb="lg">
            Editing Property
          </Text>
        </Center>
        <PropertyForm property={property} />
      </CardBackground>
    </>
  );
};

export default EditProperty;
