import { createStyles, Card, Image, Text, Group } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
  },

  body: {
    padding: theme.spacing.md,
  },
}));

interface CollectionCardProps {
  image: string;
  description: string;
  title: string;
  date: string;
}

export function CollectionCard({ image, description, title, date }: CollectionCardProps) {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" p={0} className={classes.card}>
      <Group noWrap spacing={0}>
        <Image src={image} height={140} width={140} />
        <div className={classes.body}>
          <Text className={classes.title} mt="xs" mb="md">
            {title}
          </Text>
          <Text transform="uppercase" color="dimmed" weight={500} size="xs">
            {description}
          </Text>
          <Group noWrap spacing="xs">
            <Text size="xs" color="dimmed">
              {date}
            </Text>
          </Group>
        </div>
      </Group>
    </Card>
  );
}
