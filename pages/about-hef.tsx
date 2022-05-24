import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Box,
  Center,
  Container,
  createStyles,
  Group,
  Image,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

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
  // container: {
  //   gap: theme.spacing.xl * 3,
  // },
  paragraph: {
    lineHeight: 2.2,
    width: "50%",
    [theme.fn.smallerThan("lg")]: {
      width: "100%",
    },
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
  container: {
    display: "flex",
    gap: theme.spacing.xl,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    [theme.fn.smallerThan("lg")]: {
      flexDirection: "column-reverse",
    },
  },
  image: {
    width: "50%",
    [theme.fn.smallerThan("lg")]: {
      width: "100%",
    },
  },
}));

const AboutHEF: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("overview");
  const theme = useMantineTheme();

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>{t("about-hef.tag")}</Text>
        <Text className={classes.title}>{t("about-hef.title")}</Text>
        {/* <SimpleGrid
          cols={2}
          className={classes.container}
          breakpoints={[{ maxWidth: theme.breakpoints.lg, cols: 1 }]}
          sx={(theme) => ({ padding: theme.spacing.md })}
        > */}
        <Box className={classes.container}>
          <Text size="lg" className={classes.paragraph}>
            {t("about-hef.content")}
          </Text>
          <Center style={{ perspective: "1000px" }} className={classes.image}>
            <Image
              fit="contain"
              src="/main-hall-frame.png"
              alt="About HEF"
              className={classes.imageRight}
            />
          </Center>
        </Box>
        {/* </SimpleGrid> */}
      </Container>
    </WebLayout>
  );
};

export default AboutHEF;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "overview"])),
  },
});
