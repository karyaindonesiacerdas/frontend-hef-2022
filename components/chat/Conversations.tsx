import { useState } from "react";
import {
  Avatar,
  createStyles,
  Group,
  Input,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  Box,
  keyframes,
  Center,
} from "@mantine/core";

import { useAuth } from "contexts/auth.context";
import { Conversation } from "services/chat/hooks";

export const pulse = keyframes({
  "from, to": { opacity: 1 },
  "50%": { opacity: 0.8 },
});

const useStyles = createStyles((theme) => ({
  conversationItem: {
    cursor: "pointer",
    "&:hover": {
      cursor: "pointer",
      background: theme.colors["gray"][2],
    },
  },
  onlineIndicator: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: theme.colors["green"][7],
    top: 0,
    right: -2,
    animation: `${pulse} 1s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    border: "2px solid white",
  },
}));

type Props = {
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
  conversations: Conversation[];
  onlineUsers:
    | {
        userId: number;
        socketId: string;
      }[]
    | undefined;
};

export const Conversations = ({
  setSelectedConversation,
  conversations,
  onlineUsers,
}: Props) => {
  const { classes } = useStyles();
  const [query, setQuery] = useState("");
  const { user } = useAuth();

  const formattedConversations = conversations.map(
    (conversation) =>
      conversation.members.filter((member) => member.id !== user?.id)[0]
  );

  console.log({ formattedConversations });

  return (
    <div>
      <Text size="lg" weight={600} align="center">
        HEF Chat
      </Text>
      <Input
        aria-label="search"
        placeholder="Search"
        variant="filled"
        my="sm"
        radius="md"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
      />

      <ScrollArea style={{ height: 360 }}>
        {conversations?.filter((conversation) =>
          conversation.members
            .filter((member) => member.id !== user?.id)[0]
            .name.toLowerCase()
            .includes(query.toLocaleLowerCase())
        ).length === 0 && (
          <Center sx={{ height: 300 }}>
            <Stack align="center" spacing={4}>
              <Text color="dimmed">Conversation list is empty</Text>
              <Text color="dimmed" size="xs">
                Visit virtual booth and add exhibitor&apos;s contact
              </Text>
            </Stack>
          </Center>
        )}
        <Stack spacing={2}>
          {conversations
            ?.filter((conversation) =>
              conversation.members
                .filter((member) => member.id !== user?.id)[0]
                .name.toLowerCase()
                .includes(query.toLocaleLowerCase())
            )
            ?.map((conversation) => (
              <UnstyledButton
                key={conversation._id}
                className={classes.conversationItem}
                p="xs"
                // onClick={() => setSelectedChat(chat)}
                onClick={() => setSelectedConversation(conversation)}
              >
                <Group>
                  <div style={{ position: "relative" }}>
                    <Avatar
                      src={
                        conversation.members.filter(
                          (member) => member.id !== user?.id
                        )[0].img_profile
                      }
                      radius="xl"
                    />
                    {onlineUsers?.find(
                      (onlineUser) =>
                        onlineUser.userId ===
                        conversation.members.filter(
                          (member) => member.id !== user?.id
                        )[0].id
                    ) ? (
                      <Box className={classes.onlineIndicator} />
                    ) : null}
                  </div>
                  <Stack spacing={0}>
                    <Text weight={500}>
                      {
                        conversation.members.filter(
                          (member) => member.id !== user?.id
                        )[0].name
                      }
                    </Text>
                    <Text size="sm" mt={-6} color="dimmed">
                      {
                        conversation.members.filter(
                          (member) => member.id !== user?.id
                        )[0].email
                      }
                    </Text>
                  </Stack>
                </Group>
              </UnstyledButton>
            ))}
        </Stack>
      </ScrollArea>
    </div>
  );
};
