import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { createStyles, Paper, useMantineTheme, rem } from "@mantine/core";

const useStyles = createStyles(() => ({
  card: {
    height: rem(150),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

type CarouselProps = {
  data: CardProps[];
  currentUrl: string;
  setCover: (url: string) => void;
};

type CardProps = {
  url: string;
  currentUrl: string;
  setCover: (url: string) => void;
};

function Card({ url, currentUrl, setCover }: CardProps) {
  const { classes } = useStyles();

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{
        backgroundImage: `url(${url})`,
        cursor: url != currentUrl ? "pointer" : "default",
        userSelect: "none",
      }}
      className={classes.card}
      onClick={() => {
        if (url != currentUrl) setCover(url);
      }}
    />
  );
}

export function CardsCarousel({ data, currentUrl, setCover }: CarouselProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const slides = data.map((item) => (
    <Carousel.Slide key={item.url}>
      <Card url={item.url} currentUrl={currentUrl} setCover={setCover} />
    </Carousel.Slide>
  ));

  return (
    <Carousel slideSize="30%" slideGap="sm" align="start" slidesToScroll={mobile ? 1 : 2} loop withIndicators>
      {slides}
    </Carousel>
  );
}
