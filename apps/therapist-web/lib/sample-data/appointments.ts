/**
 * Appointments: week math and session-prep derivations over the sample
 * fixtures. Swap these for Supabase queries when the schema lands.
 */
import { eventsFor, eventsSince, medianRecovery } from "./analysis";
import { appointments, getChild, getNotes } from "./fixtures";
import { addDays, addMinutes, dayOf, SAMPLE_NOW, SAMPLE_TODAY, weekdayIndex } from "./time";
import type { Appointment, CareEvent, ChildFile, SessionNote } from "./types";

export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 19;

/** Monday of the week containing `day`. */
export function weekStartOf(day: string): string {
  return addDays(day, -weekdayIndex(day));
}

export function weekDays(start: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function sessionsInWeek(start: string): Appointment[] {
  const end = addDays(start, 7);
  return appointments.filter((session) => session.start >= start && session.start < end);
}

export function sessionEnd(session: Appointment): string {
  return addMinutes(session.start, session.durationMin);
}

export function isPast(session: Appointment): boolean {
  return sessionEnd(session) <= SAMPLE_NOW;
}

export function isUnderway(session: Appointment): boolean {
  return session.start <= SAMPLE_NOW && !isPast(session);
}

/** Next session today that has not started; falls back to the first upcoming one in the list. */
export function defaultSelection(sessions: readonly Appointment[]): string | null {
  const today = sessions.find((session) => dayOf(session.start) === SAMPLE_TODAY && session.start > SAMPLE_NOW);
  const upcoming = sessions.find((session) => session.start > SAMPLE_NOW);
  return (today ?? upcoming ?? sessions[0])?.id ?? null;
}

export interface SessionPrep {
  readonly session: Appointment;
  readonly child: ChildFile;
  readonly history: readonly CareEvent[];
  readonly since: readonly CareEvent[];
  readonly high: number;
  readonly recovery: number;
  readonly flagged: readonly CareEvent[];
  readonly note: SessionNote | null;
}

export function prepFor(session: Appointment): SessionPrep | null {
  const child = getChild(session.childId);
  if (!child) return null;
  const history = eventsFor(child.id);
  const since = eventsSince(history, child.lastSession);
  return {
    session,
    child,
    history,
    since,
    high: since.filter((event) => event.intensity === "high").length,
    recovery: medianRecovery(since),
    flagged: since.filter((event) => event.flagged).sort((a, b) => (a.at < b.at ? 1 : -1)),
    note: getNotes(child.id)[0] ?? null,
  };
}

export interface Placed {
  readonly session: Appointment;
  readonly lane: number;
  readonly lanes: number;
}

/** Side-by-side lanes for sessions that overlap within one day. */
export function placeInLanes(daySessions: readonly Appointment[]): Placed[] {
  const sorted = [...daySessions].sort((a, b) => (a.start < b.start ? -1 : 1));
  const placed: { session: Appointment; lane: number; cluster: number }[] = [];
  const clusterLanes: number[] = [];
  let laneEnds: string[] = [];
  let clusterEnd = "";
  let cluster = -1;
  for (const session of sorted) {
    if (session.start >= clusterEnd) {
      cluster += 1;
      laneEnds = [];
      clusterLanes[cluster] = 0;
    }
    let lane = laneEnds.findIndex((end) => end <= session.start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = sessionEnd(session);
    clusterEnd = laneEnds.reduce((max, end) => (end > max ? end : max), clusterEnd);
    clusterLanes[cluster] = Math.max(clusterLanes[cluster] ?? 0, lane + 1);
    placed.push({ session, lane, cluster });
  }
  return placed.map(({ session, lane, cluster: index }) => ({ session, lane, lanes: clusterLanes[index] ?? 1 }));
}
