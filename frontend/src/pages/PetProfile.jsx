import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PawPrint, Loader2 } from "lucide-react";
import petService from "../services/petService";

const SPECIES_OPTIONS = ["Dog", "Cat", "Rabbit", "Bird", "Hamster", "Fish", "Other"];
const ACTIVITY_LEVELS = ["Low", "Moderate", "High"];

const EMPTY_FORM = {
  name: "",
  species: "Dog",
  breed: "",
  age: "",
  gender: "Male",
  weight: "",
  activityLevel: "Moderate",
  allergies: "",
  medicalConditions: "",
  foodPreferences: "",
};

export default function PetProfile() {
  const { id } = useParams(); // present when editing an existing pet
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPet, setLoadingPet] = useState(Boolean(id));

  // Load existing pet data when editing
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const pet = await petService.getPetById(id);
        setForm({ ...EMPTY_FORM, ...pet });
      } catch (err) {
        setError(err.friendlyMessage || "Could not load this pet's profile.");
      } finally {
        setLoadingPet(false);
      }
    })();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter your pet's name.");
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await petService.updatePet(id, form);
      } else {
        await petService.createPet(form);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.friendlyMessage || "Could not save pet profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPet) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center text-sm text-[#4A554E]">
        Loading pet profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-full bg-[#E8963F]/15 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-[#E8963F]" />
          </span>
          <h1 className="font-[Fraunces,serif] text-2xl font-semibold">
            {id ? "Edit Pet Profile" : "Add a New Pet"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#2F6F5E]/10 shadow-sm p-6 grid sm:grid-cols-2 gap-4"
        >
          {error && (
            <div className="sm:col-span-2 bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Field label="Pet Name" required>
            <input name="name" value={form.name} onChange={handleChange} className="input" />
          </Field>

          <Field label="Species">
            <select name="species" value={form.species} onChange={handleChange} className="input">
              {SPECIES_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Breed">
            <input name="breed" value={form.breed} onChange={handleChange} className="input" />
          </Field>

          <Field label="Age (years)">
            <input type="number" min="0" name="age" value={form.age} onChange={handleChange} className="input" />
          </Field>

          <Field label="Gender">
            <select name="gender" value={form.gender} onChange={handleChange} className="input">
              <option>Male</option>
              <option>Female</option>
            </select>
          </Field>

          <Field label="Weight (kg)">
            <input type="number" min="0" name="weight" value={form.weight} onChange={handleChange} className="input" />
          </Field>

          <Field label="Activity Level">
            <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="input">
              {ACTIVITY_LEVELS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>

          <Field label="Allergies">
            <input name="allergies" value={form.allergies} onChange={handleChange} className="input" placeholder="e.g. Chicken, Dairy" />
          </Field>

          <Field label="Existing Medical Conditions" full>
            <textarea
              name="medicalConditions"
              value={form.medicalConditions}
              onChange={handleChange}
              rows={2}
              className="input resize-none"
            />
          </Field>

          <Field label="Food Preferences" full>
            <textarea
              name="foodPreferences"
              value={form.foodPreferences}
              onChange={handleChange}
              rows={2}
              className="input resize-none"
            />
          </Field>

          <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-full text-sm font-medium border border-[#2F6F5E]/20 hover:border-[#2F6F5E]/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#2F6F5E] text-white hover:bg-[#255A4B] disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : "Save Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required, full }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-[#4A554E]">
        {label} {required && <span className="text-[#C05B2D]">*</span>}
      </span>
      {children}
    </label>
  );
}