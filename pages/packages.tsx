import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Box,
  Center,
  Container,
  createStyles,
  Image,
  List,
  Paper,
  SimpleGrid,
  Table,
  Text,
  ThemeIcon,
  useMantineTheme,
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
  const theme = useMantineTheme();

  // const rows = elements.map((element) => (
  //   <tr key={element.name}>
  //     <td>{element.position}</td>
  //     <td>{element.name}</td>
  //     <td>{element.symbol}</td>
  //     <td>{element.mass}</td>
  //   </tr>
  // ));

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>Exhibitor</Text>
        <Text className={classes.title}>Packages</Text>

        <Paper withBorder radius="md">
          <Table fontSize="md" highlightOnHover>
            <thead>
              <tr>
                <th>Group</th>
                <th>Tipe</th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                    width: 200,
                    textAlign: "center",
                  }}
                >
                  Tarif (Juta)
                </th>
                <th
                  style={{
                    backgroundColor: theme.colors.gray[4],
                    color: theme.colors.dark[7],
                  }}
                >
                  Meteorite
                </th>
                <th
                  style={{
                    backgroundColor: theme.colors.red[7],
                    color: "white",
                  }}
                >
                  Satellite
                </th>
                <th
                  style={{
                    backgroundColor: theme.colors.orange[3],
                    color: theme.colors.dark[6],
                  }}
                >
                  Planet
                </th>
                <th
                  style={{
                    backgroundColor: theme.colors.indigo[2],
                    color: theme.colors.dark[6],
                  }}
                >
                  Start
                </th>
                <th
                  style={{
                    backgroundColor: theme.colors.pink[2],
                    color: theme.colors.dark[6],
                  }}
                >
                  Galaxy
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Serial Webinar</td>
                <td>Presentasi selama 10 menit di Industry Talk</td>
                <td align="center">10</td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.red[7]} />
                </td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>Presentasi selama 20 menit di Industry Talk</td>
                <td align="center">20</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center"></td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>Presentasi selama 30 menit di Industry Talk</td>
                <td align="center">30</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>Presentasi selama 60 menit di Industry Talk</td>
                <td align="center">60</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Logo di Poster / Flyer</td>
                <td align="center">5</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  Logo di Background Zoom (Logo pada saat narasumber berbicara,
                  kecuali pada saat narasumber dari kementerian
                </td>
                <td align="center">3</td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.red[7]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Ad libs oleh MC</td>
                <td align="center">3</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Video iklan 1 menit</td>
                <td align="center">5</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Simulasi Produk</td>
                <td>
                  Produk demo; Simulasi proses akuisisi, penggunaan dan
                  pemeliharaan; Konsultasi terkait dengan produk selama 30 menit
                </td>
                <td align="center">22,5</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>
                  Produk demo; Simulasi proses akuisisi, penggunaan dan
                  pemeliharaan; Konsultasi terkait dengan produk selama 60 menit
                </td>
                <td align="center">45</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Pameran Produk Virtual</td>
                <td>
                  Basic (Website) untuk 3 hari (5 poster + 1 video 5 menit)
                </td>
                <td align="center">6</td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.red[7]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Tambahan 1 Poster</td>
                <td align="center">0,75</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>Tambahan video 1 menit</td>
                <td align="center">0,75</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>Katalog Produk 1 Halaman</td>
                <td align="center">2</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Live Chat</td>
                <td align="center">2</td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.red[7]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Kartu Nama</td>
                <td align="center">2</td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.red[7]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Hadiah doorprize untuk pengunjung @ Rp.3.000.000</td>
                <td align="center">5</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">1</td>
                <td align="center">2</td>
                <td align="center">3</td>
              </tr>
              <tr>
                <td></td>
                <td>
                  Product Exhibition for Software House and Health Apps
                  Provider*
                </td>
                <td colSpan={6} align="center">
                  *Silahkan hubungi kami
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Website</td>
                <td>Logo di halaman utama (untuk 1 bulan)</td>
                <td align="center">1,5</td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.red[7]} />
                </td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>
                  Running Text di halama utama (10 detik/jam selama 1 bulan)
                </td>
                <td align="center">1,5</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>1 halaman News atau display (1 bulan)</td>
                <td align="center">1,5</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Iklan video 1 menit (1 bulan)</td>
                <td align="center">2</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Logo di halaman utama (untuk 3 bulan)</td>
                <td align="center">3</td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.gray[7]} />
                </td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  Running Text di halaman utama (10 detik/jam selama 3 bulan)
                </td>
                <td align="center">3</td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.gray[7]} />
                </td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.orange[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.indigo[4]} />
                </td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>1 halaman News atau display (3 bulan)</td>
                <td align="center">3</td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
              </tr>
              <tr>
                <td></td>
                <td>Iklan video 1 menit (3 bulan)</td>
                <td align="center">5</td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.gray[7]} />
                </td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center"></td>
                <td align="center">
                  <CircleCheck size={30} color={theme.colors.pink[4]} />
                </td>
              </tr>
            </tbody>
          </Table>
        </Paper>
        <Text mt={40} size="lg" align="center">
          Untuk informasi lebih lanjut, hubungi kami:{" "}
        </Text>
        <Text size="lg" align="center" weight={600}>
          +62 858 9377 7283 (Adrian)
        </Text>
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
