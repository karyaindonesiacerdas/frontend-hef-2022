import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Box,
  Center,
  Container,
  createStyles,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const useStyles = createStyles((theme) => ({
  root: {
    marginTop: theme.spacing.xl * 3,
    marginBottom: theme.spacing.xl * 3,
  },
  tag: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    color: theme.colors[theme.primaryColor],
    textTransform: "uppercase",
    textAlign: "center",
  },
  title: {
    fontSize: theme.fontSizes.xl * 2,
    marginBottom: theme.spacing.xl * 2,
    fontWeight: 700,
    textAlign: "center",
    [theme.fn.smallerThan("lg")]: {
      fontSize: theme.fontSizes.xl * 1.5,
    },
  },
  container: {
    alignItems: "center",
    gap: theme.spacing.xl * 3,
  },
  paragraph: {
    lineHeight: 2.2,
    maxWidth: 700,
    margin: "0 auto",
  },
  imageRight: {
    borderRadius: 6,
    overflow: "hidden",
    transition: "all 1s",
    "&:hover": {
      transform: "rotateY(-15deg) rotateX(5deg)",
    },
    maxWidth: 600,
  },
  imageLeft: {
    borderRadius: 6,
    overflow: "hidden",
    transition: "all 1s",
    "&:hover": {
      transform: "rotateY(15deg) rotateX(5deg)",
    },
    maxWidth: 600,
  },
  rightImageContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    [theme.fn.smallerThan("lg")]: {
      flexDirection: "column",
    },
  },
  leftImageContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,

    [theme.fn.smallerThan("lg")]: {
      flexDirection: "column-reverse",
    },
  },
  content: {
    width: "50%",
    [theme.fn.smallerThan("lg")]: {
      width: "100%",
    },
  },
}));

const Programs: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("overview");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>{t("our-programs")}</Text>
        <Text className={classes.title}>Programs</Text>
        <Box className={classes.rightImageContainer}>
          <Box className={classes.content}>
            <Title order={3} sx={{ maxWidth: 700, margin: "0 auto" }}>
              {t("programs.program-1.title")}
            </Title>
            <Text
              color="gray"
              style={{ fontStyle: "italic" }}
              sx={{ maxWidth: 700, margin: "0 auto" }}
            >
              {t("programs.program-1.tag")}
            </Text>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("programs.program-1.content")}
            </Text>
          </Box>
          <Center style={{ perspective: "1000px" }} className={classes.content}>
            <Image
              fit="contain"
              src="/hef-2022/webinar-series.png"
              alt="About HEF"
              className={classes.imageRight}
            />
          </Center>
        </Box>
        <Box mt={60} className={classes.leftImageContainer}>
          <Center style={{ perspective: "1000px" }} className={classes.content}>
            <Image
              fit="contain"
              src="/hef-2022/main-hall.jpg"
              alt="About HEF"
              className={classes.imageLeft}
            />
          </Center>
          <Box className={classes.content}>
            <Title order={3} sx={{ maxWidth: 700, margin: "0 auto" }}>
              {t("programs.program-2.title")}
            </Title>
            <Text
              color="gray"
              style={{ fontStyle: "italic" }}
              sx={{ maxWidth: 700, margin: "0 auto" }}
            >
              {t("programs.program-2.tag")}
            </Text>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("programs.program-2.content")}
            </Text>
          </Box>
        </Box>
        <Box mt={60} className={classes.rightImageContainer}>
          <Box className={classes.content}>
            <Title order={3} sx={{ maxWidth: 700, margin: "0 auto" }}>
              {t("programs.program-3.title")}
            </Title>
            <Text
              color="gray"
              style={{ fontStyle: "italic" }}
              sx={{ maxWidth: 700, margin: "0 auto" }}
            >
              {t("programs.program-3.tag")}
            </Text>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("programs.program-3.content")}
            </Text>
          </Box>

          <Center style={{ perspective: "1000px" }} className={classes.content}>
            <Image
              fit="contain"
              src="/hef-2022/product-simulation.jpg"
              alt="About HEF"
              className={classes.imageRight}
            />
          </Center>
        </Box>
      </Container>
    </WebLayout>
  );
};

export default Programs;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "overview"])),
  },
});
