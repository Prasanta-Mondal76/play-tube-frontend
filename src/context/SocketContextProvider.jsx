import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LoginContext } from "./LoginContextProvider";

const SocketContext = createContext();

export function SocketContextProvider({ children }) {
  const { user, isLogIn } = useContext(LoginContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isLogIn || !user?._id) return;

    const s = io(import.meta.env.VITE_API_BASE_URL, {
      query: { userId: user._id },
      withCredentials: true,
    });

    setSocket(s);
    return () => s.disconnect();
  }, [isLogIn, user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);