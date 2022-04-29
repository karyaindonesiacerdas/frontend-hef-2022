import { Box, Group, Text, useMantineTheme } from "@mantine/core";
import { Checks } from "tabler-icons-react";
import { format } from "timeago.js";

export type Message = {
  createdAt: string;
  sender: "me" | "you";
  message: string;
  read: boolean;
};

type Props = {
  message: Message;
};

export const Message = ({ message }: Props) => {
  const theme = useMantineTheme();

  return (
    <li
      style={{
        display: "flex",
        justifyContent: message.sender === "me" ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      <Box
        px="md"
        py={4}
        style={{
          background:
            message.sender === "me" ? theme.colors["green"][3] : "white",
          borderRadius: theme.radius.md,
          maxWidth: "80%",
        }}
      >
        <Text size="sm">{message.message}</Text>
        <Group spacing={6}>
          <Text size="xs" color="dimmed" align="right">
            {format(message.createdAt)}
          </Text>
          {message.sender === "me" && (
            <Checks
              size={16}
              color={
                message.read ? theme.colors["blue"][5] : theme.colors["gray"][6]
              }
            />
          )}
        </Group>
      </Box>
    </li>
  );
};
