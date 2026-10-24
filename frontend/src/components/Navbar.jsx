import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PawPrint, Menu, X, LogOut } from "lucide-react";

export default function Navbar({ isAuthenticated = false, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/chat", label: "Chat" },
    { to: "/pets", label: "My Pets" },
  ];

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F3]/90 backdrop-blur border-b border-[#2F6F5E]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-[#2F6F5E] flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </span>
          <span className="font-[Fraunces,serif] text-lg font-semibold text-[#1F2A24]">
            PetHelp <span className="text-[#2F6F5E]">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated &&
            links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#2F6F5E]"
                      : "text-[#4A554E] hover:text-[#2F6F5E]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-[#4A554E] hover:text-[#C05B2D] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#4A554E] hover:text-[#2F6F5E]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-[#2F6F5E] text-white px-4 py-2 rounded-full hover:bg-[#255A4B] transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#1F2A24]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-[#FAF8F3] border-t border-[#2F6F5E]/10">
          {isAuthenticated ? (
            <>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-[#4A554E] py-2"
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="text-left text-sm font-medium text-[#C05B2D] py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-sm">
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="bg-[#2F6F5E] text-white text-center py-2 rounded-full text-sm font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}