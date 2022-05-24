import {
  SimpleGrid,
  Container,
  Box,
  createStyles,
  Title,
  Image,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "next-i18next";
import { ISponsor } from "types";

const useStyles = createStyles((theme) => {
  return {
    root: {
      marginTop: 200,
      marginBottom: 200,
    },

    heading: {
      fontSize: theme.fontSizes.xl * 1.5,
      marginBottom: theme.spacing.xl * 2,
      fontWeight: 700,
      textAlign: "center",
    },

    logoContainer: {
      gap: theme.spacing.xl * 2,
    },

    logoItem: {
      height: 200,
      padding: theme.spacing.xl,
      [theme.fn.smallerThan("md")]: {
        height: 160,
        padding: theme.spacing.md,
      },
      [theme.fn.smallerThan("sm")]: {
        height: 120,
        padding: theme.spacing.sm,
      },
    },
  };
});

type Props = {
  sponsors: ISponsor[];
};

export const Sponsor = ({ sponsors }: Props) => {
  const { classes } = useStyles();
  const { t } = useTranslation("home");
  const theme = useMantineTheme();

  return (
    <Box className={classes.root}>
      <Container size="xl">
        <Title order={3} className={classes.heading}>
          {t("sponsored-by")}
        </Title>
        <SimpleGrid
          cols={4}
          className={classes.logoContainer}
          breakpoints={[
            { maxWidth: theme.breakpoints.sm, cols: 2 },
            { maxWidth: theme.breakpoints.lg, cols: 3 },
          ]}
        >
          {sponsors?.map((sponsor) => (
            <Center key={sponsor._id} className={classes.logoItem}>
              <Image src={sponsor?.logo?.src} alt={sponsor?.name} fit="cover" />
            </Center>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
