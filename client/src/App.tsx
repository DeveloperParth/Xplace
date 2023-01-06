import { Route, Routes, Navigate } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import { io } from "socket.io-client";
import { useEffect } from "react";
import { useAuth } from "./store/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Box } from "@mantine/core";
import InvitationPage from "./pages/InvitationPage";
import ServerPage from "./pages/ServerPage";
import { useServer } from "./store/useServer";
import { Message } from "./types";
import { showNotification } from "@mantine/notifications";

export const socket = io(import.meta.env.VITE_API_URL as string, {
  auth: {
    token: useAuth?.getState().token,
  },
});
function App() {
  const queryClient = useQueryClient();
  const { user, status } = useAuth((state) => state);
  const setMembers = useServer((state) => state.setMembers);
  const setMessages = useServer((state) => state.setMessages);
  const server = useServer((state) => state.server);
  console.log("🚀 ~ file: App.tsx:31 ~ App ~ server", server);
  const currentChannel = useServer((state) => state.currentChannel);
  useEffect(() => {
    if (user?.id) socket.emit("join", { status });
    socket.on("message", (message: Message) => {
      if (message.userId === user?.id) return;
      if (message.serverId !== server?.id) {
        return showNotification({
          title: message.user.name,
          message: message.text,
          color: "teal",
        });
      }
      if (message.channelId !== currentChannel?.id) {
        return showNotification({
          title: message.user.name,
          message: message.text,
          color: "teal",
        });
      }
      setMessages((messages) => [...messages, message]);
    });
    socket.on("members", (data) => {
      setMembers(data);
    });
    socket.on("status", (data) => {
      queryClient.invalidateQueries(["members"]);
    });

    return () => {
      socket.off("message");
      socket.off("members");
      socket.off("status");
    };
  }, [socket, server]);

  return (
    <>
      <Box
        sx={(theme) => ({
          display: "flex",
          maxHeight: "100vh",
          overflow: "hidden",
        })}
      >
        {user && <Sidebar />}
        <Box
          sx={(theme) => ({
            width: "100%",
            overflowY: "auto",
            display: "flex",
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          })}
        >
          <Routes>
            <Route
              path="/channels/@me"
              element={
                <ProtectedRoute>
                  <h1> Home </h1>
                </ProtectedRoute>
              }
            />
            <Route
              path="/channels/:serverId/:channelId"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/server/:id/settings"
              element={
                <ProtectedRoute>
                  <ServerPage />
                </ProtectedRoute>
              }
            />
            <Route path="/i/:code" element={<InvitationPage />} />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              }
            />
            {/* <Route
              path="*"
              element={
                <Navigate to="/channels/@me" />
              }
            /> */}
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
