import { useState, useEffect } from "react";
import { Bookmark, Trash2, Loader2 } from "lucide-react";
import recommendationService from "../services/recommendationService";
import { useToast } from "../context/ToastContext";
import { formatFullDate } from "../utils/formatDate";

const CATEGORY_COLORS = {
  Diet: "bg-[#E8963F]/15 text-[#C05B2D]",
  Grooming: "bg-[#3A6EA5]/15 text-[#3A6EA5]",
  Hygiene: "bg-[#2F6F5E]/15 text-[#2F6F5E]",
  Exercise: "bg-purple-100 text-purple-700",
  Wellness: "bg-pink-100 text-pink-700",
  Symptoms: "bg-red-100 text-red-700",
};

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await recommendationService.getAll();
        setRecommendations(data);
      } catch (err) {
        showToast(err.friendlyMessage || "Could not load saved recommendations.", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await recommendationService.delete(id);
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      showToast("Recommendation deleted.", "info");
    } catch (err) {
      showToast(err.friendlyMessage || "Could not delete recommendation.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-[Fraunces,serif] text-2xl font-semibold mb-6 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#E8963F]" />
          Saved Recommendations
        </h1>

        {loading ? (
          <div className="text-sm text-[#4A554E]">Loading...</div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#2F6F5E]/20 p-10 text-center text-sm text-[#4A554E]">
            No saved recommendations yet. Save useful AI replies from the chat to see them here.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {recommendations.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-[#2F6F5E]/10 p-5 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm">{r.title}</h3>
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="text-red-400 hover:text-red-600 shrink-0"
                    aria-label="Delete recommendation"
                  >
                    {deletingId === r.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full self-start ${
                    CATEGORY_COLORS[r.category] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {r.category}
                </span>
                <p className="text-xs text-[#4A554E] line-clamp-3">{r.content}</p>
                <span className="text-[11px] text-[#4A554E]/70 mt-1">
                  Saved on {formatFullDate(r.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}