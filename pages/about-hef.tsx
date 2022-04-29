import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Container,
  createStyles,
  Image,
  SimpleGrid,
  Text,
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
  },
  container: {
    gap: theme.spacing.xl * 3,
  },
  paragraph: {
    lineHeight: 2.2,
  },
  imageRight: {
    borderRadius: 6,
    overflow: "hidden",
    transition: "all 1s",
    "&:hover": {
      transform: "rotateY(-15deg) rotateX(5deg)",
    },
  },
}));

const AboutHEF: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("overview");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>{t("about-hef.tag")}</Text>
        <Text className={classes.title}>{t("about-hef.title")}</Text>
        <SimpleGrid cols={2} className={classes.container}>
          <Text size="lg" className={classes.paragraph}>
            {t("about-hef.content")}
          </Text>
          <div style={{ perspective: "1000px" }}>
            <Image
              fit="contain"
              src="/main-hall-frame.png"
              alt="About HEF"
              className={classes.imageRight}
            />
          </div>
        </SimpleGrid>
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
