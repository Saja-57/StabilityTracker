---
version: 1
slug: "apps-parent-mobile"
primary_target: "apps/parent-mobile"
related_targets: []
---

# Parent mobile app

Scope: the whole parent/caregiver Expo app (tabs Home, Routine, Log, Messages, More; plus Surveys, Appointments, Family, Profile, Resources, Ask). Mode: Operate.
Audience and job: a parent or caregiver on a phone, often one-handed, sometimes mid-meltdown. They follow the day's routine, capture what happened, read the therapist's guidance, and answer short check-ins.
Constraints: trilingual (en LTR; he and ar RTL), translation keys only, sample data isolated and labeled illustrative, approved logo PNGs untouched, no emojis, no lucide icons in product chrome, logical start/end styles only, no backend imports in features.
World: the established Case File system (apps/therapist-web/DESIGN.md), extended for the family side of the loop.
Build path: code-led. The user delegated structural choices.

## Direction contract

THESIS: The family's side of the case file lives on the fridge door. Home is the visual schedule families already stick on their fridge: picture cards in order, the therapist's latest note held up by a magnet, and help always within thumb reach. It refuses the generic wellness app with a grid of pastel cards and a chatbot.

OWN-WORLD: Cool sheet-stock ground (the fridge enamel). The pressboard-green tab bar is the board the app rests on, and the active tab is joined to the sheet. Picture cards are authored duotone pictograms on raised sheet tiles. Pen-blue ticks mark what is done. The therapist's notes are paper slips held by a pressboard magnet. Slate rubber-stamp dates. Gold appears only for what waits on the parent (unread guidance, a check-in). Ruby never shames: intensity is a neutral signal.

STORY: The parent opens the app and sees what is happening now and what is next, in pictures. They tick it off with one thumb. When things go wrong, one docked action ("Something's happening") opens calm support first and capture second. Guidance from the therapist lands as a note on the door.

FIRST VIEWPORT: A greeting and slate date stamp. The child chip (Noa). The NOW picture card is large: pictogram, step, time, and a "Done" pen tick. Beside it the next card peeks. Below, the horizontal schedule strip. Then the magnet-held therapist note with a gold unread dot. The docked "Something's happening" action sits above the pressboard tab bar.

FORM: The fridge door (dealt structure 7, seed key ec573406, surface scope inside the Case File world). Signature interaction: ticking a picture card. The pen stroke draws, the card settles into the done rail, and the next card slides into NOW. Motion grammar: paper weight, spring-free ease-out, reduced motion respected.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
