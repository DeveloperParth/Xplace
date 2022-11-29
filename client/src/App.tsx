import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
function App() {
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
