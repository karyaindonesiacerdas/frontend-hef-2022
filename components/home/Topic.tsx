import {
  SimpleGrid,
  Text,
  Container,
  Box,
  createStyles,
  Title,
  Card,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "next-i18next";

const useStyles = createStyles((theme, _params, getRef) => {
  const image = getRef("image");

  return {
    root: {
      marginTop: theme.spacing.xl * 5,
      marginBottom: theme.spacing.xl * 5,
      [theme.fn.smallerThan("sm")]: {
        marginTop: theme.spacing.xl * 3,
        marginBottom: theme.spacing.xl * 3,
      },
    },

    tag: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 700,
      color: theme.colors[theme.primaryColor],
      textTransform: "uppercase",
      textAlign: "center",
    },

    heading: {
      fontSize: theme.fontSizes.xl * 1.5,
      marginBottom: theme.spacing.xl * 2,
      fontWeight: 700,
      textAlign: "center",
    },

    card: {
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
      paddingLeft: theme.spacing.xl,
      paddingRight: theme.spacing.xl,
      background: theme.colors["gray"][1],
      borderRadius: theme.radius.md,
      minHeight: 100,
      [theme.fn.smallerThan("sm")]: {
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        minHeight: 70,
      },
    },

    cardText: {
      fontSize: theme.fontSizes.lg,
      textAlign: "center",
      fontWeight: 500,
      [theme.fn.smallerThan("sm")]: {
        fontSize: theme.fontSizes.md,
      },
    },
  };
});

export const Topic = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("home");
  const theme = useMantineTheme();

  return (
    <Box className={classes.root}>
      <Container size="xl">
        <Text className={classes.tag}>{t("topic.tag")}</Text>
        <Title order={3} className={classes.heading}>
          {t("topic.header")}
        </Title>
        <SimpleGrid
          cols={3}
          spacing="md"
          mb={60}
          breakpoints={[
            { maxWidth: theme.breakpoints.xs, cols: 1, spacing: 4 },
            { maxWidth: theme.breakpoints.md, cols: 2, spacing: "sm" },
          ]}
        >
          <Center className={classes.card}>
            <Text className={classes.cardText}>
              SPA* Penyediaan dan Distribusi Energi RS
            </Text>
          </Center>
          <Center className={classes.card}>
            <Text className={classes.cardText}>
              SPA* Pendukung Smart Hospital dan Rawat Inap
            </Text>
          </Center>
          <Center className={classes.card}>
            <Text className={classes.cardText}>
              SPA* Pengendalian Infeksi, Ruang Isolasi dan Tata Udara
            </Text>
          </Center>
          <Center className={classes.card}>
            <Text className={classes.cardText}>
              SPA* Radiologi dan Radioterapi
            </Text>
          </Center>
          <Center className={classes.card}>
            <Text className={classes.cardText}>
              SPA* di ICU, OK dan Cathlab
            </Text>
          </Center>
          <Center className={classes.card}>
            <Text className={classes.cardText}>SPA* Rehabilitasi Medis</Text>
          </Center>
        </SimpleGrid>
        <Text size="sm">*SPA: Sarana, Prasarana, dan Alat</Text>
        <Text size="sm">
          **Topik diatas dapat berubah tergantung pada permintaan pasar
        </Text>
      </Container>
    </Box>
  );
};
