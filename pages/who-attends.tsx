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

// const attendances = [
//   "Hospital Management Team",
//   "Medical Doctor",
//   "Hospital Clinical Staff",
//   "Government Staff",
//   "Hospital Engineering Staff",
//   "University Lecturer",
//   "Biomedical Engineer",
// ];

const attendances = [
  "attendee-1",
  "attendee-2",
  "attendee-3",
  "attendee-4",
  "attendee-5",
  "attendee-6",
  "attendee-7",
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

const WhoAttends: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("visitor");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>Visitor</Text>
        <Text className={classes.title}>{t("who-attend.title")}</Text>
        <SimpleGrid mt={60} cols={2} className={classes.container}>
          <Box>
            <Text size="lg" mt={10} className={classes.paragraph}>
              {t("who-attend.overview")}
            </Text>

            <List
              mt={14}
              spacing="xs"
              center
              icon={
                <ThemeIcon size={24} radius="xl">
                  <CircleCheck size={22} />
                </ThemeIcon>
              }
              styles={{
                itemWrapper: {
                  fontSize: 18,
                },
              }}
            >
              <SimpleGrid cols={2}>
                {attendances.map((attendance) => (
                  <List.Item
                    style={{
                      marginTop: 0,
                    }}
                    key={attendance}
                  >
                    {t(`who-attend.${attendance}`)}
                  </List.Item>
                ))}
              </SimpleGrid>
            </List>
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

export default WhoAttends;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "visitor"])),
  },
});
