import { Outlet, Navigate } from "react-router-dom";
import { PawPrint } from "lucide-react";

export default function AuthLayout({ isAuthenticated = false }) {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col">
      {/* Minimal top bar, just the logo — no full Navbar on auth pages */}
      <header className="px-6 py-5">
        <div className="flex items-center gap-2 max-w-6xl mx-auto">
          <span className="w-9 h-9 rounded-full bg-[#2F6F5E] flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </span>
          <span className="font-[Fraunces,serif] text-lg font-semibold">
            PetHelp <span className="text-[#2F6F5E]">AI</span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}