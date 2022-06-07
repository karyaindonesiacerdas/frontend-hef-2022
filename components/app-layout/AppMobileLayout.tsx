import {
  Box,
  Burger,
  createStyles,
  Group,
  Paper,
  Transition,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useBooleanToggle, useLocalStorage } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import {
  DeviceDesktopAnalytics,
  Home2,
  Microphone2,
  User,
} from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  dropdown: {
    position: "absolute",
    top: 46,
    left: 0,
    right: 0,
    zIndex: 100,
    // borderTopRightRadius: 0,
    // borderTopLeftRadius: 0,
    // borderTopWidth: 0,
    // overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.md,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.colors[theme.primaryColor][1],
    },
  },
}));

const mockdata = [
  { icon: Home2, label: "Main Hall", link: "/app/main-hall" },
  { icon: Microphone2, label: "Seminar", link: "/app/seminar" },
  {
    icon: DeviceDesktopAnalytics,
    label: "Exhibitor",
    link: "/app/enter-exhibitor",
  },
  // {
  //   icon: CalendarStats,
  //   label: "Webinar Schedule",
  //   link: "/app/webinar-schedule",
  // },
  { icon: User, label: "Account", link: "/app/my-account" },
  // { icon: Settings, label: "Settings", link: "/app/settings" },
];

const AppMobileLayout = () => {
  const { pathname } = useRouter();
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [value, setValue] = useLocalStorage({
    key: "skip-enter",
    defaultValue: false,
  });
  const { t } = useTranslation("common");

  const links = mockdata.map((link) => {
    if (value === true && link.label === "Exhibitor") {
      return {
        ...link,
        link: "/app/exhibitor",
      };
    } else {
      return link;
    }
  });

  const mobileLinks = links.map((item) => {
    const Icon = item.icon;
    return (
      <NextLink
        key={item.label}
        style={{
          textDecoration: "none",
          padding: theme.spacing.sm,
        }}
        href={item.link}
        className={cx(classes.control, {
          [classes.active]: pathname === item.link,
        })}
      >
        <Group position="apart" spacing={0} py={0}>
          <Box sx={{ display: "flex", alignItems: "center" }} py={0}>
            <Icon />
            <Box ml="md" p={0}>
              {t(`${item.label}`)}
            </Box>
          </Box>
        </Group>
      </NextLink>
    );
  });

  return (
    <>
      <UnstyledButton
        onClick={() => toggleOpened()}
        sx={{
          backgroundColor: "white",
          background: "rgba( 255, 255, 255, 0.5 )",
          // boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
          boxShadow: "0 3px 8px 0 rgba( 0, 0, 0, 0.17 )",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          borderRadius: "10px",
          border: "1px solid rgba( 255, 255, 255, 0.18 )",
        }}
        p={4}
      >
        <Box
          component="img"
          width={32}
          height={32}
          style={{ flexShrink: 0 }}
          src="/logo.png"
          alt="Logo HEF"
        />
      </UnstyledButton>

      <Transition transition="scale-y" duration={200} mounted={opened}>
        {(styles) => (
          <Paper
            className={classes.dropdown}
            withBorder
            style={{ ...styles, width: "95vw" }}
          >
            {mobileLinks}
          </Paper>
        )}
      </Transition>
    </>
  );
};

export default AppMobileLayout;
