import {
  Container,
  Box,
  createStyles,
  Title,
  Image,
  Center,
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
    },
  };
});

export const OrganizedBy = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("home");

  return (
    <Box className={classes.root}>
      <Container size="xl">
        <Title order={3} className={classes.heading}>
          {t("organized-by")}
        </Title>
        <Center pr={15}>
          <Image width={225} src="/kic.png" alt="PT KIC" fit="cover" />
        </Center>
      </Container>
    </Box>
  );
};
