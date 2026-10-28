/**
 * ILLUSTRATIVE SAMPLE DATA.
 * One synthetic family (the Levis) used to design the parent app before
 * persistence exists. It mirrors the therapist workspace's sample caseload.
 * Every name, note, and event is invented. Screens depend only on the
 * view-model types; replace this module with real queries.
 */
import type { PictogramName } from "@/components/icons/pictograms";
import type { BarIntensity } from "@/components/case-file/primitives";
import type { ParentMessageViewModel } from "@/features/messages/types";
import type { RoutineStepStatus } from "@/features/routine/types";
import type { CaregiverSurveyViewModel } from "@/features/surveys/types";
import type { SupportedLanguage } from "@stability/i18n";

import { familyAr } from "./sample-family.ar";
import { familyHe } from "./sample-family.he";

export const SAMPLE_TODAY = "2026-10-14";
export const SAMPLE_NOW = "2026-10-14T10:20";

export const family = {
  child: {
    name: "Noa Levi",
    givenName: "Noa",
    age: 6,
    focus: ["sensory", "transitions"] as const,
    goal: "Shorter, calmer landings after school pickup.",
  },
  caregivers: [
    { name: "Tamar Levi", givenName: "Tamar", relation: "mother", you: true },
    { name: "Eitan Levi", givenName: "Eitan", relation: "father", you: false },
    {
      name: "Miriam Shalev",
      givenName: "Miriam",
      relation: "grandmother",
      you: false,
    },
  ],
  therapist: {
    name: "Dr. Lena Haddad",
    givenName: "Lena",
    credential: "BCBA, developmental therapist",
    practice: "Harbor Child Development",
  },
} as const;

export const careTeam = [
  {
    name: "Dr. Lena Haddad",
    role: "therapist",
    detail: "BCBA, developmental therapist",
  },
  {
    name: "Yael Ben-Ami",
    role: "school",
    detail: "Class teacher, Oranim school",
  },
  { name: "Dr. Avi Rosen", role: "pediatrician", detail: "Pediatrician" },
] as const;

/* --------------------------------------------------------------- routine */

export interface ScheduleStep {
  readonly id: string;
  readonly time: string;
  readonly endTime?: string;
  readonly title: string;
  readonly detail: string;
  readonly pictogram: PictogramName;
  readonly status: RoutineStepStatus;
  readonly completedBy?: string;
  readonly completedAt?: string;
  readonly adjusted?: { readonly by: string; readonly note: string };
  readonly support?: string;
}

export const schedule: readonly ScheduleStep[] = [
  {
    id: "wake",
    time: "07:00",
    title: "Wake up with soft light",
    detail: "Lamp on low first, curtains after five minutes.",
    pictogram: "wake",
    status: "completed",
    completedBy: "Tamar",
    completedAt: "07:04",
  },
  {
    id: "dress",
    time: "07:20",
    title: "Get dressed with the picture checklist",
    detail: "Clothes laid out the night before, tags removed.",
    pictogram: "dress",
    status: "completed",
    completedBy: "Eitan",
    completedAt: "07:31",
  },
  {
    id: "breakfast",
    time: "07:40",
    title: "Breakfast at the same seat",
    detail: "Same plate and cup; one familiar food on the plate.",
    pictogram: "breakfast",
    status: "completed",
    completedBy: "Tamar",
    completedAt: "08:02",
  },
  {
    id: "school",
    time: "08:15",
    endTime: "15:30",
    title: "School day",
    detail: "Drop-off at the side gate, where it is quieter.",
    pictogram: "school",
    status: "current",
  },
  {
    id: "pickup",
    time: "15:30",
    title: "Pickup with the transition object",
    detail:
      "Hand Noa her small stone at the gate and say what comes next in one sentence.",
    pictogram: "pickup",
    status: "upcoming",
    adjusted: {
      by: "Lena",
      note: "Now straight to the quiet car, no errands.",
    },
    support: "headphones",
  },
  {
    id: "decompress",
    time: "15:45",
    title: "Ten quiet minutes",
    detail: "Headphones, the soft blanket, no questions about the day yet.",
    pictogram: "decompress",
    status: "upcoming",
    adjusted: {
      by: "Lena",
      note: "Shortened to 10 minutes and moved right after pickup.",
    },
  },
  {
    id: "homework",
    time: "16:30",
    title: "Homework at the kitchen table",
    detail: "Timer for 15 minutes, then a movement break.",
    pictogram: "homework",
    status: "upcoming",
    support: "visualTimer",
  },
  {
    id: "dinner",
    time: "18:30",
    title: "Dinner with a timer warning",
    detail: "Five-minute warning on the visual timer before sitting down.",
    pictogram: "dinner",
    status: "upcoming",
  },
  {
    id: "bath",
    time: "19:15",
    title: "Bath",
    detail: "Warm, not hot. Same towel.",
    pictogram: "bath",
    status: "upcoming",
  },
  {
    id: "bedtime",
    time: "19:45",
    title: "Bedtime cards",
    detail: "Pyjamas, two books, music, lights.",
    pictogram: "bedtime",
    status: "upcoming",
  },
];

