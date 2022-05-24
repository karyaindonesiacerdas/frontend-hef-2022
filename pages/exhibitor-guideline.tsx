import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Anchor,
  Container,
  createStyles,
  Image,
  List,
  SimpleGrid,
  Text,
} from "@mantine/core";
import Link from "next/link";
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

const ExhibitorGuideline: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("exhibitor");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>{t("exhibitor-guideline.tag")}</Text>
        <Text className={classes.title}>{t("exhibitor-guideline.title")}</Text>
        <SimpleGrid cols={2} className={classes.container}>
          <div>
            <Image
              fit="contain"
              src="/exhibitor-guideline-1.png"
              alt="Visitor Guideline"
            />
            <Image
              fit="contain"
              src="/exhibitor-guideline-2.png"
              alt="Visitor Guideline"
            />
            <Image
              fit="contain"
              src="/exhibitor-guideline-3.png"
              alt="Visitor Guideline"
            />
          </div>
          <List type="ordered" spacing="md" size="lg">
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-1")}{" "}
              <Link href="/register/exhibitor" passHref>
                <Anchor>
                  https://hospital-engineering-expo.com/register/exhibitor
                </Anchor>
              </Link>
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-2")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-3")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-4")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-5")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-6")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-7")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-8")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-9")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-10")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-11")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-12")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-13")}
            </List.Item>
            <List.Item className={classes.paragraph}>
              {t("exhibitor-guideline.guideline-14")}
            </List.Item>
          </List>
        </SimpleGrid>
      </Container>
    </WebLayout>
  );
};

export default ExhibitorGuideline;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "exhibitor"])),
  },
});
