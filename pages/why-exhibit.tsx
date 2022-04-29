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
//   "A joint forum between regulators (government), academics (experts/universities), and industries to facilitate the hospital needs that’s up to standards and financial conditions of the hospital.",
//   "Increase exposure towards your products by demonstrating it during selected webinars and in our exhibition hall. (Products presented must meet the national or international standards",
//   "Connect with potential buyers (up to 40 potential buyers in 3 days)",
//   "The opportunity to be recommended by the association as a company with technically appropriate products and services (based on assessment results by IAHE) to all IAHE members.",
//   "The opportunity to partner with IAHE to continuously encourage and build hospitals in Indonesia that are safer, more environmentally friendly, affordable, secure and beneficial.",
// ];

const reasons = ["profit-1", "profit-2", "profit-3", "profit-4", "profit-5"];

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

const WhyExhibit: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("exhibitor");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>Exhibitor</Text>
        <Text className={classes.title}>{t("why-exhibit.title")}</Text>
        <SimpleGrid mt={60} cols={2} className={classes.container}>
          <Box>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("why-exhibit.overview")}
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
                <List.Item key={reason}>{t(`why-exhibit.${reason}`)}</List.Item>
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

export default WhyExhibit;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "exhibitor"])),
  },
});
