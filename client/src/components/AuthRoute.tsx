import React, { Component, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

function AuthRoute({ children }: { children: React.ReactElement }) {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  useEffect(() => {
    if (user) {
      return navigate("/", { replace: true });
    }
  }, [user, navigate]);
  return children;
}

export default AuthRoute;
