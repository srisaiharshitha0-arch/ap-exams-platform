import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPanel from "./pages/AdminPanel";
import ExamsPage from "./pages/ExamsPage";


import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <div className="main-content">
          <Routes>

          {/* HOME PAGE */}
          <Route path="/" element={<HomePage />} />

          {/* EXAMS PAGE */}
            <Route path="/exams" element={<ExamsPage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </div>

        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;