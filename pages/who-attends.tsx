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
  useMantineTheme,
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
    maxWidth: 600,
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

const WhoAttends: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("visitor");
  const theme = useMantineTheme();

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>Visitor</Text>
        <Text className={classes.title}>{t("who-attend.title")}</Text>
        <Box mt={60} className={classes.container}>
          <Box className={classes.content}>
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
              <SimpleGrid
                cols={2}
                breakpoints={[{ maxWidth: theme.breakpoints.xs, cols: 1 }]}
              >
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

          <Center style={{ perspective: "1000px" }} className={classes.content}>
            <Image
              fit="contain"
              src="/who-attend.png"
              alt="About HEF"
              className={classes.imageRight}
            />
          </Center>
        </Box>
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
