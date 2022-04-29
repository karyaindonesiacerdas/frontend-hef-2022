import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Box,
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
  },
  container: {
    alignItems: "center",
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
  imageLeft: {
    borderRadius: 6,
    overflow: "hidden",
    transition: "all 1s",
    "&:hover": {
      transform: "rotateY(15deg) rotateX(5deg)",
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
        <SimpleGrid cols={2} className={classes.container}>
          <Box>
            <Title order={3}>{t("programs.program-1.title")}</Title>
            <Text color="gray" style={{ fontStyle: "italic" }}>
              {t("programs.program-1.tag")}
            </Text>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("programs.program-1.content")}
            </Text>
          </Box>
          <div style={{ perspective: "1000px" }}>
            <Image
              fit="contain"
              src="/seminar-room-frame.png"
              alt="About HEF"
              className={classes.imageRight}
            />
          </div>
        </SimpleGrid>
        <SimpleGrid mt={60} cols={2} className={classes.container}>
          <div style={{ perspective: "1000px" }}>
            <Image
              fit="contain"
              src="/main-hall-frame.png"
              alt="About HEF"
              className={classes.imageLeft}
            />
          </div>
          <Box>
            <Title order={3}>{t("programs.program-2.title")}</Title>
            <Text color="gray" style={{ fontStyle: "italic" }}>
              {t("programs.program-2.tag")}
            </Text>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("programs.program-2.content")}
            </Text>
          </Box>
        </SimpleGrid>
        <SimpleGrid mt={60} cols={2} className={classes.container}>
          <Box>
            <Title order={3}>{t("programs.program-3.title")}</Title>
            <Text color="gray" style={{ fontStyle: "italic" }}>
              {t("programs.program-3.tag")}
            </Text>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("programs.program-3.content")}
            </Text>
          </Box>

          <div style={{ perspective: "1000px" }}>
            <Image
              fit="contain"
              src="/who-attend.png"
              alt="About HEF"
              className={classes.imageRight}
            />
          </div>
        </SimpleGrid>
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
