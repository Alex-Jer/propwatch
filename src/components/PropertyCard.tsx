import {
  Card,
  Text,
  Group,
  createStyles,
  getStylesRef,
  rem,
  Tooltip,
  Center,
  Skeleton,
  ActionIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowBackUp,
  IconBed,
  IconCalendarDollar,
  IconCheck,
  IconHomeDollar,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { priceToString } from "~/lib/propertyHelper";
import { makeRequest } from "~/lib/requestHelper";
import { type CollectionProperty } from "~/types";

interface PropertyCardProps {
  property: CollectionProperty;
  id?: string | undefined;
  refresh?: () => void;
  isLoading?: boolean;
  trashButtons?: boolean | undefined;
  xButton?: React.ElementType;
  xButtonTooltip?: string;
  executeXButton?: () => void;
}

export const errorNotification = (message: string, title = "Error") => {
  notifications.show({
    title,
    message,
    icon: <IconX size="1.1rem" />,
    color: "red",
  });
};

export const successNotification = (message: string, title = "Success") => {
  notifications.show({
    title,
    message,
    icon: <IconCheck size="1.1rem" />,
    color: "teal",
  });
};

export function PropertyCard({
  property,
  id,
  refresh,
  isLoading = false,
  trashButtons,
  xButton: XButton,
  xButtonTooltip,
  executeXButton,
}: PropertyCardProps) {
  const { classes } = useStyles();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const shouldDisplay = useMemo(() => {
    return isFocused || isHovered;
  }, [isHovered, isFocused]);

  const { data: session } = useSession();

  const restoreProperty = () => {
    if (!id) return;
    makeRequest(`me/properties/${id}/restore`, "PATCH", session?.user.access_token)
      .then(() => {
        successNotification("The selected property has been restored!", "Property restored");
        void queryClient.invalidateQueries({ queryKey: ["properties"] });
        void queryClient.invalidateQueries({ queryKey: ["collectionsSidebar"] });
      })
      .catch(() => {
        errorNotification("An unknown error occurred while restoring this property.");
      })
      .finally(() => {
        if (refresh) {
          refresh();
        }
      });
  };

  const permanentlyDeleteProperty = () => {
    if (!id) return;
    makeRequest(`me/properties/${id}/permanent`, "DELETE", session?.user.access_token)
      .then(() => {
        successNotification("The selected property has been permanently deleted!", "Property permanently deleted");
      })
      .catch(() => {
        errorNotification("An unknown error occurred while permanently deleting this property.");
      })
      .finally(() => {
        if (refresh) refresh();
      });
  };

  const renderTrashButtons = (id: string | undefined, trashButtons: boolean | undefined) => {
    return (
      <>
        <div className={`${classes.topButtons} space-x-1`}>
          {XButton && (
            <Tooltip label={xButtonTooltip} color="gray" withArrow>
              <ActionIcon
                color="red"
                variant="filled"
                className="z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (executeXButton) executeXButton();
                }}
              >
                <XButton size="1.3rem" />
              </ActionIcon>
            </Tooltip>
          )}

          {trashButtons && id && (
            <>
              <Tooltip label="Restore" color="gray" withArrow>
                <ActionIcon color="blue" variant="filled" onClick={restoreProperty}>
                  <IconArrowBackUp size="1.3rem" />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Permanently Delete" color="gray" withArrow>
                <ActionIcon color="red" variant="filled" onClick={permanentlyDeleteProperty}>
                  <IconTrash size="1.3rem" />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {!isLoading && (
        <>
          {property?.cover_url && (
            <div className={classes.image} style={{ backgroundImage: `url(${property.cover_url})` }} />
          )}
          <div className={classes.overlay}>
            {!property?.cover_url && (
              <div className={classes.placeholder}>
                <span>No cover</span>
              </div>
            )}
          </div>
        </>
      )}

      <div className={classes.content}>
        {isLoading && <Skeleton width="100%" height="100%" mb="xs" />}
        {shouldDisplay && renderTrashButtons(id, trashButtons)}

        <div>
          {!isLoading ? (
            <Text size="lg" className={classes.title} weight={500}>
              {property.title}
            </Text>
          ) : (
            <Skeleton width="100%" height={40} mb="xs" />
          )}

          <Group position="apart" spacing="xs">
            {!isLoading ? (
              <Text size="sm" className={`${classes.propertyType} capitalize`}>
                {property.type}
              </Text>
            ) : (
              <Skeleton width={80} height={15} />
            )}

            <Group spacing="lg">
              {property.typology ? (
                <Center>
                  <IconBed size="1rem" stroke={1.5} />
                  <Text size="sm" className={classes.bodyText}>
                    {property.typology.slice(1)}
                  </Text>
                </Center>
              ) : (
                isLoading && (
                  <Center>
                    <Skeleton width={80} height={15} />
                  </Center>
                )
              )}
              {property.current_price_sale || isLoading ? (
                <Center>
                  {!isLoading && property.current_price_sale ? (
                    <>
                      <IconHomeDollar size="1rem" stroke={1.5} />
                      <Text size="sm" className={classes.bodyText}>
                        {priceToString(property.current_price_sale)}
                      </Text>
                    </>
                  ) : (
                    <Skeleton width={80} height={15} />
                  )}
                </Center>
              ) : property.current_price_rent || isLoading ? (
                <Center>
                  {!isLoading && property.current_price_rent ? (
                    <>
                      <IconCalendarDollar size="1rem" stroke={1.5} />
                      <Text size="sm" className={classes.bodyText}>
                        {priceToString(property.current_price_rent)}
                        <span className="text-xs">/month</span>
                      </Text>
                    </>
                  ) : (
                    <Skeleton width={80} height={15} />
                  )}
                </Center>
              ) : null}
            </Group>
          </Group>
        </div>
      </div>
    </Card>
  );
}

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    height: rem(280),
    /* width: rem(280), */

    [`&:hover .${getStylesRef("image")}`]: {
      transform: "scale(1.03)",
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  image: {
    ...theme.fn.cover(),
    ref: getStylesRef("image"),
    backgroundSize: "cover",
    transition: "transform 500ms ease",
  },

  overlay: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: "-5%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)",
  },

  placeholder: {
    "& span": {
      color: theme.colors.dark[3],
      fontWeight: 600,
    },
  },

  topButtons: {
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    color: theme.colors.dark[0],
  },

  content: {
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    zIndex: 1,
  },

  title: {
    color: theme.white,
    marginBottom: rem(5),
  },

  bodyText: {
    color: theme.colors.dark[2],
    marginLeft: rem(7),
  },

  propertyType: {
    color: theme.colors.dark[2],
  },
}));