/* -------------------------------------------------------------- messages */

export const therapistNotes: readonly ParentMessageViewModel[] = [
  {
    id: "m-adjust",
    category: "routineAdjustment",
    title: "A softer landing after pickup",
    preview:
      "I moved the quiet minutes right after pickup and shortened them to ten.",
    body: 'Thank you for logging both events yesterday. They tell a clear story: the hardest moments come in the first fifteen minutes after school.\n\nFrom today, the routine goes straight from pickup to ten quiet minutes in the car or at home, with headphones and the blanket. No errands on the way, and no questions about the day until after.\n\nIf an errand cannot wait, give Noa the stone at the gate and tell her in one sentence: "First car, then shop, then home."',
    isRead: false,
    isImportant: true,
    senderDisplayName: "Dr. Lena Haddad",
    sentAt: "2026-10-14T08:30",
  },
  {
    id: "m-reminder",
    category: "reminder",
    title: "Session today at 15:30",
    preview:
      "Bring the stone and Noa's headphones; we will practise the pickup together.",
    body: "See you at the clinic at 15:30. Please bring the transition stone and Noa's headphones. We will practise the pickup sequence together so it feels familiar.",
    isRead: false,
    senderDisplayName: "Dr. Lena Haddad",
    sentAt: "2026-10-13T18:05",
  },
  {
    id: "m-observe",
    category: "observation",
    title: "What helped this week",
    preview:
      "Deep pressure settled things 8 times out of 8. That is a real pattern.",
    body: "Looking at your logs since our last session: deep pressure helped every time you tried it, and headphones helped in 9 of 11 moments. Noa also chose headphones on her own twice. That is a big step.",
    isRead: true,
    senderDisplayName: "Dr. Lena Haddad",
    sentAt: "2026-10-11T09:15",
  },
  {
    id: "m-recommend",
    category: "recommendation",
    title: "One visual warning before changes",
    preview:
      "Before a change of place, give one picture warning and keep the same words.",
    body: 'Before any change of place, show Noa the next picture card and use the same words each time: "First this, then that." Try it for a week and log how the first ten minutes go.',
    isRead: true,
    senderDisplayName: "Dr. Lena Haddad",
    sentAt: "2026-10-08T17:10",
  },
];

/* ---------------------------------------------------------------- survey */

export const weeklySurvey: CaregiverSurveyViewModel = {
  id: "weekly-2026-10-14",
  title: "Weekly check-in",
  description: "Five short questions about this week. About two minutes.",
  questions: [
    {
      id: "week",
      type: "scale",
      prompt: "Overall, how did this week feel at home?",
      minimum: 1,
      maximum: 5,
      isOptional: false,
    },
    {
      id: "hardest",
      type: "singleChoice",
      prompt: "Which part of the day was hardest?",
      isOptional: false,
      options: [
        { id: "morning", label: "Mornings before school" },
        { id: "pickup", label: "After school pickup" },
        { id: "evening", label: "Evenings and dinner" },
        { id: "bedtime", label: "Bedtime" },
      ],
    },
    {
      id: "helped",
      type: "multiChoice",
      prompt: "What helped this week?",
      isOptional: true,
      options: [
        { id: "deepPressure", label: "Deep pressure" },
        { id: "headphones", label: "Headphones" },
        { id: "stone", label: "The transition stone" },
        { id: "timer", label: "Visual timer" },
        { id: "quiet", label: "Quiet minutes" },
      ],
    },
    {
      id: "sleep",
      type: "scale",
      prompt: "How was Noa's sleep, most nights?",
      minimum: 1,
      maximum: 5,
      isOptional: false,
    },
    {
      id: "note",
      type: "longText",
      prompt: "Anything you want Lena to know before the session?",
      isOptional: true,
    },
  ],
};

