import type { Relation } from "@/features/more/types";

export type NotificationKey =
  "guidance" | "routine" | "checkIn" | "sessions" | "quietHours";

export interface ProfileScreenProps {
  readonly caregiver: {
    readonly name: string;
    readonly givenName: string;
    readonly relation: Relation;
    readonly email: string;
    readonly phone: string;
    readonly memberSince: string;
  };
  readonly childGivenName: string;
  readonly therapistGivenName: string;
  readonly notificationDefaults: Readonly<Record<NotificationKey, boolean>>;
  readonly onNotificationsChange?: (
    notifications: Readonly<Record<NotificationKey, boolean>>,
  ) => void;
}
