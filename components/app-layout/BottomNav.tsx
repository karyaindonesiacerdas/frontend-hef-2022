import {
  Box,
  Button,
  createStyles,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useAuth } from "contexts/auth.context";
import { useRouter } from "next/router";
import React from "react";
import {
  DeviceDesktopAnalytics,
  DoorExit,
  Home2,
  Microphone2,
  User,
} from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  container: {
    borderTop: "1px solid",
    borderColor: theme.colors[theme.primaryColor][3],
    borderTopRightRadius: theme.radius.lg,
    borderTopLeftRadius: theme.radius.lg,
    backgroundColor: theme.colors[theme.primaryColor][5],
    overflow: "hidden",
  },
}));

// link.link === "/app/enter-exhibitor"
//           ? pathname.includes("exhibitor")
//             ? true
//             : false
//           : pathname.includes(link.link)

const BottomNav = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const pathname = router.pathname;
  const { logout } = useAuth();

  const modals = useModals();

  const openLogoutModal = () =>
    modals.openConfirmModal({
      title: "Logout",
      centered: true,
      children: <Text size="sm">Do you want to logout?</Text>,
      labels: { confirm: "Yes, logout", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => logout(),
    });

  return (
    <Box component="nav" className={classes.container}>
      <SimpleGrid cols={5} spacing={0}>
        <UnstyledButton
          pt="sm"
          pb={6}
          sx={(theme) => ({
            backgroundColor: pathname.includes("/app/main-hall")
              ? theme.colors[theme.primaryColor][7]
              : theme.colors[theme.primaryColor][5],
          })}
          onClick={() => router.push("/app/main-hall")}
        >
          <Stack align="center" spacing={4}>
            <Home2 color="white" />
            <Text size="xs" weight={700} color="white">
              Main Hall
            </Text>
          </Stack>
        </UnstyledButton>
        <UnstyledButton
          pt="sm"
          pb={6}
          onClick={() => router.push("/app/seminar")}
          sx={(theme) => ({
            backgroundColor: pathname.includes("/app/seminar")
              ? theme.colors[theme.primaryColor][7]
              : theme.colors[theme.primaryColor][5],
          })}
        >
          <Stack align="center" spacing={4}>
            <Microphone2 color="white" />
            <Text size="xs" weight={700} color="white">
              Webinar
            </Text>
          </Stack>
        </UnstyledButton>
        <UnstyledButton
          pt="sm"
          pb={6}
          onClick={() => router.push("/app/exhibitor")}
          sx={(theme) => ({
            backgroundColor: pathname.includes("/app/exhibitor")
              ? theme.colors[theme.primaryColor][7]
              : theme.colors[theme.primaryColor][5],
          })}
        >
          <Stack align="center" spacing={4}>
            <DeviceDesktopAnalytics color="white" />
            <Text size="xs" weight={700} color="white">
              Exhibitors
            </Text>
          </Stack>
        </UnstyledButton>
        <UnstyledButton
          pt="sm"
          pb={6}
          onClick={() => router.push("/app/my-account")}
          sx={(theme) => ({
            backgroundColor: pathname.includes("/app/my-account")
              ? theme.colors[theme.primaryColor][7]
              : theme.colors[theme.primaryColor][5],
          })}
        >
          <Stack align="center" spacing={4}>
            <User color="white" />
            <Text size="xs" weight={700} color="white">
              Account
            </Text>
          </Stack>
        </UnstyledButton>
        <UnstyledButton pt="sm" pb={6} onClick={openLogoutModal}>
          <Stack align="center" spacing={4}>
            <DoorExit color="white" />
            <Text size="xs" weight={700} color="white">
              Logout
            </Text>
          </Stack>
        </UnstyledButton>
      </SimpleGrid>
    </Box>
  );
};

export default BottomNav;
