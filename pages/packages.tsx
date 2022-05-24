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

const attendances = [
  "Hospital Management Team",
  "Medical Doctor",
  "Hospital Clinical Staff",
  "Government Staff",
  "Hospital Engineering Staff",
  "University Lecturer",
  "Biomedical Engineer",
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

const Packages: NextPage = () => {
  const { classes } = useStyles();
  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>Exhibitor</Text>
        <Text className={classes.title}>Packages</Text>
        {/* <SimpleGrid mt={60} cols={2} className={classes.container}>
          <Box>
            <Text size="lg" mt={10} className={classes.paragraph}>
              With over 10000 registered members from Indonesia, IAHE is
              recognised nationally for conducting webinars focusing on hospital
              engineering. Healthcare professionals across the following
              industry sectors are represented within our visitor profiles:
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
                    {attendance}
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
        </SimpleGrid> */}
        <Center style={{ height: "42vh" }}>
          <Text weight={600} size="xl">
            Coming Soon
          </Text>
        </Center>
      </Container>
    </WebLayout>
  );
};

export default Packages;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "exhibitor"])),
  },
});
