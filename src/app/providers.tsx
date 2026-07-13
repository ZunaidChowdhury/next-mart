"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./theme-provider";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          {children}
          <ToastContainer position="bottom-right" theme="dark" />
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
