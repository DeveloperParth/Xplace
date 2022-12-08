import { Route, Routes } from "react-router-dom";
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

const socket = io(import.meta.env.VITE_API_URL as string);
function App() {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);
  useEffect(() => {
    user?.id && socket.emit("join", user?.id);
    socket.on("message", () => {
      queryClient.invalidateQueries(["messages"]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);
  return (
    <>
      <div className="flex w-full">
        {user && <Sidebar />}
        <Box
          sx={(theme) => ({
            width: "100%",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          })}
        >
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
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
          </Routes>
        </Box>
      </div>
    </>
  );
}

export default App;
