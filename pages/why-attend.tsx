import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Box,
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

const reasons = [
  "profit-1",
  "profit-2",
  "profit-3",
  "profit-4",
];

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
    // alignItems: "center",
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

const WhyAttend: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("visitor");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>Visitor</Text>
        <Text className={classes.title}>{t("why-attend.title")}</Text>
        <SimpleGrid mt={60} cols={2} className={classes.container}>
          <Box>
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

          <div>
            <Image
              fit="contain"
              src="/why-attend-and-exhibit-1.png"
              alt="About HEF"
            />
            <Image
              mt="lg"
              fit="contain"
              src="/why-attend-and-exhibit-2.png"
              alt="About HEF"
            />
          </div>
        </SimpleGrid>
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
