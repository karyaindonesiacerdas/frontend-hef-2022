import { createStyles } from "@mantine/core";
import { useAuth } from "contexts/auth.context";
import React, { useEffect, useState } from "react";
import { Conversation, useConversation } from "services/chat/hooks";
import { Chat } from "./Chat";
import { Conversations } from "./Conversations";

const useStyles = createStyles((theme) => ({
  chatPanelContainer: {
    position: "fixed",
    bottom: "17%",
    right: "2.45%",
    maxWidth: "400px",
    width: "100%",
    height: "100%",
    maxHeight: 500,
    paddingTop: 50,
    paddingBottom: 50,
  },
  chatPanel: {
    maxWidth: "400px",
    width: "100%",
    height: "100%",
    maxHeight: 500,
    background: "white",
    // boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    boxShadow: "2px 4px 12px 2px rgba( 0, 0, 0, 0.17 )",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    padding: theme.spacing.md,
    position: "fixed",
  },
}));

type Props = {
  onlineUsers:
    | {
        userId: number;
        socketId: string;
      }[]
    | undefined;
  selectedConversation: Conversation | undefined;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
  chatOpened: boolean;
};

const ChatPanel = ({
  onlineUsers,
  selectedConversation,
  setSelectedConversation,
  chatOpened,
}: Props) => {
  const { user } = useAuth();
  const { classes } = useStyles();

  const { data: conversations, isLoading } = useConversation(String(user?.id));

  if (isLoading) return null;

  return (
    <div className={classes.chatPanelContainer}>
      <div className={classes.chatPanel}>
        {selectedConversation ? (
          <Chat
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            chatOpened={chatOpened}
          />
        ) : (
          <Conversations
            setSelectedConversation={setSelectedConversation}
            conversations={conversations || []}
            onlineUsers={onlineUsers}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
