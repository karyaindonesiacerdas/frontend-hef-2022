import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Container,
  createStyles,
  Image,
  Paper,
  SimpleGrid,
  Table,
  Text,
  Title,
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
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },
}));

type Rundown = {
  time: string;
  title: string;
  subtitle?: string;
  speakers?: string[];
  position?: string;
};

const rundowns1: Rundown[] = [
  {
    time: "08.30 - 08.35",
    title: "Pembukaan MC",
    speakers: ["MC"],
  },
  {
    time: "08.35 - 08.45",
    title: "Kata Sambutan",
    speakers: ["Presiden PTPI"],
  },
  {
    time: "08.45 - 09.00",
    title: "Keynote Speech 1",
    speakers: ["Perwakilan Kementerian"],
  },
  {
    time: "09.00 - 09.20",
    title: "Expert Talk",
    speakers: ["Perwakilan Perguruan Tinggi"],
  },
  {
    time: "09.20 - 09.30",
    title: "QnA",
  },
  {
    time: "09.30 - 10.00",
    title: "Industri 1 Talk",
    speakers: ["Sponsor 1"],
  },
  {
    time: "10.00 - 10.02",
    title: "Doorprize",
  },
  {
    time: "10.02 - 10.22",
    title: "Expert Talk",
    speakers: ["Perwakilan Rumah Sakit 1"],
  },
  {
    time: "10.22 - 10.32",
    title: "QnA",
  },
  {
    time: "10.32 - 11.02",
    title: "Industri 2 Talk",
    speakers: ["Sponsor 2"],
  },
  {
    time: "11.02 - 11.04",
    title: "Doorprize",
  },
  {
    time: "11.04 - 12.00",
    title: "Demo Produk, Konsultasi, Simulasi, dan QnA Panel",
    speakers: [
      "Perwakilan Perguruan Tinggi",
      "Sponsor 1",
      "Perwakilan Rumah Sakit 1",
      "Sponsor 2",
    ],
  },
  {
    time: "12.00 - 12.02",
    title: "Doorprize",
  },
  {
    time: "12.02 - 13.00",
    title: "ISOMA / QNA Industri",
  },
  {
    time: "13.00 - 13.15",
    title: "Keynote Speech 2",
    speakers: ["Perwakilan Kementrian"],
  },
  {
    time: "13.15 - 13.35",
    title: "Expert Talk",
    speakers: ["Perwakilan Perguruan Tinggi"],
  },
  {
    time: "13.35 - 13.45",
    title: "QnA",
  },
  {
    time: "13.45 - 14.15",
    title: "Industri 3 Talk",
    speakers: ["Sponsor 3"],
  },
  {
    time: "14.15 - 14.17",
    title: "Doorprize",
  },
  {
    time: "14.17 - 14.37",
    title: "Expert Talk",
    speakers: ["Perwakilan Rumah Sakit 2"],
  },
  {
    time: "14.37 - 14.47",
    title: "QnA",
  },
  {
    time: "14.47 - 15.17",
    title: "Industri 4 Talk",
    speakers: ["Sponsor 4"],
  },
  {
    time: "15.17 - 15.20",
    title: "Doorprize",
  },
  {
    time: "15.20 - 16.20",
    title: "Demo Produk, Konsultasi, Simulasi, dan QnA Panel",
    speakers: [
      "Perwakilan Perguruan Tinggi",
      "Sponsor 3",
      "Perwakilan Rumah Sakit 2",
      "Sponsor 4",
    ],
  },
  {
    time: "16.20 - 16.25",
    title: "Penutupan MC",
    speakers: ["MC"],
  },
];

