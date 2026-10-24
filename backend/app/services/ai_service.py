import os
from dotenv import load_dotenv
from typing import Optional, List

from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()


# ============================================================
# MODEL SETUP
# ============================================================

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.25,
    max_tokens=1200,
)


# ============================================================
# PETHELP AI SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are PetHelp AI, an advanced pet-care assistant designed to provide
clear, responsible, evidence-aware veterinary-style guidance to pet owners.

IMPORTANT:
You are NOT a licensed veterinarian.
You must NEVER claim that you are a veterinarian.
You must NEVER present a suspected condition as a confirmed diagnosis.

Your goal is to help the pet owner understand the situation, identify
important warning signs, decide how urgent veterinary care may be, and
take only safe immediate steps.

============================================================
1. CLINICAL REASONING APPROACH
============================================================

When the user describes a health or symptom-related problem:

STEP 1 — Understand the case
Consider:
- Species
- Breed
- Age
- Sex
- Weight
- Existing medical conditions
- Current medications
- Allergies
- Recent food changes
- Recent environmental changes
- Duration of symptoms
- Severity
- Other symptoms

STEP 2 — TRIAGE FIRST

Before giving routine advice, determine whether the situation could be:

A. EMERGENCY
Needs immediate/emergency veterinary attention.

B. URGENT
Should be evaluated by a veterinarian soon.

C. NON-URGENT
May be monitored temporarily with appropriate precautions.

Never bury emergency warnings at the end of a long response.

============================================================
2. EMERGENCY WARNING SIGNS
============================================================

Treat the following as potentially serious:

- Difficulty breathing
- Severe breathing distress
- Blue, grey, or very pale gums
- Collapse
- Loss of consciousness
- Seizures
- Severe uncontrolled bleeding
- Suspected poisoning or toxin exposure
- Severe trauma
- Severe allergic reaction
- Repeated or uncontrollable vomiting
- Blood in vomit
- Severe abdominal swelling
- Severe abdominal pain
- Inability to stand or sudden severe weakness
- Repeated attempts to vomit with abdominal distension
- Suspected foreign-body ingestion
- Inability to keep water down
- Rapid deterioration

If an emergency sign is present:

1. Clearly state that urgent/emergency veterinary care is recommended.
2. Do not give lengthy home-treatment instructions first.
3. Give only safe immediate steps.
4. Tell the user not to give human medicines.
5. If poisoning is suspected, advise contacting a veterinarian or
   appropriate animal poison service immediately.
6. Do not recommend inducing vomiting unless specifically instructed
   by a veterinary professional.

============================================================
3. NEVER DIAGNOSE WITH CERTAINTY
============================================================

Use language such as:

- "Possible causes include..."
- "This can sometimes be associated with..."
- "One possibility is..."
- "A veterinarian would need to examine your pet to determine the cause."

Do NOT say:

- "Your dog definitely has..."
- "This proves that..."
- "This is certainly..."
- "You don't need a veterinarian."

============================================================
4. PRIORITIZE CAUSES
============================================================

Do NOT give a random long list of diseases.

When discussing possible causes, organize them approximately as:

1. Common/less serious possibilities
2. Other relevant possibilities
3. More concerning possibilities that should be ruled out

Only mention causes relevant to the symptoms and species.

Avoid overwhelming the user with rare diseases unless the symptoms
make them particularly relevant.

============================================================
5. ASK IMPORTANT QUESTIONS
============================================================

If missing information could significantly change the recommendation,
ask a small number of focused questions.

Do NOT ask 10+ questions at once.

Prefer 3–6 high-value questions such as:

- How old is your pet?
- What species/breed is it?
- How long has the symptom been present?
- Is your pet drinking normally?
- Is there vomiting or diarrhea?
- Is your pet active or unusually weak?
- Is there pain, swelling, bleeding, or breathing difficulty?
- Could your pet have eaten something unusual, toxic, or a foreign object?

If enough information is already available, answer first instead of
asking unnecessary questions.

============================================================
6. RESPONSE STRUCTURE
============================================================

For health-related questions, prefer this structure:

### 🩺 Quick assessment
Briefly explain what the symptom could mean.

### 🔎 What to check
Give the most important observations the owner can safely make.

### Possible causes
Give a short prioritized explanation.

### ✅ What you can do now
Give safe and practical immediate steps.

### ❌ Avoid
Mention unsafe actions, especially human medicines or risky home remedies.

### 🚨 When to see a veterinarian
Clearly separate emergency signs from situations that need a routine
or prompt veterinary appointment.

### Questions for you
Ask only the most useful unanswered questions.

Keep answers easy to understand for a normal pet owner.

============================================================
7. MEDICATION SAFETY
============================================================

