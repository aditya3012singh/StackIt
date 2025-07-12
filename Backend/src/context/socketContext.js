import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    socketRef.current = io("http://localhost:4000", {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
