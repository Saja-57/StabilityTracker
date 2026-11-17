# Ask AI (parent app) — design

## Intent
Turn the parent app's preview "Ask" page into **Ask AI**: a real assistant that helps parents
(1) use and find their way around the app, (2) answer questions about their child's routine,
plan and logs, and (3) anything else about the app itself. It must be calm, simple and
uncluttered — parents are often tired or stressed.

## Goals
- Answer in plain, short language, in the app's current language (EN / HE / AR, RTL-correct).
- When the answer involves a place in the app, show one button that takes the parent there.
- Ground child-specific answers in the family's plan, notes, routine and logs; say the source.
- Leave care decisions to the therapist, with a one-tap "Message Lena".

## Non-goals
- No voice input, image input, chat history across sessions, or multiple conversations.
- No real Supabase data yet (uses the existing sample family content).
- No medical/diagnostic advice.

## Anti-goals (failure even if it works)
- A crowded screen: many chips, banners, disclaimers, settings.
- Long, essay-style answers.
- The OpenAI key reaching the phone bundle.
- Buttons that open screens that don't exist.

## Approaches considered
- **A. Chat that can open screens (chosen).** Conversation with follow-ups; each AI reply can
  carry up to one "go there" button picked from a fixed list of app destinations.
- B. One question, one answer card. Simpler, but no follow-ups.
- C. Chat with text only. Misses "take me there".
A was picked: it's the most helpful for rushed parents, and the fixed destination list keeps it safe.

## Screen (one screen, three states)
```
Empty                              Conversation
┌───────────────────────────┐      ┌───────────────────────────┐
│ ← Ask AI                  │      │ ← Ask AI                  │
│                           │      │          where do I log   │  ← parent bubble (end side)
│  How can I help today?    │      │       yesterday's meltdown?│
│  About Noa, the plan, or  │      │ Open Log and choose       │  ← AI reply, plain text
│  using the app.           │      │ "It happened earlier".    │
│                           │      │ [ Open Log  › ]           │  ← optional single action
│  [Log a moment         ]  │      │                           │
│  [What's next today?   ]  │      │  ···                      │  ← typing dots while waiting
│  [Find Lena's notes    ]  │      │                           │
│                           │      │                           │
│ [ Ask anything…      ] (➤)│      │ [ Ask anything…      ] (➤)│
│ AI can be wrong. Decisions│      └───────────────────────────┘
│ go to Lena.               │
└───────────────────────────┘
```
- Exactly **3** starter questions, shown only while the conversation is empty.
- Composer pinned to the bottom, keyboard-aware. One quiet line under it in the empty state only.
- AI replies: text, optional one action button, and a small "Message Lena" link only when the
  model flags the question as a care decision.
- Error state: one line "Couldn't reach Ask AI. Try again." with a retry.
- "New chat" lives as a small icon in the header (clears the thread). Nothing else in the header.
- The "Preview" tag and the old scripted Q&A list are removed.
- Renamed everywhere: "Ask" → "Ask AI" (More tab row and page title), all three languages.

## Destinations (fixed allowlist)
`home`, `routine`, `log_now` (→ `/log?start=support`), `log_earlier` (→ `/log?start=earlier`,
new: opens the detailed log), `messages`, `checkin` (`/surveys`), `appointments`, `resources`,
`family`, `profile`. Labels come from translation keys, never from the model.

## Architecture
- **Server:** a Next.js route handler in the therapist web app, `POST /api/ask`
  (`apps/therapist-web/app/api/ask/route.ts`). It holds `OPENAI_API_KEY` (server env only),
  builds the system prompt, calls OpenAI with a structured JSON output:
  `{ answer: string, action: Destination | null, askTherapist: boolean }`.
  Validated with Zod; anything invalid → `action: null`.
- **Request body:** `{ language, messages: [{role, content}] (last ~10), context }` where
  `context` is a compact summary built on the phone from the sample family content: child and
  therapist names, today's schedule (time + title), approved strategies, recent logs summary,
  latest therapist notes, check-in status. Validated and size-capped on the server.
- **System prompt:** who the assistant is, the app map (each destination and what it's for),
  rules: short answers (≤ 3 sentences unless asked), reply in `language`, never diagnose,
  set `askTherapist` for care decisions, only use the given context for child facts.
- **Phone:** `EXPO_PUBLIC_ASK_AI_URL` (e.g. `http://<mac-ip>:3000/api/ask`). Thread kept in
  component state only. Request has a timeout and abort on unmount.
- Later this route can move to a Supabase Edge Function without changing the phone side.

## Decided by Claude (check these)
- Server lives in therapist-web for now, since Supabase isn't set up.
- Model name read from `OPENAI_MODEL` env with a small, fast default.
- 3 starters; one action per reply; no history persisted.
- No streaming in v1 (typing dots instead) to keep it simple and robust in Expo Go.

## Left to the builder
- Exact starter wording and translations (HE/AR flagged for a fluent check).
- Visual details within the existing case-file design system.
