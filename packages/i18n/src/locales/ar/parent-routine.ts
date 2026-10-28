import type { enParentRoutine } from "../en/parent-routine";

export const arParentRoutine = {
  "routineDay.progress": "اكتمل {done} من {total}",
  "routineDay.progressA11y": "اكتملت {done} من {total} خطوات اليوم",
  "routineDay.allDone": "تم وضع علامة على كل البطاقات لليوم.",
  "routineDay.now": "الآن",
  "routineDay.until": "من {start} إلى {end}",
  "routineDay.adjustedBy": "تعديل من {name}",
  "routineDay.suggestion": "دعم مقترح: {support}",
  "routineDay.markDone": "تحديد كمنجز",
  "routineDay.undo": "تراجع",
  "routineDay.tick": "تحديد {step} كمنجز",
  "routineDay.untick": "التراجع عن {step}",
  "routineDay.doneBy": "أُنجز بواسطة {name} عند {time}",
  "routineDay.expandHint": "يعرض التفاصيل وزر الإنجاز",
  "routineDay.collapseHint": "يخفي التفاصيل",
  "routineDay.loading": "نجهّز بطاقات اليوم",
  "routineDay.empty.title": "لا توجد بطاقات على الثلاجة اليوم",
  "routineDay.empty.detail": "عند إعداد روتين اليوم، تظهر بطاقاته المصورة هنا بالترتيب.",
  "routineDay.error.title": "لم يتم تحميل البطاقات",
  "routineDay.error.detail": "غالبًا ما يكون هذا خللًا مؤقتًا في الاتصال. حاول مجددًا متى شئت.",
  "routineDay.retry": "حاول مجددًا",
} as const satisfies Record<keyof typeof enParentRoutine, string>;
