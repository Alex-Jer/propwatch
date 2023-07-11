import { createStyles, Card, Image, Text, Group, Skeleton } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 700,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
  },

  body: {
    padding: theme.spacing.md,
  },

  placeholder: {
    backgroundColor: theme.colors.dark[7],
    borderRadius: theme.radius.md,
    width: 144,
    height: 144,

    "& span": {
      color: theme.colors.dark[3],
      fontWeight: 600,
    },
  },
}));

interface CollectionCardProps {
  covers: string[];
  title: string;
  description: string;
  date: string;
  isLoading?: boolean;
}

type ThumbnailCollageProps = {
  covers: string[];
};

export function CollectionCard({ covers, description, title, date, isLoading = false }: CollectionCardProps) {
  const { classes } = useStyles();

  const ThumbnailCollage = ({ covers }: ThumbnailCollageProps) => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gridGap: "1px",
          width: "144px",
          height: "144px",
          overflow: "hidden",
          borderRadius: "4px",
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
              width={144}
              height={144}
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
        <div>
          {covers.length === 0 && !isLoading ? (
            <div className={`flex items-center justify-center ${classes.placeholder}`}>
              <span>No covers</span>
            </div>
          ) : !isLoading ? (
            <ThumbnailCollage covers={covers} />
          ) : (
            <div className={`flex items-center justify-center ${classes.placeholder}`}>
              <Skeleton width={144} height={144} />
            </div>
          )}
        </div>

        <div className={classes.body}>
          {!isLoading ? (
            <Text className={classes.title} mb="xs">
              {title}
            </Text>
          ) : (
            <Skeleton width={144} height={24} />
          )}

          {!isLoading ? (
            <Text size="sm" color="dimmed">
              {description}
            </Text>
          ) : (
            <>
              <Skeleton width={600} height={16} className="mt-2" />
              <Skeleton width={600} height={16} className="mt-2" />
            </>
          )}

          <Group noWrap spacing="xs" className="mt-2">
            {!isLoading ? (
              <Text size="xs" color="dimmed">
                {date}
              </Text>
            ) : (
              <Skeleton width={116} height={12} />
            )}
          </Group>
        </div>
      </Group>
    </Card>
  );
}
