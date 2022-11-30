import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import { io } from "socket.io-client";
import { useEffect } from "react";
import { useAuth } from "./store/useAuth";

const socket = io("http://localhost:3000");
function App() {
  const user = useAuth((state) => state.user);
  useEffect(() => {
    user?.id && socket.emit("join", user?.id);
  }, [socket]);
  return (
    <>
      <div className="flex dark:text-gray-200 dark:bg-neutral-900">
        <Sidebar />
        <div className="w-full">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
