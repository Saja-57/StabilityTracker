import * as Notifications from "expo-notifications";
import { router, type Href } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { useFamilyStore } from "@/providers/family-store-provider";
import { useLanguage } from "@/providers/language-provider";

import { fill } from "./format";
import { deviceStore } from "./storage";
import { useFamilyContent } from "./use-family-content";
import { useRoutineDay } from "./use-routine-day";

/**
 * Local reminders, scheduled by the phone itself, so they work before sign-in
 * and with no server. iOS mirrors them to a paired Apple Watch, buttons
 * included.
 */

const routineCategory = "routine-step";
const doneAction = "done";
const channelId = "reminders";
const leadMinutes = 5;
const checkInTime = { hour: 18, minute: 0 };
const handledKey = "lastHandledNotification";

type ReminderData =
  | { readonly kind: "routine"; readonly stepId: string }
  | { readonly kind: "checkIn" };

Notifications.setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

/** "HH:mm" minus the lead time, as hour and minute of the day. */
function reminderTime(time: string): { hour: number; minute: number } {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const total = (hours * 60 + minutes - leadMinutes + 24 * 60) % (24 * 60);
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/** Quiet evenings hold everything from 20:00 to 07:00. */
const isQuiet = ({ hour }: { hour: number }) => hour >= 20 || hour < 7;

/** Expo counts weekdays from 1 = Sunday. */
function weekdayOf(date: string): number {
  return new Date(`${date}T12:00:00`).getDay() + 1;
}

const responseId = (response: Notifications.NotificationResponse) =>
  `${response.notification.request.identifier}:${response.actionIdentifier}:${response.notification.date}`;

/** Keeps the scheduled reminders in step with the Profile switches. */
export function useReminders() {
  const { t } = useLanguage();
  const { family, schedule, weeklySurvey } = useFamilyContent();
  const { notifications } = useFamilyStore().record;
  const { complete } = useRoutineDay();
  const completeRef = useRef(complete);
  useEffect(() => {
    completeRef.current = complete;
  }, [complete]);

  const wantsRoutine = notifications.routine;
  const wantsCheckIn = notifications.checkIn;
  const quiet = notifications.quietHours;

  useEffect(() => {
    if (Platform.OS === "web") return;
    let cancelled = false;

    const sync = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      if (!wantsRoutine && !wantsCheckIn) return;

      const permission = await Notifications.requestPermissionsAsync();
      if (cancelled || !permission.granted) return;

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(channelId, {
          name: t("reminders.channel"),
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
      await Notifications.setNotificationCategoryAsync(routineCategory, [
        {
          identifier: doneAction,
          buttonTitle: t("reminders.routine.done"),
          options: { opensAppToForeground: false },
        },
      ]);

      const jobs: Promise<string>[] = [];
      if (wantsRoutine) {
        for (const step of schedule) {
          const at = reminderTime(step.time);
          if (quiet && isQuiet(at)) continue;
          const data: ReminderData = { kind: "routine", stepId: step.id };
          jobs.push(
            Notifications.scheduleNotificationAsync({
              content: {
                title: fill(t("reminders.routine.title"), { time: step.time }),
                body: step.title,
                categoryIdentifier: routineCategory,
                data,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                ...at,
                channelId,
              },
            }),
          );
        }
      }
      if (wantsCheckIn && !(quiet && isQuiet(checkInTime))) {
        const data: ReminderData = { kind: "checkIn" };
        jobs.push(
          Notifications.scheduleNotificationAsync({
            content: {
              title: t("reminders.checkIn.title"),
              body: fill(t("reminders.checkIn.body"), {
                name: family.therapist.givenName,
              }),
              data,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
              weekday: weekdayOf(weeklySurvey.id.slice(-10)),
              ...checkInTime,
              channelId,
            },
          }),
        );
      }
      await Promise.all(jobs);
    };

    void sync().catch(() => {
      // Reminders are a convenience; the app works the same without them.
    });
    return () => {
      cancelled = true;
    };
  }, [
    family.therapist.givenName,
    quiet,
    schedule,
    t,
    wantsCheckIn,
    wantsRoutine,
    weeklySurvey.id,
  ]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const handle = (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content
        .data as Partial<ReminderData> | null;
      void deviceStore.write(handledKey, responseId(response));
      if (data?.kind === "routine" && data.stepId) {
        if (response.actionIdentifier === doneAction) {
          completeRef.current(data.stepId);
        } else {
          router.navigate("/routine" as Href);
        }
      } else if (data?.kind === "checkIn") {
        router.push("/surveys" as Href);
      }
    };

    // A tap or a "Mark done" that launched the app from closed.
    const last = Notifications.getLastNotificationResponse();
    if (last) {
      void deviceStore.read<string>(handledKey).then((handled) => {
        if (handled !== responseId(last)) handle(last);
      });
    }

    const subscription =
      Notifications.addNotificationResponseReceivedListener(handle);
    return () => subscription.remove();
  }, []);
}
