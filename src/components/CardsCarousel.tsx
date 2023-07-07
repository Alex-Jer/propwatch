import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { createStyles, Paper, useMantineTheme, rem, getStylesRef } from "@mantine/core";

const useStyles = createStyles(() => ({
  card: {
    height: rem(350),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  carousel: {
    "&:hover": {
      [`& .${getStylesRef("carouselControls")}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getStylesRef("carouselControls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  carouselIndicator: {
    width: rem(4),
    height: rem(4),
    transition: "width 250ms ease",

    "&[data-active]": {
      width: rem(16),
    },
  },
}));

type CarouselProps = {
  data: { url: string }[];
  currentUrl?: string;
  setCover?: (url: string) => void;
  isImage?: boolean;
};

type CardProps = {
  url: string;
  currentUrl?: string;
  setCover?: (url: string) => void;
  isImage?: boolean;
};

function Card({ url, currentUrl, setCover, isImage = true }: CardProps) {
  const { classes } = useStyles();
  return isImage ? (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{
        backgroundImage: `url(${url})`,
        cursor: currentUrl && url != currentUrl ? "pointer" : "default",
        userSelect: "none",
      }}
      className={classes.card}
      onClick={() => {
        if (url != currentUrl && setCover) setCover(url);
      }}
    />
  ) : (
    <video src={url} controls style={{ width: "100%" }} />
  );
}

export function CardsCarousel({ data, currentUrl, setCover, isImage = true }: CarouselProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { classes } = useStyles();

  const slides = data.map((item) => (
    <Carousel.Slide key={item.url}>
      <Card url={item.url} currentUrl={currentUrl} setCover={setCover} isImage={isImage} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize={mobile ? "100%" : "30%"}
      slideGap="sm"
      align="start"
      slidesToScroll={mobile ? 1 : 2}
      className="w-full"
      loop
      withIndicators
      classNames={{
        root: classes.carousel,
        controls: classes.carouselControls,
        indicator: classes.carouselIndicator,
      }}
    >
      {slides}
    </Carousel>
  );
}
