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
  covers: string[];
  title: string;
  description: string;
  tags: string[];
  date: string;
}

type ThumbnailCollageProps = {
  covers: string[];
};

export function CollectionCard({ covers, description, title, tags, date }: CollectionCardProps) {
  const { classes } = useStyles();

  const ThumbnailCollage = ({ covers }: ThumbnailCollageProps) => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gridGap: "1px",
          width: "140px",
          height: "140px",
        }}
      >
        {covers.map((coverUrl, index) => (
          <div
            key={index}
            style={{
              overflow: "hidden",
            }}
          >
            <Image
              src={coverUrl}
              width={140}
              height={140}
              style={{
                objectFit: "cover",
              }}
              alt={"asd"}
              className="flex-shrink-0"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card radius={0} padding={0}>
      <Group noWrap spacing={0}>
        <Image src={"https://placehold.co/400x400"} height={140} width={140} alt={title} className="flex-shrink-0" />
        <ThumbnailCollage covers={covers} />

        <div className={classes.body}>
          <Text className={classes.title} mb="xs">
            {title}
          </Text>

          <Text size="sm" color="dimmed">
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