/* ---------------------------------------------------------- appointments */

export interface Visit {
  readonly id: string;
  readonly at: string;
  readonly durationMin: number;
  readonly mode: "clinic" | "video" | "home";
  readonly focus: string;
  readonly place: string;
  readonly bring: readonly string[];
}

export const visits: readonly Visit[] = [
  {
    id: "v-today",
    at: "2026-10-14T15:30",
    durationMin: 45,
    mode: "clinic",
    focus: "Practising the pickup sequence",
    place: "Harbor Child Development, room 3",
    bring: ["Transition stone", "Headphones", "This week's questions"],
  },
  {
    id: "v-next",
    at: "2026-10-21T15:30",
    durationMin: 45,
    mode: "clinic",
    focus: "Reviewing the after-school plan",
    place: "Harbor Child Development, room 3",
    bring: ["Transition stone"],
  },
  {
    id: "v-video",
    at: "2026-10-27T19:00",
    durationMin: 30,
    mode: "video",
    focus: "Parent check-in, no child needed",
    place: "Video call link arrives by message",
    bring: [],
  },
];

export const pastVisits = [
  {
    id: "p1",
    at: "2026-10-07T15:30",
    focus: "After-school transitions",
    summary: "Practised the transition card at three planned switches.",
  },
  {
    id: "p2",
    at: "2026-09-30T15:30",
    focus: "Sensory menu",
    summary:
      "Built a sensory menu together; Noa chose headphones without a prompt.",
  },
] as const;

/* ------------------------------------------------------------- the week */

/** Logged moments for the last 14 days, oldest first; each entry lists intensities. */
export const fortnight: readonly (readonly BarIntensity[])[] = [
  ["moderate"],
  [],
  ["low"],
  ["moderate", "low"],
  [],
  ["high"],
  ["low"],
  ["moderate"],
  ["high", "moderate"],
  ["low"],
  ["moderate", "low"],
  ["high"],
  ["moderate"],
  [],
];

/** Index in `fortnight` of the first day after the last session. */
export const sinceSessionIndex = 7;

export const recentLogs = [
  {
    id: "l1",
    at: "2026-10-13T16:45",
    type: "sensoryOverload",
    intensity: "low",
    helped: "deepPressure",
    by: "Eitan",
  },
  {
    id: "l2",
    at: "2026-10-13T15:50",
    type: "meltdown",
    intensity: "high",
    helped: "quietSpace",
    by: "Tamar",
  },
  {
    id: "l3",
    at: "2026-10-12T16:30",
    type: "behavioralEvent",
    intensity: "moderate",
    helped: "headphones",
    by: "Tamar",
  },
] as const;

/* ------------------------------------------------------------- resources */

export interface Strategy {
  readonly id: PictogramName;
  readonly approved: boolean;
  readonly when: string;
  readonly steps: readonly string[];
  readonly worked: number;
  readonly tried: number;
}

export const strategies: readonly Strategy[] = [
  {
    id: "deepPressure",
    approved: true,
    when: "When Noa is overwhelmed but still lets you close.",
    steps: [
      'Ask first: "Squeeze?"',
      "Firm, slow hug or a heavy blanket on her shoulders",
      "Count slowly to ten together",
      "Stop the moment she pulls away",
    ],
    worked: 8,
    tried: 8,
  },
  {
    id: "headphones",
    approved: true,
    when: "Before noisy places, or as soon as she covers her ears.",
    steps: [
      "Keep them in the school bag",
      "Offer, do not insist",
      "Leave them on until she takes them off",
    ],
    worked: 9,
    tried: 11,
  },
  {
    id: "quietSpace",
    approved: true,
    when: "After pickup, or when talking makes it worse.",
    steps: [
      "Lower your voice and stop asking questions",
      "Offer the corner with the blanket",
      "Stay nearby, quietly",
      "Talk about it only after she is calm",
    ],
    worked: 5,
    tried: 8,
  },
  {
    id: "countdown",
    approved: true,
    when: "Before any change of place or the end of screen time.",
    steps: [
      "Five-minute warning with the picture card",
      "Two-minute warning",
      'Same words each time: "First this, then that"',
    ],
    worked: 5,
    tried: 8,
  },
  {
    id: "visualTimer",
    approved: true,
    when: "Homework, dinner, and anything with a clear end.",
    steps: [
      "Set it where Noa can see it",
      "Let her start it herself",
      "When it ends, move on calmly",
    ],
    worked: 6,
    tried: 7,
  },
  {
    id: "breathe",
    approved: false,
    when: "For you, too: the minute before you step in.",
    steps: [
      "Breathe in for four",
      "Hold for four",
      "Out for six",
      "Then go to her slowly",
    ],
    worked: 0,
    tried: 0,
  },
];

