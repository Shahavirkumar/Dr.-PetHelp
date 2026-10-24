import { Sparkles } from "lucide-react";

const DEFAULT_QUESTIONS = [
  "My dog is not eating. What should I check?",
  "What food is good for my cat?",
  "How often should I bathe my puppy?",
  "My pet is vomiting. What should I do?",
  "How can I keep my pet clean and fresh?",
];

export default function SuggestedQuestions({ questions = DEFAULT_QUESTIONS, onSelect }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex items-center gap-2 text-[#2F6F5E]">
        <Sparkles className="w-5 h-5" />
        <span className="font-[Fraunces,serif] font-semibold">Try asking</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect?.(q)}
            className="text-sm text-[#1F2A24] bg-white border border-[#2F6F5E]/15 rounded-full px-4 py-2 hover:border-[#2F6F5E]/40 hover:bg-[#2F6F5E]/5 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}