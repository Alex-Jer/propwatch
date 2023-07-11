import { Center, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CardBackground from "~/components/CardBackground";
import { PropertyForm } from "~/components/property";
import { useProperty } from "~/hooks/useQueries";

const EditProperty: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { propertyId } = router.query;

  const {
    data: property,
    isLoading,
    isError,
  } = useProperty({
    session,
    status,
    elementId: String(propertyId ?? ""),
  });

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Error",
        message: "Could not load property",
        color: "red",
        icon: <IconX size="1.5rem" />,
      });
    }
  }, [isError]);

  if (isLoading && !property) {
    return <div>Loading...</div>;
  }

  console.log({ property });

  return (
    <>
      <div className="mx-2 mt-6 pt-4 sm:mx-4 md:mx-6 2xl:mx-36">
        <CardBackground>
          <Center>
            <Text size="xl" weight={700} pt="sm" pb="lg">
              Editing Property
            </Text>
          </Center>
          <PropertyForm property={property} mode="edit" />
        </CardBackground>
      </div>
    </>
  );
};

export default EditProperty;
