import React from "react";
import {
  createStyles,
  Header,
  Menu,
  Group,
  Center,
  Burger,
  Container,
  Box,
  Text,
  Button,
  Image,
  useMantineTheme,
  Transition,
  Paper,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { useBooleanToggle, useMediaQuery } from "@mantine/hooks";
import { ChevronDown } from "tabler-icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Marquee from "react-fast-marquee";

import { LanguagePicker } from "./LanguagePicker";
import { LinksGroup } from "../admin-layout/NavbarLinksGroup";
import { MobileLinksGroup } from "./MobileLinksGroup";
import RunningText from "../RunningText";

const HEADER_HEIGHT = 60;

const links = [
  {
    link: "/",
    label: "home",
  },
  {
    link: "#1",
    label: "overview",
    links: [
      {
        link: "/about-hef",
        // label: "About HEF",
        label: "about-hef",
      },
      {
        link: "/about-iahe",
        // label: "About IAHE",
        label: "about-ihea",
      },
      {
        link: "/programs",
        // label: "Programs",
        label: "programs",
      },
      {
        link: "/webinar-rundown",
        // label: "Webinar Rundown",
        label: "webinar-rundown",
      },
      // {
      //   link: "/important-dates",
      //   // label: "Important Dates",
      //   label: "important-dates",
      // },
    ],
  },
  {
    link: "#2",
    label: "visitor",
    links: [
      {
        link: "/visitor-guideline",
        // label: "Visitor Guideline",
        label: "visitor-guideline",
      },
      {
        link: "/who-attends",
        // label: "Who Attends",
        label: "who-attends",
      },
      {
        link: "/why-attend",
        // label: "Why Attend",
        label: "why-attend",
      },
    ],
  },
  {
    link: "#2",
    label: "exhibitor",
    links: [
      {
        link: "/exhibitor-guideline",
        // label: "Exhibitor Guideline",
        label: "exhibitor-guideline",
      },
      {
        link: "/who-exhibits",
        // label: "Who Exhibits",
        label: "who-exhibits",
      },
      {
        link: "/why-exhibit",
        // label: "Why Exhibit",
        label: "why-exhibit",
      },
      {
        link: "/packages",
        // label: "Packages",
        label: "packages",
      },
    ],
  },
  {
    link: "#3",
    label: "faq",
    links: [
      {
        link: "/faq/general",
        // label: "FAQ General & Technical",
        label: "faq-general",
      },
      {
        link: "/faq/visitor",
        // label: "FAQ Visitor",
        label: "faq-visitor",
      },
      {
        link: "/faq/exhibitor",
        // label: "FAQ Exhibitor",
        label: "faq-exhibitor",
      },
    ],
  },
];
const authLinks = [
  {
    link: "#4",
    label: "register",
    links: [
      {
        link: "/register/phone",
        // label: "Register as Visitor",
        label: "register-as-visitor",
      },
      // {
      //   link: "/register/exhibitor",
      //   // label: "Register as Exhibitor",
      //   label: "register-as-exhibitor",
      // },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  header: {
    height: HEADER_HEIGHT,
    paddingTop: 2,
    [theme.fn.largerThan("sm")]: {
      height: 112,
    },
  },
  inner: {
    height: 56,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  tagline: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
    fontSize: theme.fontSizes.md,
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  sublink: {
    display: "block",
    lineHeight: 1,
    padding: "16px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    "&:hover, &:focus": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[2],
    },
  },

  linkLabel: {
    marginRight: 5,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT + 40,
    left: 0,
    right: 0,
    zIndex: 100,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export interface HeaderSearchProps {
  links: {
    link: string;
    label: string;
    links?: { link: string; label: string }[];
  }[];
}

export function HeaderMenu() {
  const { pathname, push } = useRouter();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { t } = useTranslation("common");
  const largerThanSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);

  const itemsLeft = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Link key={item.link} href={item.link} passHref>
        <Menu.Item className={classes.sublink}>{t(`${item.label}`)}</Menu.Item>
      </Link>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          delay={0}
          transitionDuration={0}
          placement="center"
          gutter={1}
          size="lg"
          control={
            <a
              href={link.link}
              className={classes.link}
              onClick={(e) => e.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{t(`${link.label}`)}</span>
                <ChevronDown size={12} />
              </Center>
            </a>
          }
        >
          {menuItems}
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} passHref>
        <a className={classes.link}>{t(`${link.label}`)}</a>
      </Link>
    );
  });

  const itemsRight = authLinks.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Link key={item.link} href={item.link} passHref>
        <Menu.Item py="md" key={item.link} className={classes.link}>
          {t(`${item.label}`)}
        </Menu.Item>
      </Link>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          delay={0}
          transitionDuration={0}
          placement="end"
          gutter={1}
          control={
            <a
              href={link.link}
              className={classes.link}
              onClick={(e) => e.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{t(`${link.label}`)}</span>
                <ChevronDown size={12} />
              </Center>
            </a>
          }
        >
          {menuItems}
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} passHref>
        <a className={classes.link}>{t(`${link.label}`)}</a>
      </Link>
    );
  });

  const mobileLinks = links.map((item) => (
    <MobileLinksGroup
      mini={false}
      {...item}
      key={item.label}
      active={pathname === item.link}
      initiallyOpened={false}
    />
  ));

  return (
    <>
      {/* <Box
        sx={(theme) => ({
          backgroundColor: theme.colors[theme.primaryColor][6],
        })}
        component={Marquee}
        speed={50}
        gradientColor={[18, 184, 134]}
        gradientWidth={50}
      >
        <Group spacing={150} py={6}>
          <Group>
            <Text weight={500} color="white">
              Welcome to Hospital Engineering Expo 2022
            </Text>
          </Group>
          <Group>
            <Image src="/logo.png" width={30} height={30} alt="Logo" />
            <Text weight={500} color="white">
              Perkumpulan Teknik Perumahsakitan Indonesia
            </Text>
          </Group>
        </Group>
      </Box> */}
      <RunningText showJoinZoom={[11, 18, 25].includes(new Date().getDate())} />
      <Header className={classes.header} height={112}>
        <Container size="xl">
          <div className={classes.inner}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image
                width={largerThanSm ? 42 : 30}
                height={largerThanSm ? 42 : 30}
                style={{ flexShrink: 0 }}
                src="/logo.png"
                alt="Logo HEF"
              />

              <Box ml="md">
                <Text
                  size={largerThanSm ? "xl" : "lg"}
                  weight={700}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {largerThanSm ? t("event-title") : t("event-title-short")}
                </Text>
                <Text mt={-6} size="sm" className={classes.tagline}>
                  {t("event-tagline")}
                </Text>
              </Box>
            </div>
            <Group spacing={4}>
              <LanguagePicker />
              <Burger
                opened={opened}
                onClick={() => toggleOpened()}
                className={classes.burger}
                size="sm"
                ml="sm"
              />
              <Transition transition="scale-y" duration={200} mounted={opened}>
                {(styles) => (
                  <Paper className={classes.dropdown} withBorder style={styles}>
                    {mobileLinks}
                    <Divider mt="sm" />
                    <Box p="md">
                      <SimpleGrid cols={1}>
                        <Button
                          variant="outline"
                          onClick={() => push("/register/phone")}
                        >
                          {t("register-as-visitor")}
                        </Button>
                        {/* <Button
                          variant="outline"
                          onClick={() => push("/register/exhibitor")}
                        >
                          {t("register-as-exhibitor")}
                        </Button> */}
                      </SimpleGrid>
                      <Button mt="sm" fullWidth onClick={() => push("/login")}>
                        {t("login")}
                      </Button>
                    </Box>
                  </Paper>
                )}
              </Transition>
            </Group>
          </div>
          <div className={classes.inner}>
            <Group spacing={theme.spacing.xl * 2} className={classes.links}>
              <Group spacing="xs">{itemsLeft}</Group>
            </Group>
            <Group spacing={5} className={classes.links}>
              {itemsRight}
              <Link href="/login" passHref>
                <Button
                  component="a"
                  styles={{
                    label: {
                      fontSize: theme.fontSizes.md,
                    },
                  }}
                >
                  {t("login")}
                </Button>
              </Link>
            </Group>
          </div>
        </Container>
      </Header>
    </>
  );
}
