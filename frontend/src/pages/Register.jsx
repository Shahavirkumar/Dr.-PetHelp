import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, User, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../utils/validators";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmError = validateConfirmPassword(form.password, form.confirmPassword);

    const firstError = nameError || emailError || passwordError || confirmError;
    if (firstError) {
      setError(firstError);
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.friendlyMessage || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center mb-8">
        <span className="w-12 h-12 rounded-full bg-[#2F6F5E] flex items-center justify-center mb-3">
          <PawPrint className="w-6 h-6 text-white" />
        </span>
        <h1 className="font-[Fraunces,serif] text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-[#4A554E] mt-1">Start giving your pet better everyday care</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#2F6F5E]/10 shadow-sm p-6 flex flex-col gap-4"
      >
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#4A554E]">Full Name</span>
          <div className="flex items-center gap-2 border border-[#2F6F5E]/15 rounded-lg px-3 py-2 focus-within:border-[#2F6F5E]">
            <User className="w-4 h-4 text-[#4A554E]" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Riya Sharma"
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#4A554E]">Email</span>
          <div className="flex items-center gap-2 border border-[#2F6F5E]/15 rounded-lg px-3 py-2 focus-within:border-[#2F6F5E]">
            <Mail className="w-4 h-4 text-[#4A554E]" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#4A554E]">Password</span>
          <div className="flex items-center gap-2 border border-[#2F6F5E]/15 rounded-lg px-3 py-2 focus-within:border-[#2F6F5E]">
            <Lock className="w-4 h-4 text-[#4A554E]" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#4A554E]">Confirm Password</span>
          <div className="flex items-center gap-2 border border-[#2F6F5E]/15 rounded-lg px-3 py-2 focus-within:border-[#2F6F5E]">
            <Lock className="w-4 h-4 text-[#4A554E]" />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 bg-[#2F6F5E] text-white py-2.5 rounded-full font-medium hover:bg-[#255A4B] transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-[#4A554E] mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-[#2F6F5E] font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}