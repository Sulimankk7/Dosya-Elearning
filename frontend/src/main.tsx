import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./app/routes";
import { useEffect } from "react";
import { API_URL } from "./config/api";
import "./styles/index.css";

function AppWarmup() {
  useEffect(() => {
    fetch(`${API_URL}/health`, { credentials: "omit" }).catch(() => {});
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AppWarmup />
    <RouterProvider router={router} />
  </AuthProvider>
);