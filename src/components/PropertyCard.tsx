import { Card, Text, Group, createStyles, getStylesRef, rem, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowBackUp, IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { makeRequest } from "~/lib/requestHelper";

interface PropertyCardProps {
  image: string;
  title: string;
  propertyType: string;
  id?: string | undefined;
  trashButtons?: boolean | undefined;
  refresh?: () => void;
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

export function PropertyCard({ image, title, propertyType, id, trashButtons, refresh }: PropertyCardProps) {
  const { classes } = useStyles();

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
      })
      .catch((err) => {
        errorNotification("An unknown error occurred while restoring this property.");
        //TODO:
        console.log("Error: ", err, " when restoring property.");
      })
      .finally(() => {
        if (refresh) refresh();
      });
  };

  const permanentlyDeleteProperty = () => {
    if (!id) return;
    makeRequest(`me/properties/${id}/permanent`, "DELETE", session?.user.access_token)
      .then(() => {
        successNotification("The selected property has been permanently deleted!", "Property permanently deleted");
      })
      .catch((err) => {
        errorNotification("An unknown error occurred while permanently deleting this property.");
        //TODO
        console.log("Error: ", err, " when permanently deleting property.");
      })
      .finally(() => {
        if (refresh) refresh();
      });
  };

  const renderTrashButtons = (id: string | undefined, trashButtons: boolean | undefined) => {
    if (trashButtons && id) {
      return (
        <>
          <div className={classes.topButtons}>
            <Tooltip label="Restore" color="gray" withArrow>
              <IconArrowBackUp
                className="mr-4 md:mr-1"
                onClick={restoreProperty}
                style={{ cursor: "pointer" }}
              ></IconArrowBackUp>
            </Tooltip>
            <Tooltip label="Permanently Delete" color="gray" withArrow>
              <IconTrash onClick={permanentlyDeleteProperty} style={{ cursor: "pointer" }}></IconTrash>
            </Tooltip>
          </div>
        </>
      );
    }
  };

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component="a"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className={classes.image} style={{ backgroundImage: `url(${image})` }} />
      <div className={classes.overlay} />
      <div className={classes.content}>
        {shouldDisplay && renderTrashButtons(id, trashButtons)}
        <div>
          <Text size="lg" className={classes.title} weight={500}>
            {title}
          </Text>

          <Group position="apart" spacing="xs">
            <Text size="sm" className={classes.propertyType}>
              {propertyType}
            </Text>

            {/* <Group spacing="lg"> */}
            {/*   <Center> */}
            {/*     <IconEye size="1rem" stroke={1.5} color={theme.colors.dark[2]} /> */}
            {/*     <Text size="sm" className={classes.bodyText}> */}
            {/*       {views} */}
            {/*     </Text> */}
            {/*   </Center> */}
            {/*   <Center> */}
            {/*     <IconMessageCircle size="1rem" stroke={1.5} color={theme.colors.dark[2]} /> */}
            {/*     <Text size="sm" className={classes.bodyText}> */}
            {/*       {comments} */}
            {/*     </Text> */}
            {/*   </Center> */}
            {/* </Group> */}
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
    top: "20%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)",
  },
  topButtons: {
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 1,
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
