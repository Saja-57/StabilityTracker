/**
 * ILLUSTRATIVE SAMPLE DATA.
 * Synthetic caseload used to design the therapist workspace before Supabase
 * persistence exists. Every name, event, and note here is invented. Replace
 * this module with real queries; components only depend on ./types.
 */
import type {
  Appointment,
  CareEvent,
  ChildFile,
  EventType,
  Intensity,
  ReportDocument,
  RoutineStep,
  SessionNote,
  Setting,
  StepStatus,
  Support,
  SurveyResult,
  TherapistProfile,
  ThreadMessage,
  Trigger,
} from "./types";
import { addDays, addMinutes, SAMPLE_NOW, SAMPLE_TODAY } from "./time";

export const therapist: TherapistProfile = {
  name: "Dr. Lena Haddad",
  givenName: "Lena",
  credential: "BCBA, developmental therapist",
  practice: "Harbor Child Development",
};

export const children: readonly ChildFile[] = [
  {
    id: "noa-levi",
    name: "Noa Levi",
    givenName: "Noa",
    age: 6,
    since: "2025-11-03",
    focus: ["sensory", "transitions"],
    caregivers: [
      { name: "Tamar Levi", relation: "mother", primary: true },
      { name: "Eitan Levi", relation: "father", primary: false },
    ],
    status: "needsReview",
    statusReason: "Two high-intensity events since Thursday, both after school pickup.",
    pattern: "School pickup preceded 5 of the last 7 events.",
    lastSession: "2026-10-07",
    nextSession: "2026-10-14T15:30",
    goal: "Shorten recovery after afternoon transitions to under 10 minutes.",
    tabHue: "gold",
  },
  {
    id: "yusuf-nasser",
    name: "Yusuf Nasser",
    givenName: "Yusuf",
    age: 8,
    since: "2025-06-18",
    focus: ["emotionalRegulation", "social"],
    caregivers: [
      { name: "Rania Nasser", relation: "mother", primary: true },
      { name: "Samir Nasser", relation: "father", primary: false },
    ],
    status: "needsReview",
    statusReason: "Evening events doubled this week; family asked for guidance.",
    pattern: "Screen-off moments preceded most evening events.",
    lastSession: "2026-10-08",
    nextSession: "2026-10-16T16:00",
    goal: "Use a countdown and choice before screens end, five evenings a week.",
    tabHue: "ruby",
  },
  {
    id: "maya-cohen",
    name: "Maya Cohen",
    givenName: "Maya",
    age: 5,
    since: "2026-02-10",
    focus: ["sleep", "sensory"],
    caregivers: [{ name: "Dana Cohen", relation: "mother", primary: true }],
    status: "sessionToday",
    statusReason: "Session today at 11:00. Calmer week, bedtime routine holding.",
    pattern: "Bedtime events fell from 6 to 2 since the visual schedule started.",
    lastSession: "2026-10-07",
    nextSession: "2026-10-14T11:00",
    goal: "Fall asleep within 30 minutes using the bedtime visual schedule.",
    tabHue: "moss",
  },
  {
    id: "adam-khoury",
    name: "Adam Khoury",
    givenName: "Adam",
    age: 7,
    since: "2025-09-01",
    focus: ["communication", "emotionalRegulation"],
    caregivers: [
      { name: "Nadia Khoury", relation: "mother", primary: true },
      { name: "Hanna Khoury", relation: "grandmother", primary: false },
    ],
    status: "needsReview",
    statusReason: "Caregiver survey shows sleep dropping; three unreviewed events.",
    pattern: "Events cluster on mornings after short sleep.",
    lastSession: "2026-10-06",
    nextSession: "2026-10-15T09:30",
    goal: "Request a break with a card before escalation, in 3 of 4 opportunities.",
    tabHue: "cobalt",
  },
  {
    id: "lian-ben-david",
    name: "Lian Ben-David",
    givenName: "Lian",
    age: 4,
    since: "2026-04-22",
    focus: ["feeding", "sensory"],
    caregivers: [
      { name: "Yael Ben-David", relation: "mother", primary: true },
      { name: "Oren Ben-David", relation: "father", primary: false },
    ],
    status: "steady",
    statusReason: "Steady week. Two new foods tried at dinner.",
    pattern: "Mealtime events are short and recover quickly.",
    lastSession: "2026-10-09",
    nextSession: "2026-10-16T10:00",
    goal: "Tolerate one new texture on the plate at four dinners a week.",
    tabHue: "clay",
  },
  {
    id: "omar-saleh",
    name: "Omar Saleh",
    givenName: "Omar",
    age: 9,
    since: "2025-03-14",
    focus: ["emotionalRegulation", "transitions"],
    caregivers: [{ name: "Layla Saleh", relation: "mother", primary: true }],
    status: "sessionToday",
    statusReason: "Video session today at 13:30. School reported a good week.",
    pattern: "Morning school transitions are now mostly calm.",
    lastSession: "2026-10-07",
    nextSession: "2026-10-14T13:30",
    goal: "Arrive at class within 10 minutes of drop-off on 4 of 5 days.",
    tabHue: "moss",
  },
  {
    id: "shira-mizrahi",
    name: "Shira Mizrahi",
    givenName: "Shira",
    age: 6,
    since: "2025-12-01",
    focus: ["transitions", "social"],
    caregivers: [
      { name: "Michal Mizrahi", relation: "mother", primary: true },
      { name: "Avi Mizrahi", relation: "father", primary: false },
    ],
    status: "steady",
    statusReason: "Calmest fortnight since intake.",
    pattern: "Visual timer is helping in 9 of 10 logged transitions.",
    lastSession: "2026-10-12",
    nextSession: "2026-10-19T15:00",
    goal: "Move between activities with a timer and no adult prompt.",
    tabHue: "moss",
  },
  {
    id: "rami-awad",
    name: "Rami Awad",
    givenName: "Rami",
    age: 5,
    since: "2026-07-07",
    focus: ["sensory", "social"],
    caregivers: [
      { name: "Huda Awad", relation: "mother", primary: true },
      { name: "Karim Awad", relation: "father", primary: false },
    ],
    status: "sessionToday",
    statusReason: "Home visit today at 17:00. Store outings remain hard.",
    pattern: "Crowded, loud places precede most high-intensity events.",
    lastSession: "2026-10-08",
    nextSession: "2026-10-14T17:00",
    goal: "Complete a 10-minute store visit with headphones and a job card.",
    tabHue: "cobalt",
  },
  {
    id: "ella-friedman",
    name: "Ella Friedman",
    givenName: "Ella",
    age: 7,
    since: "2026-01-19",
    focus: ["sleep"],
    caregivers: [{ name: "Ruth Friedman", relation: "grandmother", primary: true }],
    status: "steady",
    statusReason: "No events for six days.",
    pattern: "Night waking resolved after the room-light change.",
    lastSession: "2026-10-05",
    nextSession: "2026-10-20T16:30",
    goal: "Sleep through the night five nights a week.",
    tabHue: "clay",
  },
];