/* ------------------------------------------------------------------- ask */

export interface AskExchange {
  readonly question: string;
  readonly answer: string;
  readonly source: string;
}

/** Scripted, plan-grounded answers. A preview of Ask, not a live model. */
export const askLibrary: readonly AskExchange[] = [
  {
    question: "What should I do right after pickup today?",
    answer:
      "Lena's plan for this week: give Noa the stone at the gate, say what comes next in one sentence, then go straight to ten quiet minutes with headphones and the blanket. Save questions about her day for later.",
    source: "Routine adjustment from Lena, 14 Oct",
  },
  {
    question: "She is covering her ears and crying. What helps?",
    answer:
      'First lower your voice and offer her headphones. If she lets you close, ask "Squeeze?" and try deep pressure. It helped every time you tried it this month. Log it afterwards, when things are calm.',
    source: "Your logs and Lena's approved strategies",
  },
  {
    question: "How is this week compared to last week?",
    answer:
      "You logged 10 moments since the last session, one of them high intensity. Recovery has been about 11 minutes on average. The afternoons after school are still the hardest part, which is what today's session will focus on.",
    source: "Your logs since 7 Oct",
  },
  {
    question: "Can we skip the after-school club this week?",
    answer:
      "That is a good question to ask Lena directly; she can weigh it with the full picture. You can send it from Messages, or bring it to today's session at 15:30.",
    source: "Ask defers decisions to your therapist",
  },
];

/* ---------------------------------------------------------- localization */

/**
 * Hebrew and Arabic versions of the sample prose, keyed by id. Names, times,
 * ids, and counts are never translated. Anything missing falls back to English.
 */
export interface FamilyTranslation {
  readonly childGoal: string;
  readonly therapistCredential: string;
  readonly careTeamDetails: Readonly<Record<string, string>>;
  readonly schedule: Readonly<
    Record<
      string,
      {
        readonly title: string;
        readonly detail: string;
        readonly adjustedNote?: string;
      }
    >
  >;
  readonly therapistNotes: Readonly<
    Record<
      string,
      {
        readonly title: string;
        readonly preview: string;
        readonly body: string;
      }
    >
  >;
  readonly survey: {
    readonly title: string;
    readonly description: string;
    readonly prompts: Readonly<Record<string, string>>;
    readonly options: Readonly<Record<string, string>>;
  };
  readonly visits: Readonly<
    Record<
      string,
      {
        readonly focus: string;
        readonly place: string;
        readonly bring: readonly string[];
      }
    >
  >;
  readonly pastVisits: Readonly<
    Record<string, { readonly focus: string; readonly summary: string }>
  >;
  readonly strategies: Readonly<
    Record<string, { readonly when: string; readonly steps: readonly string[] }>
  >;
  readonly askLibrary: readonly AskExchange[];
}

type FamilyProfile = typeof family;
export interface LocalizedFamilyProfile {
  readonly child: Omit<FamilyProfile["child"], "goal"> & {
    readonly goal: string;
  };
  readonly caregivers: FamilyProfile["caregivers"];
  readonly therapist: Omit<FamilyProfile["therapist"], "credential"> & {
    readonly credential: string;
  };
}

type CareTeamEntry = (typeof careTeam)[number];
export interface CareTeamMember {
  readonly name: CareTeamEntry["name"];
  readonly role: CareTeamEntry["role"];
  readonly detail: string;
}

