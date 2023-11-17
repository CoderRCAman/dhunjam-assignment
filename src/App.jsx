import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthProvider from "./store/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoutes/ProtectedRoutes";
import { Toaster } from "react-hot-toast";
import { AuthRoutes } from "./AuthRoutes/AuthRoutes";
export default function App() {
  return (
    <Router>
      <Toaster />
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoutes>
                <Login />
              </AuthRoutes>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
