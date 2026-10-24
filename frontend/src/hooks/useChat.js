// Re-exports the useChat hook from ChatContext, so all components
// can import from a consistent "hooks" location instead of reaching
// into context/ directly.
export { useChat } from "../context/ChatContext";