/* --------------------------------------------------------------- events */

interface Profile {
  readonly perDay: number;
  readonly recentLift: number;
  readonly hours: readonly number[];
  readonly triggers: readonly Trigger[];
  readonly settings: readonly Setting[];
  readonly types: readonly EventType[];
  readonly intensity: readonly Intensity[];
  readonly supports: readonly Support[];
  readonly worksRate: number;
}

const profiles: Record<string, Profile> = {
  "noa-levi": {
    perDay: 0.9,
    recentLift: 1.5,
    hours: [7, 15, 15, 16, 16, 16, 19],
    triggers: ["transition", "transition", "transition", "noise", "demand", "tired"],
    settings: ["car", "home", "school", "home"],
    types: ["sensoryOverload", "meltdown", "behavioralEvent", "sensoryOverload"],
    intensity: ["low", "moderate", "moderate", "high", "low"],
    supports: ["deepPressure", "quietSpace", "headphones", "countdown"],
    worksRate: 0.7,
  },
  "yusuf-nasser": {
    perDay: 0.75,
    recentLift: 2,
    hours: [18, 19, 19, 20, 20, 7, 16],
    triggers: ["screenOff", "screenOff", "screenOff", "denied", "demand", "tired"],
    settings: ["home", "home", "home", "outdoors"],
    types: ["behavioralEvent", "meltdown", "behavioralEvent", "other"],
    intensity: ["moderate", "moderate", "high", "low"],
    supports: ["countdown", "choices", "movementBreak", "quietSpace"],
    worksRate: 0.55,
  },
  "maya-cohen": {
    perDay: 0.55,
    recentLift: 0.5,
    hours: [19, 20, 20, 21, 21, 7],
    triggers: ["tired", "tired", "transition", "noise"],
    settings: ["bedtime", "bedtime", "home"],
    types: ["behavioralEvent", "sensoryOverload", "other"],
    intensity: ["low", "low", "moderate"],
    supports: ["visualTimer", "music", "deepPressure"],
    worksRate: 0.85,
  },
  "adam-khoury": {
    perDay: 0.7,
    recentLift: 1.4,
    hours: [7, 7, 8, 8, 12, 16],
    triggers: ["tired", "tired", "demand", "demand", "transition", "unknown"],
    settings: ["home", "school", "car"],
    types: ["behavioralEvent", "meltdown", "behavioralEvent"],
    intensity: ["moderate", "moderate", "high", "low"],
    supports: ["choices", "quietSpace", "movementBreak"],
    worksRate: 0.6,
  },
  "lian-ben-david": {
    perDay: 0.5,
    recentLift: 0.9,
    hours: [12, 13, 18, 18, 19],
    triggers: ["demand", "demand", "noise", "transition"],
    settings: ["home", "home", "outdoors"],
    types: ["sensoryOverload", "behavioralEvent", "other"],
    intensity: ["low", "low", "moderate"],
    supports: ["choices", "music", "deepPressure"],
    worksRate: 0.8,
  },
  "omar-saleh": {
    perDay: 0.45,
    recentLift: 0.6,
    hours: [7, 7, 8, 15, 17],
    triggers: ["transition", "transition", "demand", "denied"],
    settings: ["school", "car", "home"],
    types: ["behavioralEvent", "other", "meltdown"],
    intensity: ["low", "moderate", "low"],
    supports: ["visualTimer", "choices", "movementBreak"],
    worksRate: 0.8,
  },
  "shira-mizrahi": {
    perDay: 0.4,
    recentLift: 0.45,
    hours: [8, 13, 16, 16, 18],
    triggers: ["transition", "transition", "demand", "noise"],
    settings: ["home", "school", "outdoors"],
    types: ["behavioralEvent", "other"],
    intensity: ["low", "low", "moderate"],
    supports: ["visualTimer", "visualTimer", "countdown"],
    worksRate: 0.9,
  },
  "rami-awad": {
    perDay: 0.6,
    recentLift: 1.1,
    hours: [10, 11, 17, 17, 18],
    triggers: ["crowd", "crowd", "noise", "noise", "transition"],
    settings: ["store", "store", "outdoors", "home"],
    types: ["sensoryOverload", "sensoryOverload", "meltdown"],
    intensity: ["moderate", "high", "moderate", "low"],
    supports: ["headphones", "quietSpace", "deepPressure"],
    worksRate: 0.65,
  },
  "ella-friedman": {
    perDay: 0.35,
    recentLift: 0.2,
    hours: [2, 3, 21, 22],
    triggers: ["tired", "noise", "unknown"],
    settings: ["bedtime", "bedtime"],
    types: ["other", "behavioralEvent"],
    intensity: ["low", "low", "moderate"],
    supports: ["music", "deepPressure"],
    worksRate: 0.85,
  },
};

