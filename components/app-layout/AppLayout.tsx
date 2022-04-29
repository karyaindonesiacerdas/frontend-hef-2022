import React, { useState } from "react";
import {
  Navbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Group,
  Box,
  Menu,
  Avatar,
  Text,
  Modal,
} from "@mantine/core";
import {
  Icon as TablerIcon,
  Home2,
  DeviceDesktopAnalytics,
  CalendarStats,
  User,
  Settings,
  Logout,
  Microphone2,
  ChevronRight,
  Dashboard,
  At,
  Phone,
} from "tabler-icons-react";
import { NextLink } from "@mantine/next";
import { useRouter } from "next/router";
import { useAuth } from "contexts/auth.context";
import { useMe } from "services/user/hooks";
import { getFileUrl } from "utils/file-storage";
import MyBooth from "icons/MyBooth";
import { useLocalStorage } from "@mantine/hooks";
import { ContactIconsList } from "../home/ContactIcons";

const useStyles = createStyles((theme) => ({
  link: {
    marginTop: 10,
    width: 45,
    height: 45,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 7],
    },
  },

  navbar: {
    position: "fixed",
    left: 10,
    background: "rgba( 255, 255, 255, 0.5 )",
    // boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    boxShadow: "0 3px 8px 0 rgba( 0, 0, 0, 0.17 )",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
  },

  user: {
    display: "block",
    paddingBottom: theme.spacing.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    // "&:hover": {
    //   backgroundColor:
    //     theme.colorScheme === "dark"
    //       ? theme.colors.dark[8]
    //       : theme.colors.gray[0],
    // },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  link: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  link,
}: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" withArrow transitionDuration={0}>
      <NextLink
        style={{ textDecoration: "none" }}
        href={link}
        // onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon />
      </NextLink>
    </Tooltip>
  );
}

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

const CONTACT = [
  {
    title: "Email",
    description: "hospital.engineering.expo@gmail.com",
    icon: At,
  },
  { title: "Phone 1", description: "+62 858 9377 7283 (Adrian)", icon: Phone },
  { title: "Phone 2", description: "+62 877 7889 9087 (Jordy)", icon: Phone },
];

export default function AppLayout() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(2);
  const { pathname } = useRouter();
  const { logout, user } = useAuth();
  const { data: me } = useMe();
  const [openInfo, setOpenInfo] = useLocalStorage({
    key: "open",
    defaultValue: "true",
  });

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={pathname === link.link}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <>
      {user?.role === "exhibitor" && (
        <Modal
          centered
          opened={openInfo === "true"}
          onClose={() => setOpenInfo("close")}
          title={
            <Text size="xl" weight={600}>
              Selamat Datang
            </Text>
          }
        >
          <Text mb="lg">
            Anda terdaftar sebagai exhibitor. Hubungi kontak dibawah ini untuk
            pilih paket dan info lebih lanjut. Terima kasih
          </Text>
          <ContactIconsList data={CONTACT} />
        </Modal>
      )}
      <Navbar
        height={"95vh"}
        className={classes.navbar}
        width={{ base: 70 }}
        p="sm"
      >
        <Center>
          <Box
            component="img"
            width={32}
            height={32}
            style={{ flexShrink: 0 }}
            src="/logo.png"
            alt="Logo HEF"
          />
        </Center>
        <Navbar.Section grow mt={50}>
          <Group direction="column" align="center" spacing={0}>
            {links}
            {user?.role === "exhibitor" && (
              <Tooltip
                label="My Booth"
                position="right"
                withArrow
                transitionDuration={0}
              >
                <NextLink
                  style={{ textDecoration: "none" }}
                  href={`/app/exhibitor/${user?.id}`}
                  // onClick={onClick}
                  className={cx(classes.link, {
                    [classes.active]: pathname === `/app/exhibitor/${user?.id}`,
                  })}
                >
                  <MyBooth />
                </NextLink>
              </Tooltip>
            )}
          </Group>
        </Navbar.Section>
        <Navbar.Section>
          {user?.role === "admin" && (
            <NavbarLink
              icon={Dashboard}
              label="Admin Dashboard"
              link="/admin"
            />
          )}
          <Menu
            mt="md"
            style={{ display: "block", width: "100%" }}
            control={
              <UnstyledButton className={classes.user}>
                <Avatar
                  src={getFileUrl(me?.img_profile, "profiles")}
                  radius="xl"
                  size="md"
                  ml={4}
                />
              </UnstyledButton>
            }
            withArrow
            position="right"
          >
            <Menu.Item onClick={logout}>Logout</Menu.Item>
          </Menu>
        </Navbar.Section>
      </Navbar>
    </>
  );
}
