/**
 * Ask AI for the parent app. The phone sends the conversation and a compact
 * summary of the family's content; this route holds the OpenAI key and returns
 * a short answer plus, at most, one app destination from a fixed list.
 *
 * Server-only: OPENAI_API_KEY never leaves this process.
 */

const destinations = [
  "home",
  "routine",
  "log_now",
  "log_earlier",
  "messages",
  "checkin",
  "appointments",
  "resources",
  "family",
  "profile",
] as const;
type Destination = (typeof destinations)[number];

const languages = { en: "English", he: "Hebrew", ar: "Arabic" } as const;
type Language = keyof typeof languages;

const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1200;
const MAX_CONTEXT_CHARS = 6000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const appMap = `
The parent app has these places (use the id in "action" to offer a button):
- home: today's overview: the weekly check-in, what is happening now and next in the routine, the therapist's latest note, today's session. The red "Something's happening" button sits at the bottom of Home.
- routine: today's routine as picture cards in time order; parents tick a step when it is done, and see therapist adjustments.
- log_now: for something happening right now. Opens calming support first (breathing, the therapist's approved strategies), then a quick log when ready.
- log_earlier: record something that already happened (earlier today or a past day) with the detailed log: basics, context, what happened, what helped.
- messages: notes from the therapist (recommendations, observations, reminders, routine adjustments). Parents can read, acknowledge and reply.
- checkin: the weekly check-in survey for the therapist, a few short questions, about two minutes. Once a week.
- appointments: upcoming and past sessions, what to bring, the session focus.
- resources: guides and material shared by the therapist.
- family: the child's profile and the caregivers on the account.
- profile: the parent's own settings: language (English, Hebrew, Arabic) and notification reminders.
Tabs at the bottom: Home, Routine, Log (round button in the middle), Messages, More. More holds Ask AI, Resources, Surveys/check-in, Appointments, Family, Profile.
`.trim();

function systemPrompt(language: Language, context: string) {
  return `You are Ask AI inside Stability Tracker, a calm helper for parents and caregivers of a neurodivergent child.
You help with: using and finding things in the app, the child's routine and the therapist's plan, and what the family has logged.

${appMap}

Family context (illustrative sample data; the only source for facts about this child):
${context || "(none provided)"}

Rules:
- Reply in ${languages[language]} only.
- Be short and warm: at most 3 short sentences, unless the parent asks for steps; then at most 4 numbered steps.
- Plain words. No jargon, no emojis, no markdown headings, no bold.
- Never blame the parent or the child. Never be alarmist.
- Only state facts about the child that appear in the family context. If you don't know, say so and suggest asking the therapist.
- Never diagnose, never suggest medication or dosage, never override the therapist's plan. For decisions about care or changes to the plan, set "askTherapist" to true and say the therapist can help.
- If the parent describes danger or a medical emergency, tell them to contact local emergency services now, set "askTherapist" to true and "action" to null.
- "action": choose one place from the list only when opening it is the obvious next step; otherwise null.
- Questions unrelated to the child, the family's care or the app: answer in one sentence that you can help with the app and the child's routine, action null.`;
}

const responseSchema = {
  name: "ask_ai_reply",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["answer", "action", "askTherapist"],
    properties: {
      answer: { type: "string" },
      action: { type: ["string", "null"], enum: [...destinations, null] },
      askTherapist: { type: "boolean" },
    },
  },
} as const;

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

function parseBody(
  body: unknown,
): { language: Language; messages: IncomingMessage[]; context: string } | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const language: Language =
    typeof raw["language"] === "string" && raw["language"] in languages
      ? (raw["language"] as Language)
      : "en";
  if (!Array.isArray(raw["messages"])) return null;
  const messages = raw["messages"]
    .filter(
      (m): m is IncomingMessage =>
        !!m &&
        typeof m === "object" &&
        ((m as IncomingMessage).role === "user" ||
          (m as IncomingMessage).role === "assistant") &&
        typeof (m as IncomingMessage).content === "string" &&
        (m as IncomingMessage).content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_CHARS),
    }));
  if (messages.length === 0 || messages.at(-1)?.role !== "user") return null;
  const context =
    typeof raw["context"] === "string"
      ? raw["context"].slice(0, MAX_CONTEXT_CHARS)
      : "";
  return { language, messages, context };
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: corsHeaders });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) return json({ error: "not_configured" }, 503);

  let parsed: ReturnType<typeof parseBody>;
  try {
    parsed = parseBody(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) return json({ error: "bad_request" }, 400);

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env["OPENAI_MODEL"] || "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt(parsed.language, parsed.context),
        },
        ...parsed.messages,
      ],
      response_format: { type: "json_schema", json_schema: responseSchema },
    }),
    signal: AbortSignal.timeout(45_000),
  }).catch(() => null);

  if (!upstream?.ok) {
    if (upstream)
      console.error("Ask AI upstream", upstream.status, await upstream.text());
    return json({ error: "upstream" }, 502);
  }

  try {
    const data = (await upstream.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = JSON.parse(data.choices?.[0]?.message?.content ?? "") as {
      answer?: unknown;
      action?: unknown;
      askTherapist?: unknown;
    };
    const answer = typeof reply.answer === "string" ? reply.answer.trim() : "";
    if (!answer) return json({ error: "empty" }, 502);
    const action = destinations.includes(reply.action as Destination)
      ? (reply.action as Destination)
      : null;
    return json({ answer, action, askTherapist: reply.askTherapist === true });
  } catch {
    return json({ error: "parse" }, 502);
  }
}