const beforeText: Record<Trigger, readonly string[]> = {
  transition: [
    "Picked up from school, told we were going straight to the dentist.",
    "Asked to leave the playground after a 5 minute warning.",
    "Moved from play to dinner without the timer.",
  ],
  noise: [
    "Neighbour started drilling while doing homework.",
    "Siblings were shouting during a board game.",
  ],
  demand: [
    "Asked to finish the reading worksheet before play.",
    "Asked to get dressed for school, second request.",
  ],
  denied: ["Asked for a second snack and was told no.", "Wanted to stay at a friend's house longer."],
  tired: ["Woke at 05:10, short nap skipped.", "Long day, late dinner, past usual bedtime."],
  crowd: ["Supermarket on Friday morning, very busy.", "Birthday party with about 20 children."],
  screenOff: [
    "Tablet time ended on the timer, mid-game.",
    "Television turned off for dinner.",
  ],
  unknown: ["Nothing obvious beforehand; playing alone.", "Calm morning until it started."],
};

const behaviorText: Record<EventType, readonly string[]> = {
  behavioralEvent: [
    "Shouted and threw a shoe, then hid under the table.",
    "Refused to move, hit the door twice.",
  ],
  meltdown: [
    "Crying and screaming, dropped to the floor, could not hear us.",
    "Kicking and crying for most of the episode, then very tired.",
  ],
  sensoryOverload: [
    "Covered ears, rocking, would not let anyone near.",
    "Hands over eyes, humming loudly, tried to run out.",
  ],
  other: ["Quiet and withdrawn, would not answer for a while.", "Repeated the same question many times."],
};

