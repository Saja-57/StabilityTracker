---
version: 1
slug: "apps-therapist-web"
primary_target: "apps/therapist-web"
related_targets: []
---

# Therapist web app

Scope: whole therapist web app (shell, dashboard, caseload, child file, appointments, messages, reports, insights, notes, settings). Mode: Operate.
Audience and job: pediatric developmental and behavioral clinicians reviewing home-captured events between sessions, then adjusting routines and sending guidance.
Constraints: trilingual (en LTR; he and ar RTL), translation keys only, sample data isolated and labeled illustrative, approved logo PNGs untouched, no emojis, no generic icon library in product chrome.
Build path: code-led (no image generation in this session).
User delegated the direction choice explicitly ("I want you to be the one who chooses").

## Direction contract

THESIS: Every child is a living case file. The therapist pulls a file from the drawer, flips its index tabs, and the front sheet says what changed since the last session. It refuses the category default of a white KPI-tile dashboard with a sidebar.

OWN-WORLD: A deep forest-green pressboard ground (#1F3B33 family) frames everything. Cool, bright sheet stock (not cream) carries all reading. Index tabs mark status: sunrise gold only for "needs your action", ruby for high intensity, cobalt for information. Rubber-stamp dates are set in mono. Each child has a dense, honest event barcode. Pen ticks mark reviewed items and pen circles mark flagged ones. One strict grid, with tabular grid-locked numerals. Custom duotone SVG icons are drawn on a 24-pixel grid.

STORY: The therapist opens the app and sees, on today's desk, whose file needs attention and why. They pull a file, read the stamped summary and the antecedent, behavior, and response patterns, then send guidance or adjust a routine without leaving the file.

FIRST VIEWPORT: The pressboard rail sits on the left (right in RTL), with the logo mark, index-tab navigation, and the therapist's name at the foot. The desk is a light sheet laid on the pressboard with a date stamp, then a "files that need you" stack: overlapping folder sheets with a gold tab, the child's name in display type, an event barcode, and a one-line pattern. Beside it are today's sessions as a timeline strip. The primary action ("Open file") sits on each top folder.

FORM: The Case File (position 6 on the ordered list). Seed key b1512ae5. Signature interaction: pulling a file. A folder lifts out of the drawer into the full child file (shared-element view transition), and its index tabs flip sections. Motion grammar: paper weight, exponential ease-out, no bounce, everything visible by default, reduced motion respected.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
