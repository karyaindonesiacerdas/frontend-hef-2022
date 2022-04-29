import { Fragment, useEffect, useRef } from "react";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Input,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { ArrowLeft, Send } from "tabler-icons-react";

import { useAuth } from "contexts/auth.context";
import { Conversation, useInfiniteMessages } from "services/chat/hooks";
import { useForm } from "@mantine/form";
import { addMessage, AddMessagePayload } from "services/chat/messages";
import { useNotifications } from "@mantine/notifications";
import { useQueryClient } from "react-query";
import { useSocket } from "contexts/socket.context";
import { Message } from "./Message";

type ChatProps = {
  selectedConversation: Conversation;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
  chatOpened: boolean;
};

export const Chat = ({
  selectedConversation,
  setSelectedConversation,
  chatOpened,
}: ChatProps) => {
  const { user } = useAuth();
  const theme = useMantineTheme();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);

  const you = selectedConversation.members.filter(
    (member) => member.id !== user?.id
  )[0];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    socket?.emit("readMessage", {
      conversationId: selectedConversation._id,
      receiverId: you.id,
    });
  }, [socket, selectedConversation._id, you.id]);

  useEffect(() => {
    socket?.on("messageRead", (data) => {
      queryClient.invalidateQueries(["messages", data.conversationId]);
    });
  }, [socket, queryClient]);

  useEffect(() => {
    if (chatOpened) {
      socket?.on("getMessage", (data) => {
        queryClient.invalidateQueries(["messages", data.conversationId]);
      });
    }
  }, [socket, queryClient, you.id, chatOpened]);

  const form = useForm({
    initialValues: {
      text: "",
    },
  });

  const { data, hasNextPage, fetchNextPage } = useInfiniteMessages(
    selectedConversation?._id
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  });

  const handleReadMessage = () => {
    socket?.emit("readMessage", {
      conversationId: selectedConversation._id,
      receiverId: you.id,
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!selectedConversation || !user?.id || !form.values.text) return;

    const payload: AddMessagePayload = {
      conversationId: selectedConversation._id,
      sender: user?.id,
      text: values.text,
    };

    try {
      const data = await addMessage(payload);
      socket?.emit("sendMessage", {
        _id: data._id,
        conversationId: data.conversationId,
        senderId: data.sender,
        receiverId: you.id,
        text: data.text,
        cretedAt: data.createdAt,
      });
      await queryClient.invalidateQueries([
        "messages",
        selectedConversation._id,
      ]);
      form.setValues({ text: "" });
    } catch (error: any) {
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error send message",
        color: "red",
      });
    }
  };

  return (
    <div onClick={handleReadMessage}>
      <Group>
        <ActionIcon onClick={() => setSelectedConversation(undefined)}>
          <ArrowLeft />
        </ActionIcon>
        <Avatar src={you.img_profile} radius="xl" />
        <Stack spacing={0}>
          <Text weight={500}>{you.name}</Text>
          <Text size="sm" mt={-6} color="dimmed">
            {you.email}
          </Text>
        </Stack>
      </Group>
      <ScrollArea
        style={{
          height: 375,
          background: theme.colors["gray"][1],
          marginTop: 10,
          marginBottom: 10,
          borderRadius: theme.radius.md,
        }}
      >
        {hasNextPage && (
          <Group position="center" mt={4}>
            <Button
              disabled={!hasNextPage}
              onClick={() => fetchNextPage()}
              size="xs"
              variant="subtle"
            >
              Load More
            </Button>
          </Group>
        )}
        <ul style={{ padding: 0 }}>
          <Stack spacing="xs" px="sm">
            {data?.pages
              ?.slice(0)
              ?.reverse()
              ?.map((group, i) => (
                <Fragment key={i}>
                  {group.map((message) => (
                    <Message
                      key={message._id}
                      message={{
                        message: message.text,
                        createdAt: message.createdAt,
                        sender: message.sender === you.id ? "you" : "me",
                        read: message.read,
                      }}
                    />
                  ))}
                </Fragment>
              ))}
            {/* {messages?.map((message) => (
              <Message
                key={message._id}
                message={{
                  message: message.text,
                  createdAt: message.createdAt,
                  sender: message.sender === you.id ? "you" : "me",
                  read: message.read,
                }}
              />
            ))} */}
          </Stack>
        </ul>
        <div ref={messageEndRef} />
      </ScrollArea>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group mt="xs" align="center">
          <Input
            ref={inputRef}
            style={{ flex: 1 }}
            aria-label="new message"
            placeholder="type your message"
            variant="filled"
            radius="md"
            {...form.getInputProps("text")}
          />
          <ActionIcon
            color={theme.colors[theme.primaryColor][6]}
            variant="light"
            size="lg"
          >
            <Send />
          </ActionIcon>
        </Group>
      </form>
    </div>
  );
};