type PastVisitEntry = (typeof pastVisits)[number];
export interface PastVisit {
  readonly id: PastVisitEntry["id"];
  readonly at: string;
  readonly focus: string;
  readonly summary: string;
}

/** Every sample collection, in one language. Same shapes as the English exports. */
export interface FamilyContent {
  readonly language: SupportedLanguage;
  readonly SAMPLE_TODAY: typeof SAMPLE_TODAY;
  readonly SAMPLE_NOW: typeof SAMPLE_NOW;
  readonly family: LocalizedFamilyProfile;
  readonly careTeam: readonly CareTeamMember[];
  readonly schedule: readonly ScheduleStep[];
  readonly therapistNotes: readonly ParentMessageViewModel[];
  readonly weeklySurvey: CaregiverSurveyViewModel;
  readonly visits: readonly Visit[];
  readonly pastVisits: readonly PastVisit[];
  readonly fortnight: typeof fortnight;
  readonly sinceSessionIndex: typeof sinceSessionIndex;
  readonly recentLogs: typeof recentLogs;
  readonly strategies: readonly Strategy[];
  readonly askLibrary: readonly AskExchange[];
}

const englishContent: FamilyContent = {
  language: "en",
  SAMPLE_TODAY,
  SAMPLE_NOW,
  family,
  careTeam,
  schedule,
  therapistNotes,
  weeklySurvey,
  visits,
  pastVisits,
  fortnight,
  sinceSessionIndex,
  recentLogs,
  strategies,
  askLibrary,
};

const translations: Partial<Record<SupportedLanguage, FamilyTranslation>> = {
  he: familyHe,
  ar: familyAr,
};

function translate(
  language: SupportedLanguage,
  tr: FamilyTranslation,
): FamilyContent {
  return {
    ...englishContent,
    language,
    family: {
      ...family,
      child: { ...family.child, goal: tr.childGoal },
      therapist: { ...family.therapist, credential: tr.therapistCredential },
    },
    careTeam: careTeam.map((member) => ({
      ...member,
      detail: tr.careTeamDetails[member.name] ?? member.detail,
    })),
    schedule: schedule.map((step) => {
      const text = tr.schedule[step.id];
      if (!text) return step;
      return {
        ...step,
        title: text.title,
        detail: text.detail,
        ...(step.adjusted
          ? {
              adjusted: {
                ...step.adjusted,
                note: text.adjustedNote ?? step.adjusted.note,
              },
            }
          : {}),
      };
    }),
    therapistNotes: therapistNotes.map((note) => {
      const text = tr.therapistNotes[note.id];
      return text ? { ...note, ...text, contentLanguage: language } : note;
    }),
    weeklySurvey: {
      ...weeklySurvey,
      contentLanguage: language,
      title: tr.survey.title,
      description: tr.survey.description,
      questions: weeklySurvey.questions.map((question) => {
        const prompt = tr.survey.prompts[question.id] ?? question.prompt;
        if (
          question.type === "singleChoice" ||
          question.type === "multiChoice"
        ) {
          return {
            ...question,
            prompt,
            options: question.options.map((option) => ({
              ...option,
              label: tr.survey.options[option.id] ?? option.label,
            })),
          };
        }
        return { ...question, prompt };
      }),
    },
    visits: visits.map((visit) => {
      const text = tr.visits[visit.id];
      return text ? { ...visit, ...text } : visit;
    }),
    pastVisits: pastVisits.map((visit) => {
      const text = tr.pastVisits[visit.id];
      return text ? { ...visit, ...text } : visit;
    }),
    strategies: strategies.map((strategy) => {
      const text = tr.strategies[strategy.id];
      return text ? { ...strategy, ...text } : strategy;
    }),
    askLibrary: askLibrary.map(
      (exchange, index) => tr.askLibrary[index] ?? exchange,
    ),
  };
}

const contentCache = new Map<SupportedLanguage, FamilyContent>();

/** The sample collections in the given language. English values are the defaults. */
export function localizedFamily(language: SupportedLanguage): FamilyContent {
  const cached = contentCache.get(language);
  if (cached) return cached;
  const tr = translations[language];
  const content = tr ? translate(language, tr) : englishContent;
  contentCache.set(language, content);
  return content;
}
