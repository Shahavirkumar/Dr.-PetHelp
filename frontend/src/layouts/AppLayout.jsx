import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * Wraps all "inside the app" pages with the Navbar.
 * isAuthenticated / onLogout will come from AuthContext once it's built.
 */
export default function AppLayout({ isAuthenticated = true, onLogout }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}