import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ContextMenuDemo from "./components/ContextMenu";
import "./index.css";
export const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withCSSVariables
          theme={{
            colorScheme: "dark",
          }}
        >
          <NotificationsProvider zIndex={1001} />
          <App />
          <ContextMenuDemo />
        </MantineProvider>
        <ReactQueryDevtools position="bottom-right" />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
