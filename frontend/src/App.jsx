import { Routes, Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import PetProfile from "./pages/PetProfile";
import Recommendations from "./pages/Recommendations";

import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#4A554E] bg-[#FAF8F3]">
        Loading PetHelp AI...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<AuthLayout isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<AppLayout isAuthenticated={isAuthenticated} onLogout={logout} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/pets/new" element={<PetProfile />} />
        <Route path="/pets/:id" element={<PetProfile />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-[#FAF8F3] text-center px-6">
      <h1 className="font-[Fraunces,serif] text-3xl font-semibold">404</h1>
      <p className="text-sm text-[#4A554E]">This page doesn't exist.</p>
    </div>
  );
}