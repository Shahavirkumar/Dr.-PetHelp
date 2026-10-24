import { Link } from "react-router-dom";
import { PawPrint, MessageCircle, Plus, Bookmark, Clock } from "lucide-react";
import PetCard from "../components/PetCard";

// Placeholder data — will come from petService / chatService in later step
const mockPets = [
  { id: "1", name: "Bruno", species: "Dog", breed: "Labrador", age: 2 },
  { id: "2", name: "Milo", species: "Cat", breed: "Persian", age: 1 },
];

const mockConversations = [
  { id: "c1", title: "Bruno not eating well", updatedAt: "2 hours ago" },
  { id: "c2", title: "Milo grooming routine", updatedAt: "Yesterday" },
];

const mockRecommendations = [
  { id: "r1", title: "Best diet for Labradors", category: "Diet" },
  { id: "r2", title: "Bathing frequency for kittens", category: "Grooming" },
];

export default function Dashboard() {
  const userName = "Riya"; // TODO: pull from AuthContext

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-[Fraunces,serif] text-2xl sm:text-3xl font-semibold">
              Welcome back, {userName} 👋
            </h1>
            <p className="text-sm text-[#4A554E] mt-1">
              Here's what's happening with your pets today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/chat"
              className="flex items-center gap-2 bg-[#2F6F5E] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#255A4B]"
            >
              <MessageCircle className="w-4 h-4" />
              Quick Ask AI
            </Link>
            <Link
              to="/pets/new"
              className="flex items-center gap-2 bg-white border border-[#2F6F5E]/20 px-4 py-2.5 rounded-full text-sm font-medium hover:border-[#2F6F5E]/50"
            >
              <Plus className="w-4 h-4" />
              Add Pet
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pets */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-[#2F6F5E]" /> Your Pets
              </h2>
              {mockPets.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-[#2F6F5E]/20 p-8 text-center text-sm text-[#4A554E]">
                  No pets added yet. Add your first pet to get personalized guidance.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {mockPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent conversations */}
            <div>
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3A6EA5]" /> Recent Conversations
              </h2>
              <div className="bg-white rounded-2xl border border-[#2F6F5E]/10 divide-y divide-[#2F6F5E]/10">
                {mockConversations.map((c) => (
                  <Link
                    key={c.id}
                    to={`/chat/${c.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[#2F6F5E]/5 text-sm"
                  >
                    <span>{c.title}</span>
                    <span className="text-xs text-[#4A554E]">{c.updatedAt}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Saved recommendations */}
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#E8963F]" /> Saved Recommendations
            </h2>
            <div className="bg-white rounded-2xl border border-[#2F6F5E]/10 p-4 space-y-3">
              {mockRecommendations.map((r) => (
                <div key={r.id} className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{r.title}</span>
                  <span className="text-xs text-[#4A554E]">{r.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}