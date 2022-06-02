import React from "react";
import {
  createStyles,
  Overlay,
  Container,
  Title,
  Text,
  Group,
} from "@mantine/core";
import { useTranslation } from "next-i18next";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    backgroundImage: "url(/hef-2022/main-hall.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: 700,
    [theme.fn.smallerThan("sm")]: {
      height: 200,
    },
  },

  container: {
    height: 700,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // paddingBottom: theme.spacing.xl * 6,
    zIndex: 1,
    position: "relative",

    [theme.fn.smallerThan("sm")]: {
      height: 275,
      paddingBottom: theme.spacing.xl * 3,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: 26,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,
    fontSize: theme.fontSizes.xl * 1.4,
    fontWeight: 600,

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: theme.spacing.xl * 1.5,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  feature: {
    gap: theme.spacing.sm,
    [theme.fn.smallerThan("sm")]: {
      gap: 4,
    },
  },
}));

export const HeroImage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("common");

  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container} size="xl">
        <Title className={classes.title} align="center">
          {t("event-title")}
        </Title>
        <Group align="center" mt="xl" className={classes.feature}>
          <Text className={classes.description} size="xl">
            {t("webinar-series")}
          </Text>
          <Text className={classes.description}>&#183;</Text>
          <Text className={classes.description} size="xl">
            {t("virtual-exhibition")}
          </Text>
          <Text className={classes.description}>&#183;</Text>
          <Text className={classes.description} size="xl">
            {t("product-simulation")}
          </Text>
        </Group>
      </Container>
    </div>
  );
};