const rundowns2: Rundown[] = [
  {
    time: "08.30 - 08.35",
    title: "Pembukaan MC",
    speakers: ["MC"],
  },
  {
    time: "08.35 - 08.45",
    title: "Kata Sambutan",
    speakers: ["Wapres 1 PTPI"],
  },
  {
    time: "08.45 - 09.00",
    title: "Keynote Speech 3",
    speakers: ["Perwakilan Kementerian"],
  },
  {
    time: "09.00 - 09.20",
    title: "Expert Talk",
    speakers: ["Perwakilan Perguruan Tinggi"],
  },
  {
    time: "09.20 - 09.30",
    title: "QnA",
  },
  {
    time: "09.30 - 10.00",
    title: "Industri 5 Talk",
    speakers: ["Sponsor 5"],
  },
  {
    time: "10.00 - 10.02",
    title: "Doorprize",
  },
  {
    time: "10.02 - 10.22",
    title: "Expert Talk",
    speakers: ["Perwakilan Rumah Sakit 3"],
  },
  {
    time: "10.22 - 10.32",
    title: "QnA",
  },
  {
    time: "10.32 - 11.02",
    title: "Industri 6 Talk",
    speakers: ["Sponsor 6"],
  },
  {
    time: "11.02 - 11.04",
    title: "Doorprize",
  },
  {
    time: "11.04 - 12.00",
    title: "Demo Produk, Konsultasi, Simulasi, dan QnA Panel",
    // speakers: [
    //   "Perwakilan Perguruan Tinggi",
    //   "Sponsor 1",
    //   "Perwakilan Rumah Sakit 1",
    //   "Sponsor 2",
    // ],
  },
  {
    time: "12.00 - 12.02",
    title: "Doorprize",
  },
  {
    time: "12.02 - 13.00",
    title: "ISOMA",
  },
  {
    time: "13.00 - 13.15",
    title: "Keynote Speech 4",
    speakers: ["Perwakilan Kementrian"],
  },
  {
    time: "13.15 - 13.35",
    title: "Expert Talk",
    speakers: ["Perwakilan Perguruan Tinggi"],
  },
  {
    time: "13.35 - 13.45",
    title: "QnA",
  },
  {
    time: "13.45 - 14.15",
    title: "Industri 7 Talk",
    speakers: ["Sponsor 7"],
  },
  {
    time: "14.15 - 14.17",
    title: "Doorprize",
  },
  {
    time: "14.17 - 14.37",
    title: "Expert Talk",
    speakers: ["Perwakilan Rumah Sakit 4"],
  },
  {
    time: "14.37 - 14.47",
    title: "QnA",
  },
  {
    time: "14.47 - 15.17",
    title: "Industri 8 Talk",
    speakers: ["Sponsor 8"],
  },
  {
    time: "15.17 - 15.20",
    title: "Doorprize",
  },
  {
    time: "15.20 - 16.20",
    title: "Demo Produk, Konsultasi, Simulasi, dan QnA Panel",
    // speakers: [
    //   "Perwakilan Perguruan Tinggi",
    //   "Sponsor 3",
    //   "Perwakilan Rumah Sakit 2",
    //   "Sponsor 4",
    // ],
  },
  {
    time: "16.20 - 16.25",
    title: "Penutupan MC",
    speakers: ["MC"],
  },
];

const rundowns3: Rundown[] = [
  {
    time: "08.30 - 08.35",
    title: "Pembukaan MC",
    speakers: ["MC"],
  },
  {
    time: "08.35 - 08.45",
    title: "Kata Sambutan",
    speakers: ["Wapres 2 PTPI"],
  },
  {
    time: "08.45 - 09.00",
    title: "Keynote Speech 3",
    speakers: ["Perwakilan Kementerian"],
  },
  {
    time: "09.00 - 09.20",
    title: "Expert Talk",
    speakers: ["Perwakilan Perguruan Tinggi"],
  },
  {
    time: "09.20 - 09.30",
    title: "QnA",
  },
  {
    time: "09.30 - 10.00",
    title: "Industri 9 Talk",
    speakers: ["Sponsor 9"],
  },
  {
    time: "10.00 - 10.02",
    title: "Doorprize",
  },
  {
    time: "10.02 - 10.22",
    title: "Expert Talk",
    speakers: ["Perwakilan Rumah Sakit 5"],
  },
  {
    time: "10.22 - 10.32",
    title: "QnA",
  },
  {
    time: "10.32 - 11.02",
    title: "Industri 10 Talk",
    speakers: ["Sponsor 10"],
  },
  {
    time: "11.02 - 11.04",
    title: "Doorprize",
  },
  {
    time: "11.04 - 12.00",
    title: "Demo Produk, Konsultasi, Simulasi, dan QnA Panel",
    // speakers: [
    //   "Perwakilan Perguruan Tinggi",
    //   "Sponsor 1",
    //   "Perwakilan Rumah Sakit 1",
    //   "Sponsor 2",
    // ],
  },
  {
    time: "12.00 - 12.02",
    title: "Doorprize",
  },
  {
    time: "12.02 - 13.00",
    title: "ISOMA",
  },
  {
    time: "13.00 - 13.15",
    title: "Keynote Speech 6",
    speakers: ["Perwakilan Kementrian"],
  },
  {
    time: "13.15 - 13.35",
    title: "Expert Talk",
    speakers: ["Perwakilan Perguruan Tinggi"],
  },
  {
    time: "13.35 - 13.45",
    title: "QnA",
  },
  {
    time: "13.45 - 14.15",
    title: "Industri 11 Talk",
    speakers: ["Sponsor 11"],
  },
  {
    time: "14.15 - 14.17",
    title: "Doorprize",
  },
  {
    time: "14.17 - 14.37",
    title: "Expert Talk",
    speakers: ["Perwakilan Rumah Sakit 6"],
  },
  {
    time: "14.37 - 14.47",
    title: "QnA",
  },
  {
    time: "14.47 - 15.17",
    title: "Industri 12 Talk",
    speakers: ["Sponsor 12"],
  },
  {
    time: "15.17 - 15.20",
    title: "Doorprize",
  },
  {
    time: "15.20 - 16.20",
    title: "Demo Produk, Konsultasi, Simulasi, dan QnA Panel",
    // speakers: [
    //   "Perwakilan Perguruan Tinggi",
    //   "Sponsor 3",
    //   "Perwakilan Rumah Sakit 2",
    //   "Sponsor 4",
    // ],
  },
  {
    time: "16.20 - 16.25",
    title: "Penutupan MC",
    speakers: ["MC"],
  },
];

