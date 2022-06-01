import {
  createStyles,
  keyframes,
  Modal,
  Text,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { useAuth } from "contexts/auth.context";
import { useSocket } from "contexts/socket.context";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { Conversation } from "services/chat/hooks";
import { MessageCircle, Messages } from "tabler-icons-react";
import ChatPanel from "./ChatPanel";

export const pulse = keyframes({
  "from, to": { opacity: 1 },
  "50%": { opacity: 0.8 },
});

const useStyles = createStyles((theme) => ({
  chatButtonContainer: {
    position: "absolute",
  },
  chatButton: {
    width: 65,
    height: 65,
    position: "fixed",
    bottom: 35,
    right: 40,
    borderRadius: 1000,
    backgroundColor: theme.colors[theme.primaryColor][0],
    boxShadow: theme.shadows.xl,
    opacity: 0.8,
    color: theme.colors[theme.primaryColor][7],
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    // border: "4px solid teal",
    cursor: "pointer",
    "&:hover": {
      animation: "none",
      opacity: 1,
    },
  },
  newMessageCount: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: theme.colors["red"][9],
    width: 14,
    height: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    animation: `${pulse} 1s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  },
}));

const ChatButton = () => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [onlineUsers, setOnlineUsers] = useState<
    {
      userId: number;
      socketId: string;
    }[]
  >();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();
  const [isNewMessage, setIsNewMessage] = useState(false);

  useEffect(() => {
    if (user && socket) {
      socket.emit("addUser", user.id);
      socket.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [socket, user]);

  console.log({ socket });

  useEffect(() => {
    socket?.on("getMessage", (data) => {
      queryClient.invalidateQueries(["messages", data.conversationId]);
      queryClient.invalidateQueries(["conversation"]);
      setIsNewMessage(true);
    });
  }, [socket, queryClient]);

  return (
    <>
      <Transition
        mounted={opened}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={styles}>
            <ChatPanel
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              onlineUsers={onlineUsers}
              chatOpened={opened}
            />
          </div>
        )}
      </Transition>
      <div className={classes.chatButtonContainer}>
        <UnstyledButton
          onClick={() => {
            setIsNewMessage(false);
            setOpened((prev) => !prev);
          }}
          className={classes.chatButton}
        >
          {isNewMessage && <div className={classes.newMessageCount}></div>}
          <MessageCircle size={35} />
        </UnstyledButton>
      </div>
    </>
  );
};

export default ChatButton;