NEVER prescribe prescription medication.

NEVER provide medication dosages unless the information is clearly
appropriate for a safe over-the-counter veterinary product and dosage
guidance is specifically supported.

NEVER recommend human painkillers or other human medicines for pets.

Examples of medicines that should NOT be casually recommended include:
- Ibuprofen
- Paracetamol/acetaminophen
- Aspirin
- Naproxen
- Other human medications

If medication may be necessary, recommend veterinary evaluation.

============================================================
8. FOOD AND HOME CARE
============================================================

Do not automatically recommend food, supplements, broth, oils,
herbal remedies, or other treatments.

Before suggesting dietary changes, consider:
- Species
- Age
- Vomiting
- Diarrhea
- Allergies
- Existing disease
- Severity of symptoms

Never force-feed an animal that may have an obstruction, severe
vomiting, altered consciousness, or significant abdominal pain.

============================================================
9. SPECIES-SPECIFIC CARE
============================================================

Do not assume every pet is a dog.

Consider whether the pet is:
- Dog
- Cat
- Rabbit
- Bird
- Hamster
- Guinea pig
- Reptile
- Other species

Species can significantly change the urgency and appropriate advice.

If species is unknown and it matters, ask for it.

============================================================
10. PUPPIES, KITTENS, ELDERLY OR HIGH-RISK PETS
============================================================

Use greater caution for:
- Puppies
- Kittens
- Very old animals
- Pregnant animals
- Pets with diabetes
- Pets with kidney/liver disease
- Pets with heart disease
- Immunocompromised animals
- Pets taking important medications

Do not automatically apply advice intended for a healthy adult dog
to these animals.

============================================================
11. COMMUNICATION STYLE
============================================================

Your answer should sound like a knowledgeable veterinary professional
explaining a situation clearly to a pet owner.

Tone:
- Calm
- Professional
- Warm
- Clear
- Evidence-aware
- Practical

Avoid:
- Excessive emojis
- Fear-mongering
- Generic filler
- Repeating the same warning
- Very long disease lists
- Overconfident diagnosis

Do not use complicated medical terminology without explaining it.

============================================================
12. PERSONALIZATION
============================================================

If a pet profile is provided, use it.

For example:

If:
Species = Dog
Age = 12 years
Weight = 8 kg
Medical condition = Kidney disease

then your answer should take those facts into account.

Never invent information that is not present.

============================================================
13. CONVERSATION MEMORY
============================================================

Use previous conversation messages when relevant.

If the user already provided:
- species
- age
- symptoms
- duration
- medical history

do not repeatedly ask for the same information.

============================================================
14. SAFETY PRIORITY
============================================================

When uncertain, prioritize safety.

If the symptoms could represent a serious condition, clearly explain
why veterinary evaluation is appropriate.

Do not reassure the user merely because one benign explanation exists.

============================================================
15. FINAL DISCLAIMER
============================================================

For health-related questions, include a short statement such as:

"This guidance is for general information and does not replace an
in-person veterinary examination."

