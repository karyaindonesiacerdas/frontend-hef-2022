import {
  Container,
  Box,
  createStyles,
  Title,
  Image,
  Center,
  Stack,
  SimpleGrid,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "next-i18next";

const useStyles = createStyles((theme) => {
  return {
    root: {
      marginTop: 200,
      marginBottom: 200,
    },

    heading: {
      fontSize: theme.fontSizes.xl * 1.5,
      marginBottom: theme.spacing.xl * 2,
      fontWeight: 700,
      textAlign: "center",
      [theme.fn.smallerThan("lg")]: {
        fontSize: theme.fontSizes.xl * 1.2,
      },
    },
    organizeBy: {
      marginTop: 80,
      [theme.fn.smallerThan("lg")]: {
        marginTop: 30,
      },
    },
  };
});

export const OrganizedBy = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("home");
  const theme = useMantineTheme();

  return (
    <Box className={classes.root}>
      <Container size="xl">
        <SimpleGrid
          cols={2}
          breakpoints={[
            { maxWidth: theme.breakpoints.sm, cols: 1, spacing: 60 },
          ]}
        >
          <Box>
            <Title order={3} className={classes.heading}>
              {t("organized-by")}
            </Title>
            <Center pr={15} className={classes.organizeBy}>
              <Image width={225} src="/kic.png" alt="PT KIC" fit="cover" />
            </Center>
          </Box>
          <Box>
            <Title order={3} className={classes.heading}>
              {t("international-representative")}
            </Title>
            <Center>
              <Image width={225} src="/elife.png" alt="ELS" fit="cover" />
            </Center>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
