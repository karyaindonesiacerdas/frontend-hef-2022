import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Box,
  Center,
  Container,
  createStyles,
  Image,
  List,
  SimpleGrid,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { CircleCheck } from "tabler-icons-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// const reasons = [
//   "A series of seminars with over 40 speakers from the government, association, industry and hospital sectors with a live Q&A session in each seminar to facilitate the hospital needs that’s up to standards and affordable.",
//   "Product presentation from exhibitors and 1 on 1 business matching between exhibitors and prospective buyers.",
//   "Free 1 on 1 consultation with speakers or consultants specializing in the 6 hospital engineering areas.",
//   "Networking with over 10000 members of IHEA",
//   "Get exclusive materials on the topic of Hospital Engineering in the era of COVID19 and Industry 4.0",
//   "Certificate worth 24 points And win attractive prizes and rewards throughout the event.",
// ];

const reasons = ["profit-1", "profit-2", "profit-3", "profit-4"];

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
  //   // alignItems: "center",
  //   gap: theme.spacing.xl * 3,
  // },
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
    maxWidth: 700,
  },
  imageLeft: {
    borderRadius: 6,
    overflow: "hidden",
    transition: "all 1s",
    "&:hover": {
      transform: "rotateY(15deg) rotateX(5deg)",
    },
  },
  container: {
    display: "flex",
    gap: theme.spacing.md,
    [theme.fn.smallerThan("lg")]: {
      flexDirection: "column-reverse",
    },
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  content: {
    width: "50%",
    [theme.fn.smallerThan("lg")]: {
      width: "100%",
    },
  },
}));

const WhyAttend: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("visitor");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>Visitor</Text>
        <Text className={classes.title}>{t("why-attend.title")}</Text>
        <Box mt={60} className={classes.container}>
          <Box className={classes.content}>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("why-attend.overview")}
            </Text>

            <List
              mt={14}
              icon={
                <ThemeIcon size={24} radius="xl">
                  <CircleCheck size={22} />
                </ThemeIcon>
              }
              styles={{
                itemIcon: { marginTop: 2 },
                itemWrapper: {
                  marginTop: 12,
                  fontSize: 18,
                },
              }}
            >
              {reasons.map((reason) => (
                <List.Item key={reason}>{t(`why-attend.${reason}`)}</List.Item>
              ))}
            </List>
          </Box>

          <Center className={classes.content}>
            <div>
              <Image
                fit="contain"
                src="/why-attend-and-exhibit-1.png"
                alt="About HEF"
                className={classes.imageRight}
              />
              <Image
                mt="lg"
                fit="contain"
                src="/why-attend-and-exhibit-2.png"
                alt="About HEF"
                className={classes.imageRight}
              />
            </div>
          </Center>
        </Box>
      </Container>
    </WebLayout>
  );
};

export default WhyAttend;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "visitor"])),
  },
});
