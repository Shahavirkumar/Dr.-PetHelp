import { Dog, Cat, Bird, Rabbit, Fish, PawPrint, Pencil, Trash2 } from "lucide-react";

const speciesIcon = {
  Dog: Dog,
  Cat: Cat,
  Bird: Bird,
  Rabbit: Rabbit,
  Fish: Fish,
};

/**
 * pet = { id, name, species, breed, age, weight }
 */
export default function PetCard({ pet, onEdit, onDelete, onClick }) {
  const Icon = speciesIcon[pet.species] || PawPrint;

  return (
    <div
      onClick={() => onClick?.(pet)}
      className="bg-white rounded-2xl border border-[#2F6F5E]/10 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-[#E8963F]/15 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-[#E8963F]" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[#1F2A24] truncate">{pet.name}</h3>
        <p className="text-xs text-[#4A554E] truncate">
          {pet.breed ? `${pet.breed} · ` : ""}
          {pet.species}
          {pet.age ? ` · ${pet.age} yrs` : ""}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(pet);
          }}
          className="p-2 rounded-full hover:bg-[#3A6EA5]/10 text-[#3A6EA5]"
          aria-label={`Edit ${pet.name}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(pet.id);
          }}
          className="p-2 rounded-full hover:bg-red-50 text-red-500"
          aria-label={`Delete ${pet.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}