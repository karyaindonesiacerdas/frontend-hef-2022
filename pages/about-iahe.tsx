import { GetStaticPropsContext, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Container, createStyles, List, Text } from "@mantine/core";

import WebLayout from "components/web-layout/WebLayout";

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
    gap: theme.spacing.xl * 3,
  },
  paragraph: {
    lineHeight: 2.2,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
}));

const AboutIAHE: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("overview");

  return (
    <WebLayout>
      <Container className={classes.root}>
        <Text className={classes.tag}>{t("about-ihea.tag")}</Text>
        <Text className={classes.title}>{t("about-ihea.title")}</Text>

        <Text className={classes.paragraph} size="lg">
          {t("about-ihea.overview")}
        </Text>
        <Text className={classes.tag} mt={40} mb={10}>
          {t("about-ihea.why-tag")}
        </Text>
        <List type="ordered" spacing="xl" size="lg">
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-1")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-2")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-3")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-4")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-5")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-6")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-7")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-8")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-9")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-10")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-11")}
          </List.Item>
          <List.Item className={classes.paragraph}>
            {t("about-ihea.why-12")}
          </List.Item>
        </List>
      </Container>
    </WebLayout>
  );
};

export default AboutIAHE;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "overview"])),
  },
});
