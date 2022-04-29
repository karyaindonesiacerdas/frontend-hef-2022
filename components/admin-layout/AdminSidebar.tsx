import React from "react";
import { useRouter } from "next/router";
import {
  Navbar,
  ScrollArea,
  createStyles,
  ActionIcon,
  Text,
  Box,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  Gauge,
  Adjustments,
  Users,
  Presentation,
  Video,
  ChartDots,
  CalendarEvent,
  MessageCircle,
  ChevronsRight,
  ChevronsLeft,
  Award,
  FileText,
  World,
} from "tabler-icons-react";

import { UserButton } from "./UserButton";
import { LinksGroup } from "./NavbarLinksGroup";
import { useAuth } from "contexts/auth.context";

const mockdata = [
  { label: "Dashboard", icon: Gauge, link: "/admin/dashboard" },
  { label: "Analytics", icon: ChartDots, link: "/admin/analytics" },
  { label: "Exhibitor", icon: Presentation, link: "/admin/exhibitor" },
  {
    label: "Visitor",
    icon: Users,
    links: [
      { label: "Booth Visitor", link: "/admin/visitor/booth" },
      { label: "Visitor Info", link: "/admin/visitor/info" },
    ],
  },
  { label: "Consultation", icon: Video, link: "/admin/consultation" },
  { label: "Webinar", icon: CalendarEvent, link: "/admin/webinar" },
  { label: "Sponsor", icon: Award, link: "/admin/sponsor" },
  { label: "Blog", icon: FileText, link: "/admin/blog" },
  // { label: "Chat", icon: MessageCircle, link: "/admin/chat" },
  {
    label: "Settings",
    icon: Adjustments,
    links: [
      { label: "App Settings", link: "/admin/settings/app-settings" },
      { label: "Reset Password", link: "/admin/settings/reset-password" },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    maxWidth: 260,
    transition: "all 0.1s",
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    // paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export default function AdminSidebar() {
  const { classes } = useStyles();
  const { user } = useAuth();
  const [mini, setMini] = useLocalStorage({ key: "mini", defaultValue: false });
  const { pathname } = useRouter();

  const links = mockdata.map((item) => (
    <LinksGroup
      mini={mini}
      {...item}
      key={item.label}
      active={pathname === item.link}
      initiallyOpened={pathname.includes(item.label.toLocaleLowerCase())}
    />
  ));

  return (
    <Navbar
      p="md"
      className={classes.navbar}
      style={{
        width: mini ? 65 : 240,
      }}
    >
      <Navbar.Section className={classes.header}>
        <Box style={{ display: "flex" }}>
          {/* <LogoSmall style={{ flexShrink: 0 }} /> */}
          <Box
            component="img"
            width={32}
            height={32}
            style={{ flexShrink: 0 }}
            src="/logo.png"
            alt="Logo HEF"
          />

          <Text
            hidden={mini}
            size="xl"
            ml="md"
            weight={700}
            style={{ whiteSpace: "nowrap" }}
          >
            HEF 2022
          </Text>
        </Box>
      </Navbar.Section>

      <ActionIcon
        mt="md"
        mb="sm"
        variant="light"
        color="orange"
        onClick={() => setMini((prev) => !prev)}
      >
        {mini ? <ChevronsRight /> : <ChevronsLeft />}
      </ActionIcon>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton
          image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
          name={user?.name || ""}
          email={user?.email || ""}
          mini={mini}
        />
      </Navbar.Section>
    </Navbar>
  );
}
