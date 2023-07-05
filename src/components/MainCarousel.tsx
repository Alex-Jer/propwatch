import { createStyles, Image, Card, getStylesRef, rem } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

const useStyles = createStyles((theme) => ({
  price: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
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

  card: {
    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },

    [theme.fn.largerThan("md")]: {
      width: "844px",
      height: "440px",
    },
  },
}));

type CarouselProps = {
  images: { url: string }[];
};

export function MainCarousel({ images }: CarouselProps) {
  const { classes } = useStyles();

  const slides = images?.map((image) => (
    <Carousel.Slide key={image.url}>
      <Image src={image.url} height={440} alt="..." />
    </Carousel.Slide>
  ));

  return (
    <Card radius="md" withBorder padding="xl" className={classes.card}>
      <Card.Section>
        <Carousel
          withIndicators
          loop
          classNames={{
            root: classes.carousel,
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
        >
          {slides}
        </Carousel>
      </Card.Section>
    </Card>
  );
}
