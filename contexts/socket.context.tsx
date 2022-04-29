import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";

import { useSettings } from "services/settings/hooks";
import newMessageSound from "@/components/chat/newMessageSound";

type SocketContextProps = {
  socket?: Socket;
  isNewMessageCome: boolean;
  setIsNewMessageCome: Dispatch<SetStateAction<boolean>>;
  // totalOnlineUsers: number;
};

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:5000";

// Context
const SocketContext = createContext<SocketContextProps>({
  isNewMessageCome: false,
  setIsNewMessageCome: () => {},
  // totalOnlineUsers: 0,
});

// Custom hooks
export const useSocket = () => {
  return useContext(SocketContext);
};

// Provider
export const SocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<Socket>();
  const [isNewMessageCome, setIsNewMessageCome] = useState(false);
  // const [totalOnlineUsers, setTotalOnlineUsers] = useState<number>(0);

  const { data } = useSettings();

  // Initialize Socket Connection
  useEffect(() => {
    let newSocket: Socket;

    if (data?.is_chat === "1") {
      newSocket = io(SOCKET_URL);
      setSocket(newSocket);
    }

    return () => {
      newSocket?.close();
    };
  }, [data?.is_chat]);

  // Sound notification when get a message
  useEffect(() => {
    socket?.on("getMessage", (data) => {
      newMessageSound("anonymous");
      setIsNewMessageCome(true);
    });
  }, [socket]);

  // useEffect(() => {
  //   socket?.on("getUsers", (data) => {
  //     setTotalOnlineUsers(data.length);
  //   });
  // }, [socket]);

  // console.log({ totalOnlineUsers });

  return (
    <SocketContext.Provider
      value={{
        socket,
        isNewMessageCome,
        setIsNewMessageCome,
        // totalOnlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
