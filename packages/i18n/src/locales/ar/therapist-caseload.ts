import type { enTherapistCaseload } from "../en/therapist-caseload";

export const arTherapistCaseload = {
  "caseload.title": "ملفاتك",
  "caseload.summary": "{total} أطفال في رعايتك. {review} ملفات بحاجة إلى مراجعتك و{today} لديهم جلسة اليوم.",
  "caseload.filterLabel": "تصفية الملفات",
  "caseload.filter.all": "الكل",
  "caseload.search": "البحث عن طفل",
  "caseload.sortLabel": "ترتيب الملفات",
  "caseload.sort.attention": "الأحوج للانتباه أولًا",
  "caseload.sort.next": "الجلسة التالية",
  "caseload.sort.name": "الاسم",
  "caseload.empty.title": "لا توجد ملفات مطابقة",
  "caseload.empty.description": "جرّب تصفية أخرى أو امسح البحث.",
  "caseload.noSession": "لا توجد جلسة محجوزة",
  "caseload.sinceSession": "منذ الجلسة الأخيرة: {count}",
} as const satisfies Record<keyof typeof enTherapistCaseload, string>;
