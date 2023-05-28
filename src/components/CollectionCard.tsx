import { createStyles, Card, Image, Text, Group, Badge } from "@mantine/core";

const useStyles = createStyles((theme) => ({
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
  title: string;
  description: string;
  tags: string[];
  date: string;
}

export function CollectionCard({ image, description, title, tags, date }: CollectionCardProps) {
  const { classes } = useStyles();
  return (
    <Card radius={0} className="border-b border-shark-700">
      <Group noWrap spacing={0}>
        <Image src={image} height={140} width={140} alt={title} className="-ml-4" />

        <div className={classes.body}>
          <Text className={classes.title} mt="xs" mb="md">
            {title}
          </Text>

          <Text transform="uppercase" color="dimmed" weight={500} size="xs">
            {description}
          </Text>

          <Group noWrap spacing="xs" className="mt-2">
            <Text size="xs" color="dimmed">
              {tags.map((tag) => (
                <Badge key={tag} color="violet" variant="light" className="mr-2">
                  #{tag}
                </Badge>
              ))}
            </Text>
          </Group>

          <Group noWrap spacing="xs" className="mt-2">
            <Text size="xs" color="dimmed">
              {date}
            </Text>
          </Group>
        </div>
      </Group>
    </Card>
  );
}