const reporters: Record<string, readonly string[]> = Object.fromEntries(
  children.map((child) => [child.id, child.caregivers.map((caregiver) => caregiver.name)]),
);

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(random: () => number, list: readonly T[]): T {
  return list[Math.floor(random() * list.length)] as T;
}

function buildEvents(): CareEvent[] {
  const events: CareEvent[] = [];

  children.forEach((child, childIndex) => {
    const profile = profiles[child.id];
    if (!profile) return;
    const random = seeded(childIndex * 7919 + 17);

    for (let dayOffset = 27; dayOffset >= 0; dayOffset -= 1) {
      const day = addDays(SAMPLE_TODAY, -dayOffset);
      const rate = dayOffset < 7 ? profile.perDay * profile.recentLift : profile.perDay;
      const count = Math.floor(rate * 1.2 + random() * 0.95 - 0.15);

      for (let n = 0; n < Math.max(0, count); n += 1) {
        const hour = pick(random, profile.hours);
        const minute = Math.floor(random() * 4) * 15;
        const at = `${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        if (at > SAMPLE_NOW) continue;

        const trigger = pick(random, profile.triggers);
        const type = pick(random, profile.types);
        const intensity = pick(random, profile.intensity);
        const helped = [pick(random, profile.supports)];
        if (random() > 0.6) {
          const second = pick(random, profile.supports);
          if (second !== helped[0]) helped.push(second);
        }
        const base = intensity === "high" ? 22 : intensity === "moderate" ? 12 : 6;
        const sinceLastSession = day > child.lastSession;

        events.push({
          id: `${child.id}-${day}-${n}`,
          childId: child.id,
          at,
          type,
          intensity,
          trigger,
          setting: pick(random, profile.settings),
          durationMin: base + Math.floor(random() * base),
          recoveryMin: Math.floor(base * 0.6 + random() * base),
          helped,
          helpedWorked: random() < profile.worksRate,
          before: pick(random, beforeText[trigger]),
          behavior: pick(random, behaviorText[type]),
          reporter: pick(random, reporters[child.id] ?? ["Caregiver"]),
          reviewed: !sinceLastSession || random() < 0.25,
          flagged: sinceLastSession && intensity === "high",
          quick: random() < 0.4,
        });
      }
    }
  });

  return events.sort((a, b) => (a.at < b.at ? 1 : -1));
}

export const events: readonly CareEvent[] = buildEvents();

/* -------------------------------------------------------------- routine */

function history(pattern: string): StepStatus[] {
  const map: Record<string, StepStatus> = {
    c: "completed",
    s: "skipped",
    d: "delayed",
    u: "upcoming",
    n: "current",
  };
  return [...pattern].map((char) => map[char] ?? "completed");
}

const defaultRoutine: readonly RoutineStep[] = [
  { id: "wake", time: "07:00", label: "Wake up with soft light", history: history("cccdcccccdcccc") },
  { id: "dress", time: "07:20", label: "Get dressed with picture checklist", history: history("cdcccsccdccccc") },
  { id: "breakfast", time: "07:40", label: "Breakfast at the same seat", history: history("cccccccccccccc") },
  { id: "pickup", time: "15:30", label: "Pickup with transition object", history: history("cdsdcdcdcsdcdu"), adjusted: true },
  { id: "decompress", time: "16:00", label: "Quiet decompression, 15 minutes", history: history("csscccdcccsccu") },
  { id: "dinner", time: "18:30", label: "Dinner with timer warning", history: history("ccccdcccccccdu") },
  { id: "bedtime", time: "19:45", label: "Bedtime visual schedule", history: history("cccccdcccccccu") },
];

export function getRoutine(childId: string): readonly RoutineStep[] {
  if (childId === "maya-cohen") {
    return defaultRoutine.map((step) =>
      step.id === "pickup" ? { ...step, history: history("ccccccccccccc" + "u"), adjusted: false } : step,
    );
  }
  return defaultRoutine;
}

/* -------------------------------------------------------------- surveys */

export function getSurveys(childId: string): readonly SurveyResult[] {
  const child = children.find((entry) => entry.id === childId);
  const strained = child?.status === "needsReview";
  return [
    {
      id: `${childId}-s3`,
      title: "Weekly caregiver check-in",
      sentAt: "2026-10-11",
      answeredAt: "2026-10-12",
      score: strained ? 54 : 72,
      previousScore: strained ? 63 : 66,
      highlight: strained
        ? "Caregiver stress rated 4 of 5; sleep rated poor on 3 nights."
        : "Mornings rated easier; caregiver confidence up.",
    },
    {
      id: `${childId}-s2`,
      title: "Weekly caregiver check-in",
      sentAt: "2026-10-04",
      answeredAt: "2026-10-05",
      score: strained ? 63 : 66,
      previousScore: 61,
      highlight: "Routine followed most days.",
    },
    {
      id: `${childId}-s1`,
      title: "Sensory profile follow-up",
      sentAt: "2026-09-21",
      answeredAt: "2026-09-23",
      score: 61,
      previousScore: null,
      highlight: "Noise sensitivity remains the strongest area.",
    },
  ];
}

/* ---------------------------------------------------------------- notes */

const practiceByFocus: Record<string, string> = {
  sensory: "Built a sensory menu together: squeeze, headphones, and a quiet corner. {name} chose headphones without a prompt.",
  transitions: "Rehearsed three planned switches with the transition card; {name} needed one adult prompt at the last switch.",
  emotionalRegulation: "Used the feelings thermometer before and after a frustrating game. {name} named 'yellow' and asked for a break.",
  communication: "Practiced the break card in play. {name} handed it over twice on his own, once with a gesture prompt.",
  sleep: "Walked through the bedtime visual schedule card by card. {name} put the cards in order with one correction.",
  feeding: "Food exploration at the table: touched and smelled two new textures, licked one. {name} stayed seated 12 minutes.",
  social: "Turn-taking with a shared building game. {name} waited for a turn four times with a visual 'my turn' cue.",
};

const observationByFocus: Record<string, string> = {
  sensory: "Home logs show recovery is faster when quiet space is offered before talking.",
  transitions: "Events cluster in the first 15 minutes after a change of place; warnings help only when they are visual.",
  emotionalRegulation: "Escalation is quicker on evenings after school days than on weekends.",
  communication: "Most events start when a request is not understood the first time; a picture choice shortens them.",
  sleep: "Short nights are followed by harder mornings almost every time in the logs.",
  feeding: "Mealtime events are short and end once a preferred food is on the plate.",
  social: "Busy group settings precede the hardest moments; one-to-one play is calm.",
};

const sessionTitle: Record<string, string> = {
  sensory: "Building a sensory menu",
  transitions: "Transition card practice",
  emotionalRegulation: "Feelings thermometer practice",
  communication: "Break card in play",
  sleep: "Bedtime schedule walkthrough",
  feeding: "Food exploration at the table",
  social: "Turn-taking with a shared game",
};

const observationTitle: Record<string, string> = {
  sensory: "Quiet space shortens recovery",
  transitions: "The first 15 minutes after a change",
  emotionalRegulation: "School days weigh on evenings",
  communication: "Requests that are not understood",
  sleep: "Short nights, hard mornings",
  feeding: "Mealtimes settle quickly",
  social: "Groups are the hard part",
};

const planByChild: Record<string, { title: string; body: string }> = {
  "noa-levi": { title: "Plan: a softer landing after pickup", body: "Hand Noa the transition object at the school gate, then go straight to ten quiet minutes in the car before any errand." },
  "yusuf-nasser": { title: "Plan: screens end with a countdown and a choice", body: "Five and two minute warnings on the visual timer, then Yusuf picks what comes next from two cards." },
  "maya-cohen": { title: "Plan: same five bedtime cards, same order", body: "Bath, pyjamas, two books, music, lights. Dana moves the card each step and Maya turns it over when done." },
  "adam-khoury": { title: "Plan: the break card lives on the fridge", body: "Honour the card every time Adam uses it, even mid-task. On short-sleep mornings, cut the morning list to three steps." },
  "lian-ben-david": { title: "Plan: one new texture, no request to eat", body: "Place one new texture beside a preferred food at four dinners. Praise touching or smelling it, nothing more." },
  "omar-saleh": { title: "Plan: drop-off with a job to do", body: "Omar carries the class register in from the gate. Layla says goodbye at the door with the same two sentences each day." },
  "shira-mizrahi": { title: "Plan: Shira starts the timer herself", body: "Fade the adult prompt: Shira sets the visual timer for each switch and tells the family what comes next." },
  "rami-awad": { title: "Plan: a ten-minute store visit with a job card", body: "Quiet hours only, headphones on before the door, and one job card: find three items and put them in the basket." },
  "ella-friedman": { title: "Plan: keep the room-light change", body: "Keep the dimmed night light and the same wind-down; Ruth logs any night waking with the time." },
};

export function getNotes(childId: string): readonly SessionNote[] {
  const child = children.find((entry) => entry.id === childId);
  const name = child?.givenName ?? "Child";
  const [primary = "transitions"] = child?.focus ?? [];
  const index = children.findIndex((entry) => entry.id === childId);
  const minutes = 30 + ((index * 7) % 20);
  const fillName = (text: string | undefined) => (text ?? "").replaceAll("{name}", name);
  return [
    {
      id: `${childId}-n3`,
      at: `${child?.lastSession ?? "2026-10-07"}T16:${String(10 + index * 5).padStart(2, "0")}`,
      kind: "session",
      title: sessionTitle[primary] ?? "Session summary",
      body: `${name} engaged for ${minutes} minutes. ${fillName(practiceByFocus[primary])}`,
    },
    {
      id: `${childId}-n2`,
      at: `2026-10-0${2 + (index % 3)}T09:${String(15 + index * 4).padStart(2, "0")}`,
      kind: "plan",
      title: planByChild[childId]?.title ?? "Plan for home",
      body: `Working goal: ${child?.goal ?? ""} ${planByChild[childId]?.body ?? ""} Review with the caregiver survey in two weeks.`,
    },
    {
      id: `${childId}-n1`,
      at: `2026-09-${28 - (index % 4)}T16:${String(20 + index * 3).padStart(2, "0")}`,
      kind: "observation",
      title: observationTitle[primary] ?? "What the logs show",
      body: `${observationByFocus[primary] ?? ""} ${child?.pattern ?? ""}`,
    },
  ];
}

/* ------------------------------------------------------------- messages */

const unreadNote: Record<string, string> = {
  "noa-levi": "Today was really hard after school. Should we skip the after-school club this week? I logged both events.",
  "yusuf-nasser": "Evenings are getting harder again when the tablet ends. The countdown worked once, then he threw it. What should we try tonight?",
  "adam-khoury": "Adam is sleeping badly since the clocks changed, mornings are a battle. Is it okay to move his session later?",
};

export function getThread(childId: string): readonly ThreadMessage[] {
  const child = children.find((entry) => entry.id === childId);
  const parent = child?.caregivers[0]?.name ?? "Caregiver";
  const name = child?.givenName ?? "your child";
  const waiting = child?.status === "needsReview";
  const thread: ThreadMessage[] = [
    {
      id: `${childId}-m1`,
      at: "2026-10-08T17:10",
      from: "therapist",
      author: therapist.name,
      kind: "recommendation",
      body: `From your logs: ${child?.pattern ?? ""} Before that moment, give ${name} one visual warning and say what comes next in one sentence. Log how the first 10 minutes go.`,
      read: true,
    },
    {
      id: `${childId}-m2`,
      at: "2026-10-10T20:05",
      from: "family",
      author: parent,
      kind: "reply",
      body: `We tried it three times. Twice it helped a lot, once nothing worked because we were late.`,
      read: true,
    },
    {
      id: `${childId}-m3`,
      at: "2026-10-11T08:30",
      from: "therapist",
      author: therapist.name,
      kind: "routineAdjustment",
      body: `I adjusted ${name}'s routine toward our goal: ${child?.goal ?? ""} The change shows in your app from today.`,
      read: true,
    },
  ];
  if (waiting) {
    thread.push({
      id: `${childId}-m4`,
      at: "2026-10-13T21:40",
      from: "family",
      author: parent,
      kind: "reply",
      body: unreadNote[childId] ?? `Could we talk about this week before the next session?`,
      read: false,
    });
  }
  return thread;
}

/* --------------------------------------------------------- appointments */

const sessionPlan: readonly [string, number, number, string, Appointment["mode"], string][] = [
  ["maya-cohen", 0, 0, "11:00", "clinic", "Bedtime schedule review"],
  ["omar-saleh", 0, 0, "13:30", "video", "School week check-in"],
  ["noa-levi", 0, 0, "15:30", "clinic", "After-school transitions"],
  ["rami-awad", 0, 0, "17:00", "home", "Store visit practice"],
  ["adam-khoury", 1, 0, "09:30", "clinic", "Break card practice"],
  ["lian-ben-david", 2, 0, "10:00", "clinic", "Texture exposure"],
  ["yusuf-nasser", 2, 0, "16:00", "video", "Evening screen endings"],
  ["shira-mizrahi", 5, 0, "15:00", "clinic", "Timer independence"],
  ["ella-friedman", 6, 0, "16:30", "video", "Sleep follow-up"],
  ["noa-levi", -2, 0, "15:30", "clinic", "After-school transitions"],
  ["yusuf-nasser", -1, 0, "16:00", "clinic", "Emotion check-ins"],
  ["shira-mizrahi", -2, 0, "10:00", "clinic", "Timer independence"],
  ["adam-khoury", -2, 0, "09:30", "clinic", "Break card practice"],
];

export const appointments: readonly Appointment[] = sessionPlan
  .map(([childId, dayOffset, , time, mode, focus], index) => ({
    id: `appt-${index}`,
    childId,
    start: `${addDays(SAMPLE_TODAY, dayOffset)}T${time}`,
    durationMin: mode === "home" ? 60 : 45,
    mode,
    focus,
  }))
  .sort((a, b) => (a.start < b.start ? -1 : 1));

/* -------------------------------------------------------------- reports */

export const reports: readonly ReportDocument[] = [
  {
    id: "r-noa-oct",
    childId: "noa-levi",
    title: "Monthly progress summary",
    period: "2026-09-14/2026-10-13",
    status: "draft",
    updatedAt: addMinutes(SAMPLE_NOW, -95),
    audience: "family",
  },
  {
    id: "r-yusuf-school",
    childId: "yusuf-nasser",
    title: "School coordination letter",
    period: "2026-09-01/2026-10-10",
    status: "ready",
    updatedAt: "2026-10-12T18:20",
    audience: "school",
  },
  {
    id: "r-maya-q3",
    childId: "maya-cohen",
    title: "Quarterly progress report",
    period: "2026-07-01/2026-09-30",
    status: "shared",
    updatedAt: "2026-10-03T12:00",
    audience: "family",
  },
  {
    id: "r-adam-team",
    childId: "adam-khoury",
    title: "Clinical team case review",
    period: "2026-08-15/2026-10-10",
    status: "draft",
    updatedAt: "2026-10-11T09:40",
    audience: "clinicalTeam",
  },
  {
    id: "r-shira-q3",
    childId: "shira-mizrahi",
    title: "Quarterly progress report",
    period: "2026-07-01/2026-09-30",
    status: "shared",
    updatedAt: "2026-10-02T15:10",
    audience: "family",
  },
];

export function getChild(childId: string): ChildFile | undefined {
  return children.find((child) => child.id === childId);
}

export function getChildEvents(childId: string): readonly CareEvent[] {
  return events.filter((event) => event.childId === childId);
}
