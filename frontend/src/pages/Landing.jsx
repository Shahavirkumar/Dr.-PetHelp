import React from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  MessageCircle,
  Utensils,
  Droplets,
  Sparkles,
  Activity,
  Stethoscope,
  ShieldAlert,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Fish,
} from "lucide-react";

const features = [
  { icon: Utensils, title: "Diet & Nutrition", desc: "Personalized food guidance based on species, breed, age and weight." },
  { icon: Droplets, title: "Hydration", desc: "Know how much water your pet needs and how to spot dehydration." },
  { icon: Sparkles, title: "Grooming & Hygiene", desc: "Bathing frequency, brushing tips, and freshness routines." },
  { icon: Activity, title: "Exercise & Wellness", desc: "Activity levels tailored to your pet's age and energy." },
  { icon: Stethoscope, title: "Symptom Guidance", desc: "Understand possible causes of common symptoms — safely." },
  { icon: ShieldAlert, title: "When to See a Vet", desc: "Clear guidance on emergencies that need real veterinary care." },
];

const steps = [
  { title: "Create a Pet Profile", desc: "Tell us about your pet's species, breed, age and health details." },
  { title: "Ask Anything", desc: "Chat naturally about diet, symptoms, grooming, or wellness." },
  { title: "Get Personalized Guidance", desc: "Receive general care guidance tailored to your pet's profile." },
];

const supportedPets = [
  { icon: Dog, label: "Dogs" },
  { icon: Cat, label: "Cats" },
  { icon: Rabbit, label: "Rabbits" },
  { icon: Bird, label: "Birds" },
  { icon: Fish, label: "Fish" },
  { icon: PawPrint, label: "& More" },
];

export default function Landing() {
  return (
    <div className="bg-[#FAF8F3] text-[#1F2A24]">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <span className="inline-flex items-center gap-2 bg-[#2F6F5E]/10 text-[#2F6F5E] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <PawPrint className="w-3.5 h-3.5" />
          AI-Powered General Pet Care Guidance
        </span>
        <h1 className="font-[Fraunces,serif] text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight max-w-3xl mx-auto">
          Your Pet's Health Companion
        </h1>
        <p className="mt-5 text-[#4A554E] max-w-xl mx-auto text-base sm:text-lg">
          PetHelp AI gives you clear, personalized general guidance on diet, hydration,
          grooming and wellness — so you always know your next best step for your pet.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/chat"
            className="flex items-center gap-2 bg-[#2F6F5E] text-white px-6 py-3 rounded-full font-medium hover:bg-[#255A4B] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Start Chatting
          </Link>
          <Link
            to="/pets/new"
            className="flex items-center gap-2 bg-white border border-[#2F6F5E]/20 text-[#1F2A24] px-6 py-3 rounded-full font-medium hover:border-[#2F6F5E]/50 transition-colors"
          >
            <PawPrint className="w-4 h-4" />
            Add Your Pet
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-[Fraunces,serif] text-2xl sm:text-3xl font-semibold text-center mb-10">
          Everything you need for everyday pet care
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 border border-[#2F6F5E]/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-[#3A6EA5]/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#3A6EA5]" />
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-[#4A554E]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 border-y border-[#2F6F5E]/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-[Fraunces,serif] text-2xl sm:text-3xl font-semibold text-center mb-10">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#E8963F]/15 text-[#E8963F] flex items-center justify-center font-[Fraunces,serif] font-semibold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-[#4A554E]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported pets */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="font-[Fraunces,serif] text-2xl sm:text-3xl font-semibold mb-10">
          Supported Pets
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {supportedPets.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 w-20">
              <div className="w-14 h-14 rounded-full bg-[#2F6F5E]/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#2F6F5E]" />
              </div>
              <span className="text-xs text-[#4A554E]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Safety disclaimer */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-[#E8963F]/10 border border-[#E8963F]/30 rounded-2xl p-6 flex gap-4 items-start">
          <ShieldAlert className="w-6 h-6 text-[#C05B2D] shrink-0 mt-0.5" />
          <p className="text-sm text-[#5A4530]">
            <strong>PetHelp AI is not a licensed veterinarian.</strong> It provides general
            pet-care guidance only and does not diagnose conditions or prescribe medication.
            Always consult a qualified veterinarian for medical concerns, and seek immediate
            emergency care for serious symptoms.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2F6F5E]/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#4A554E]">
          <div className="flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-[#2F6F5E]" />
            <span>PetHelp AI © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-[#2F6F5E]">Log in</Link>
            <Link to="/register" className="hover:text-[#2F6F5E]">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}