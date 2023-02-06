import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ContextMenuDemo from "./components/ContextMenu";
import "./index.css";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

            colors: {
              discord: ["#202225", "#2f3136", "#36393f"],
            },
          }}
        >
          <NotificationsProvider zIndex={1001} />
          <ContextMenuDemo />
          <ModalsProvider
            modalProps={{
              zIndex: 1000,
            }}
          >
            <App />
          </ModalsProvider>
        </MantineProvider>
        <ReactQueryDevtools position="bottom-right" />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
