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
};

type CardProps = {
  image: string;
};

function Card({ image }: CardProps) {
  const { classes } = useStyles();

  return <Paper shadow="md" p="xl" radius="md" sx={{ backgroundImage: `url(${image})` }} className={classes.card} />;
}

export function CardsCarousel({ data }: CarouselProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const slides = data.map((item) => (
    <Carousel.Slide key={item.image}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel slideSize="30%" slideGap="sm" align="start" slidesToScroll={mobile ? 1 : 2} loop withIndicators>
      {slides}
    </Carousel>
  );
}
