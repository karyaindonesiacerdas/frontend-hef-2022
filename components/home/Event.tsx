import {
  Group,
  SimpleGrid,
  Text,
  Container,
  Box,
  createStyles,
  Grid,
  Title,
  Image,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  root: {
    marginTop: theme.spacing.xl * 5,
    marginBottom: theme.spacing.xl * 5,
  },
  wrapper: {
    boxSizing: "border-box",
    backgroundImage: `linear-gradient(-60deg, ${
      theme.colors[theme.primaryColor][4]
    } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl * 1.5,

    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      padding: theme.spacing.xl * 1,
    },
  },
  tag: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    color: theme.colors[theme.primaryColor],
    textTransform: "uppercase",
    [theme.fn.smallerThan("lg")]: {
      textAlign: "center",
    },
  },
  title: {
    fontSize: theme.fontSizes.xl * 2.6,
    marginBottom: theme.spacing.md,
    fontWeight: 700,
    lineHeight: 1.2,
    [theme.fn.smallerThan("lg")]: {
      fontSize: theme.fontSizes.xl * 2,
      textAlign: "center",
    },
    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.xl * 1.5,
      textAlign: "center",
    },
  },
  days: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 500,
    color: theme.colors[theme.primaryColor],
    [theme.fn.smallerThan("lg")]: {
      textAlign: "center",
    },
  },
  navButton: {
    background: "white",
    border: "1px solid",
    borderColor: theme.colors.gray[1],
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    transition: "all 0.2s",
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows.xl,
      transform: "translate(0, -6px)",
    },
    [theme.fn.smallerThan("lg")]: {
      padding: theme.spacing.sm,
    },
  },
  linkText: {
    fontWeight: 500,
    textAlign: "center",
  },
  eventImage: {
    width: 80,
    [theme.fn.smallerThan("lg")]: {
      width: 60,
    },
  },
}));

const links = [
  {
    image: "about-hew.svg",
    link: "/about-hef",
    text: "About HEF 2022",
    value: "about-hef-2022",
  },
  {
    image: "register-exhibitor.svg",
    link: "/register/exhibitor",
    text: "Register as Exhibitor",
    value: "register-as-exhibitor",
  },
  {
    image: "why-visit.svg",
    link: "/why-exhibit",
    text: "Why Exhibit?",
    value: "why-exhibit",
  },
  {
    image: "exhibitor-list.svg",
    link: "/exhibitor-guideline",
    text: "Exhibitor Guideline",
    value: "exhibitor-guideline",
  },
  {
    image: "seminar-rundown.svg",
    link: "/webinar-rundown",
    text: "Seminar Rundown",
    value: "webinar-rundown",
  },
  {
    image: "register-visitor.svg",
    link: "/register/visitor",
    text: "Register as Visitor",
    value: "register-as-visitor",
  },
  {
    image: "why-visit-2.svg",
    link: "/why-attend",
    text: "Why attend?",
    value: "why-attend",
  },
  {
    image: "sponsor-partner.svg",
    link: "/visitor-guideline",
    text: "Visitor Guideline",
    value: "visitor-guideline",
  },
];

export const Event = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("home");
  const theme = useMantineTheme();

  return (
    <Box className={classes.root}>
      <Container size="xl">
        <Grid>
          <Grid.Col md={4} span={12}>
            <Text className={classes.tag}>{t("countdown.event-tag")}</Text>
            <Title order={2} className={classes.title}>
              {t("countdown.event-title")}
            </Title>
            <Text className={classes.days}>{t("countdown.event-date")}</Text>
          </Grid.Col>
          <Grid.Col md={8} span={12}>
            <SimpleGrid
              cols={4}
              className={classes.wrapper}
              breakpoints={[{ maxWidth: theme.breakpoints.sm, cols: 2 }]}
            >
              {links.map((link) => (
                <Link key={link.link} href={link.link} passHref>
                  <Box className={classes.navButton}>
                    <Group direction="column" align="center">
                      <Image
                        src={`/icons/${link.image}`}
                        alt={link.text}
                        className={classes.eventImage}
                      />
                      <Text className={classes.linkText}>{t(link.value)}</Text>
                    </Group>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};
