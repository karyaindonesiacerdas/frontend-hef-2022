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

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.spacing.xl * 1,
    },
  },
  tag: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    color: theme.colors[theme.primaryColor],
    textTransform: "uppercase",
  },
  title: {
    fontSize: theme.fontSizes.xl * 2.6,
    marginBottom: theme.spacing.md,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  days: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 500,
    color: theme.colors[theme.primaryColor],
  },
  navButton: {
    background: "white",
    border: "1px solid",
    borderColor: theme.colors.gray[1],
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: theme.shadows.xl,
      transform: "translate(0, -6px)",
    },
  },
  linkText: {
    fontWeight: 500,
  },
}));

const links = [
  {
    image: "about-hew.svg",
    link: "/about-hef",
    text: "About HEF 2022",
  },
  {
    image: "register-exhibitor.svg",
    link: "/register/exhibitor",
    text: "Register as Exhibitor",
  },
  {
    image: "why-visit.svg",
    link: "/why-exhibit",
    text: "Why Exhibit?",
  },
  {
    image: "exhibitor-list.svg",
    link: "/exhibitor-guideline",
    text: "Exhibitor Guideline?",
  },
  {
    image: "seminar-rundown.svg",
    link: "/webinar-rundown",
    text: "Seminar Rundown",
  },
  {
    image: "register-visitor.svg",
    link: "/register/visitor",
    text: "Register as Visitor",
  },
  {
    image: "why-visit-2.svg",
    link: "/why-visit",
    text: "Why Visit?",
  },
  {
    image: "sponsor-partner.svg",
    link: "/visitor-guideline",
    text: "Visitor Guideline",
  },
];

export const Event = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("home");

  return (
    <Box className={classes.root}>
      <Container size="xl">
        <Grid>
          <Grid.Col span={4}>
            <Text className={classes.tag}>{t("countdown.event-tag")}</Text>
            <Title order={2} className={classes.title}>
              {t("countdown.event-title")}
            </Title>
            <Text className={classes.days}>{t("countdown.event-date")}</Text>
          </Grid.Col>
          <Grid.Col span={8}>
            <SimpleGrid cols={4} className={classes.wrapper}>
              {links.map((link) => (
                <Link key={link.link} href={link.link} passHref>
                  <Box className={classes.navButton}>
                    <Group direction="column" align="center">
                      <Image
                        width={80}
                        src={`/icons/${link.image}`}
                        alt={link.text}
                      />
                      <Text className={classes.linkText}>{link.text}</Text>
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
