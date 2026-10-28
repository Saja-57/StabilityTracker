import type { enParentRoutine } from "../en/parent-routine";

export const heParentRoutine = {
  "routineDay.progress": "{done} מתוך {total} הושלמו",
  "routineDay.progressA11y": "{done} מתוך {total} צעדים הושלמו היום",
  "routineDay.allDone": "כל הכרטיסים סומנו להיום.",
  "routineDay.now": "עכשיו",
  "routineDay.until": "{start} עד {end}",
  "routineDay.adjustedBy": "הותאם על ידי {name}",
  "routineDay.suggestion": "תמיכה מוצעת: {support}",
  "routineDay.markDone": "סימון כבוצע",
  "routineDay.undo": "ביטול",
  "routineDay.tick": "סימון {step} כבוצע",
  "routineDay.untick": "ביטול הסימון של {step}",
  "routineDay.doneBy": "בוצע על ידי {name} ב־{time}",
  "routineDay.expandHint": "מציג את הפרטים ואת פעולת הסימון",
  "routineDay.collapseHint": "מסתיר את הפרטים",
  "routineDay.loading": "מכינים את הכרטיסים של היום",
  "routineDay.empty.title": "אין כרטיסים על המקרר היום",
  "routineDay.empty.detail": "כשהשגרה של היום תוגדר, כרטיסי התמונות שלה יופיעו כאן לפי הסדר.",
  "routineDay.error.title": "הכרטיסים לא נטענו",
  "routineDay.error.detail": "בדרך כלל זו תקלה רגעית בחיבור. אפשר לנסות שוב מתי שנוח.",
  "routineDay.retry": "לנסות שוב",
} as const satisfies Record<keyof typeof enParentRoutine, string>;