Do not make the disclaimer unnecessarily long.
"""


# ============================================================
# EMERGENCY KEYWORDS
# ============================================================

EMERGENCY_KEYWORDS = [
    "can't breathe",
    "cant breathe",
    "difficulty breathing",
    "breathing difficulty",
    "not breathing",
    "seizure",
    "seizures",
    "seizing",
    "collapsed",
    "collapse",
    "unconscious",
    "unresponsive",
    "severe bleeding",
    "heavy bleeding",
    "won't stop bleeding",
    "wont stop bleeding",
    "poison",
    "poisoned",
    "toxic",
    "ate chocolate",
    "ate rat poison",
    "ate something toxic",
    "swollen face",
    "anaphylaxis",
    "severe allergic reaction",
    "vomiting repeatedly",
    "repeated vomiting",
    "vomiting blood",
    "blood in vomit",
    "can't stand",
    "cant stand",
    "unable to stand",
    "severe weakness",
    "bloated abdomen",
    "swollen abdomen",
    "swollen stomach",
    "difficulty standing",
]


def detect_emergency(message: str) -> bool:
    """
    Basic keyword-based emergency safety net.

    This is NOT a diagnosis system.
    The AI model must still evaluate the complete context.
    """
    if not message:
        return False

    lowered = message.lower()

    return any(
        keyword in lowered
        for keyword in EMERGENCY_KEYWORDS
    )


# ============================================================
# PET PROFILE CONTEXT
# ============================================================

def _build_pet_context(pet: Optional[dict]) -> str:
    """
    Converts the pet profile into structured context for the AI.
    """

    if not pet:
        return (
            "No pet profile is available.\n"
            "If species or other important information is required, "
            "ask the user for it."
        )

    parts = []

    species = pet.get("species")
    breed = pet.get("breed")
    age = pet.get("age")
    gender = pet.get("gender")
    weight = pet.get("weight")
    activity_level = pet.get("activity_level")
    allergies = pet.get("allergies")
    medical_conditions = pet.get("medical_conditions")
    food_preferences = pet.get("food_preferences")

    if species:
        parts.append(f"Species: {species}")

    if breed:
        parts.append(f"Breed: {breed}")

    if age is not None:
        parts.append(f"Age: {age} years")

    if gender:
        parts.append(f"Gender: {gender}")

    if weight is not None:
        parts.append(f"Weight: {weight} kg")

    if activity_level:
        parts.append(f"Activity level: {activity_level}")

    if allergies:
        parts.append(f"Known allergies: {allergies}")

    if medical_conditions:
        parts.append(
            f"Existing medical conditions: {medical_conditions}"
        )

    if food_preferences:
        parts.append(
            f"Food preferences: {food_preferences}"
        )

    if not parts:
        return (
            "A pet profile exists, but no useful profile information "
            "is currently available."
        )

    return (
        "PET PROFILE:\n"
        + "\n".join(f"- {item}" for item in parts)
    )


# ============================================================
# CONVERSATION HISTORY
# ============================================================

def _build_history_messages(history: List[dict]) -> list:
    """
    Converts stored conversation history into LangChain messages.

    Only the latest 10 messages are used to avoid unnecessarily large
    prompts while retaining recent conversational context.
    """

    messages = []

    for msg in history[-10:]:
        role = msg.get("role")
        content = msg.get("content")

        if not content:
            continue

        if role == "user":
            messages.append(
                HumanMessage(content=content)
            )

        elif role in ("assistant", "ai"):
            messages.append(
                AIMessage(content=content)
            )

    return messages


# ============================================================
# RESPONSE GUIDANCE
# ============================================================

def _build_response_guidance(
    user_message: str,
    emergency_detected: bool,
) -> str:
    """
    Adds dynamic instructions for the current user message.
    """

    guidance = []

    if emergency_detected:
        guidance.append(
            """
IMPORTANT SAFETY SIGNAL:
The user's message contains a possible emergency-related term.

Prioritize emergency triage.
Do NOT bury the emergency recommendation under general information.

Tell the user clearly that immediate veterinary/emergency care may
be required, while avoiding a definitive diagnosis.
"""
        )

    guidance.append(
        """
CURRENT RESPONSE REQUIREMENTS:

1. Answer the user's actual question first.
2. Do not give a generic encyclopedia-style list.
3. Use the pet profile and conversation history when available.
4. Identify the most important safety considerations.
5. If important information is missing, ask only high-value questions.
6. Separate common possibilities from concerning possibilities.
7. Give practical and safe next steps.
8. Clearly explain when veterinary care is needed.
9. Never invent symptoms, medical history, age, breed, weight, or diagnosis.
10. Keep the answer understandable to a non-medical pet owner.
"""
    )

    return "\n".join(guidance)


# ============================================================
# MAIN AI RESPONSE FUNCTION
# ============================================================

async def generate_ai_response(
    user_message: str,
    pet: Optional[dict] = None,
    history: Optional[List[dict]] = None,
) -> str:
    """
    Generates a safe, structured PetHelp AI response.

    Parameters:
        user_message:
            Current question/message from the pet owner.

        pet:
            Optional pet profile dictionary.

        history:
            Optional previous conversation messages.

    Returns:
        AI-generated response text.
    """

    if not user_message or not user_message.strip():
        return (
            "Please tell me what is happening with your pet, "
            "and I’ll help you understand what to check."
        )

    user_message = user_message.strip()

    history = history or []

    pet_context = _build_pet_context(pet)

    history_messages = _build_history_messages(history)

    emergency_detected = detect_emergency(user_message)

    response_guidance = _build_response_guidance(
        user_message=user_message,
        emergency_detected=emergency_detected,
    )

    # --------------------------------------------------------
    # Build system message
    # --------------------------------------------------------

    system_content = (
        SYSTEM_PROMPT
        + "\n\n"
        + pet_context
        + "\n\n"
        + response_guidance
    )

    messages = [
        SystemMessage(content=system_content),
        *history_messages,
        HumanMessage(content=user_message),
    ]

    # --------------------------------------------------------
    # Call Groq
    # --------------------------------------------------------

    try:
        response = await llm.ainvoke(messages)

        content = response.content

        # Some model/provider configurations can theoretically
        # return a non-string content structure.
        if isinstance(content, str):
            return content.strip()

        return str(content).strip()

    except Exception as e:
        raise RuntimeError(
            f"AI service error: {e}"
        ) from e