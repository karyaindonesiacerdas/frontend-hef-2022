import {
  createStyles,
  keyframes,
  Modal,
  Text,
  Tooltip,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { useAuth } from "contexts/auth.context";
import { useSocket } from "contexts/socket.context";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { createConversation } from "services/chat/conversation";
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
    // backgroundColor: theme.colors[theme.primaryColor][0],
    backgroundColor: theme.colors["gray"][0],
    boxShadow: theme.shadows.xl,
    opacity: 0.8,
    color: theme.colors["gray"][4],
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
    [theme.fn.smallerThan("sm")]: {
      bottom: 80,
      right: 20,
    },
  },
  active: {
    backgroundColor: theme.colors[theme.primaryColor][0],
    color: theme.colors[theme.primaryColor][7],
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

const ChatButton = ({ exhibitor }: { exhibitor: any }) => {
  const { classes, cx } = useStyles();
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
  const notifications = useNotifications();
  const [isLoadingAddContact, setIsLoadingAddContact] = useState(false);

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

  const emailAndNameSet = !!user?.name && !!user?.email;

  const handleAddContact = async () => {
    if (!user?.id || !exhibitor?.id) return;

    setIsLoadingAddContact(true);
    try {
      await createConversation({
        sender: {
          id: user?.id,
          email: user?.email || "No name",
          name: user?.name || "No email",
          img_profile:
            user?.img_profile && user?.img_profile !== "undefined"
              ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/profiles/${user?.img_profile}`
              : `https://ui-avatars.com/api/?name=${user?.name}`,
        },
        receiver: {
          id: exhibitor?.id,
          email: exhibitor?.email,
          name: exhibitor?.company_name,
          img_profile: exhibitor?.company_logo
            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/companies/${exhibitor?.company_logo}`
            : `https://ui-avatars.com/api/?name=${exhibitor?.company_name}`,
        },
      });
      await queryClient.invalidateQueries("conversation");
      setIsLoadingAddContact(false);
      // notifications.showNotification({
      //   title: "Success",
      //   message: "Contact added!",
      //   color: "green",
      // });
    } catch (error: any) {
      setIsLoadingAddContact(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error add contact",
        color: "red",
      });
    }
  };

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
      {/* className={cx(classes.link, { [classes.active]: active })} */}
      <div className={classes.chatButtonContainer}>
        <UnstyledButton
          onClick={async () => {
            if (emailAndNameSet) {
              if (
                user?.role === "visitor" &&
                user?.id !== exhibitor?.id &&
                !opened
              ) {
                await handleAddContact();
              }
              setIsNewMessage(false);
              setOpened((prev) => !prev);
            }
          }}
          className={cx(classes.chatButton, {
            [classes.active]: emailAndNameSet,
          })}
          // disabled={!emailAndNameSet}
        >
          {isNewMessage && <div className={classes.newMessageCount}></div>}
          {emailAndNameSet ? (
            <MessageCircle size={35} />
          ) : (
            <Tooltip label={"Complete your identity to enable chat"}>
              <MessageCircle size={35} />
            </Tooltip>
          )}
        </UnstyledButton>
      </div>
    </>
  );
};

export default ChatButton;