const WebinarRundown: NextPage = () => {
  const { classes, cx } = useStyles();
  const { t } = useTranslation("overview");

  const ths = (
    <tr>
      <th>Time</th>
      <th>Title</th>
      <th>Speaker</th>
    </tr>
  );

  const rows1 = rundowns1?.map((rundown, i) => (
    <tr key={i}>
      <td>{rundown.time}</td>
      <td style={{ maxWidth: 250 }}>
        <Text size="sm" weight={600}>
          {rundown.title}
        </Text>
        <Text size="sm" color="gray">
          {rundown.subtitle}
        </Text>
      </td>
      <td style={{ maxWidth: 250 }}>
        {rundown.speakers?.map((speaker, idx) => (
          <Text key={idx} size="sm" weight={600}>
            {speaker}
          </Text>
        ))}
        <Text size="sm" color="gray">
          {rundown.position}
        </Text>
      </td>
    </tr>
  ));

  const rows2 = rundowns2?.map((rundown, i) => (
    <tr key={i}>
      <td>{rundown.time}</td>
      <td style={{ maxWidth: 250 }}>
        <Text size="sm" weight={600}>
          {rundown.title}
        </Text>
        <Text size="sm" color="gray">
          {rundown.subtitle}
        </Text>
      </td>
      <td style={{ maxWidth: 250 }}>
        {rundown.speakers?.map((speaker, idx) => (
          <Text key={idx} size="sm" weight={600}>
            {speaker}
          </Text>
        ))}
        <Text size="sm" color="gray">
          {rundown.position}
        </Text>
      </td>
    </tr>
  ));

  const rows3 = rundowns3?.map((rundown, i) => (
    <tr key={i}>
      <td>{rundown.time}</td>
      <td style={{ maxWidth: 250 }}>
        <Text size="sm" weight={600}>
          {rundown.title}
        </Text>
        <Text size="sm" color="gray">
          {rundown.subtitle}
        </Text>
      </td>
      <td style={{ maxWidth: 250 }}>
        {rundown.speakers?.map((speaker, idx) => (
          <Text key={idx} size="sm" weight={600}>
            {speaker}
          </Text>
        ))}
        <Text size="sm" color="gray">
          {rundown.position}
        </Text>
      </td>
    </tr>
  ));

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>Rundown</Text>
        <Title order={1} className={classes.title}>
          Webinar Rundown
        </Title>
        <Container>
          <Title order={2}>Hari ke-1</Title>
          <Text weight={500} color="dimmed">
            04 Juni 2022
          </Text>
          <Paper mt="lg" withBorder>
            <Table striped highlightOnHover>
              <thead className={cx(classes.header)}>{ths}</thead>
              <tbody>{rows1}</tbody>
            </Table>
          </Paper>
        </Container>
        <Container mt={50}>
          <Title order={2}>Hari ke-2</Title>
          <Text weight={500} color="dimmed">
            11 Juni 2022
          </Text>
          <Paper mt="lg" withBorder>
            <Table striped highlightOnHover>
              <thead className={cx(classes.header)}>{ths}</thead>
              <tbody>{rows2}</tbody>
            </Table>
          </Paper>
        </Container>
        <Container mt={50}>
          <Title order={2}>Hari ke-3</Title>
          <Text weight={500} color="dimmed">
            18 Juni 2022
          </Text>
          <Paper mt="lg" withBorder>
            <Table striped highlightOnHover>
              <thead className={cx(classes.header)}>{ths}</thead>
              <tbody>{rows3}</tbody>
            </Table>
          </Paper>
        </Container>
      </Container>
    </WebLayout>
  );
};

export default WebinarRundown;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "overview"])),
  },
});
