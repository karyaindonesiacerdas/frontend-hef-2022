import React from "react";
import {
  UnstyledButton,
  UnstyledButtonProps,
  Avatar,
  Text,
  createStyles,
  Box,
  Menu,
} from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import { useAuth } from "contexts/auth.context";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
  mini: boolean;
}

export function UserButton({
  image,
  name,
  email,
  icon,
  mini,
  ...others
}: UserButtonProps) {
  const { classes } = useStyles();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Menu
      style={{ display: "block", width: "100%" }}
      control={
        <UnstyledButton className={classes.user} {...others}>
          <Box style={{ display: "flex" }}>
            <Avatar src={image} radius="xl" mr="md" />

            {!mini && (
              <>
                <div style={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {name}
                  </Text>

                  <Text color="dimmed" size="xs">
                    {email}
                  </Text>
                </div>

                {icon || <ChevronRight size={14} />}
              </>
            )}
          </Box>
        </UnstyledButton>
      }
      withArrow
      position="right"
    >
      <Menu.Item onClick={() => router.push("/app")}>Web Client</Menu.Item>
      <Menu.Item>My Account</Menu.Item>
      <Menu.Item onClick={logout}>Logout</Menu.Item>
    </Menu>
  );
}
