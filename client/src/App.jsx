import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Welcome from "./pages/Welcome";

const App = () => {
  return (
    <UIProvider>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='app' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Welcome />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          </Route>

          <Route path='view/:resumeId' element={<Preview />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='reset-password/:token' element={<ResetPassword />} />

        </Routes>
      </AuthProvider>
    </UIProvider>
  )
}

export default App