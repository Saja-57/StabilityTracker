import type { enTherapistCaseload } from "../en/therapist-caseload";

export const heTherapistCaseload = {
  "caseload.title": "התיקים שלך",
  "caseload.summary": "{total} ילדים בטיפולך. {review} תיקים ממתינים לסקירה שלך ול־{today} יש מפגש היום.",
  "caseload.filterLabel": "סינון תיקים",
  "caseload.filter.all": "הכול",
  "caseload.search": "חיפוש ילד/ה",
  "caseload.sortLabel": "מיון תיקים",
  "caseload.sort.attention": "קודם מה שדורש תשומת לב",
  "caseload.sort.next": "המפגש הבא",
  "caseload.sort.name": "שם",
  "caseload.empty.title": "אין תיקים תואמים",
  "caseload.empty.description": "נסו סינון אחר או נקו את החיפוש.",
  "caseload.noSession": "לא נקבע מפגש",
  "caseload.sinceSession": "מאז המפגש האחרון: {count}",
} as const satisfies Record<keyof typeof enTherapistCaseload, string>;
