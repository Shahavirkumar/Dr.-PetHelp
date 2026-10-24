// Re-exports the useAuth hook from AuthContext, so all components
// can import from a consistent "hooks" location instead of reaching
// into context/ directly.
export { useAuth } from "../context/AuthContext";