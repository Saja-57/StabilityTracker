---
name: Stability Tracker Therapist Workspace
description: The Case File. Every child is a living case file pulled from a pressboard drawer.
colors:
  pressboard-deep: "#132A23"
  pressboard: "#1C362E"
  pressboard-raised: "#26443A"
  pressboard-line: "#335549"
  pressboard-ink: "#E9F0EA"
  pressboard-ink-muted: "#A7BDB2"
  pressboard-ink-faint: "#7F988C"
  sheet: "#F2F4F0"
  sheet-raised: "#FBFCFA"
  sheet-sunk: "#E7ECE6"
  sheet-rule: "#D3DCD5"
  sheet-rule-strong: "#B4C2B9"
  ink: "#13201B"
  ink-secondary: "#3B4D45"
  ink-muted: "#5F7069"
  tab-gold: "#E2B04F"
  tab-gold-ink: "#6E4A0E"
  tab-gold-wash: "#F7E8C6"
  tab-ruby: "#A3403A"
  tab-ruby-ink: "#8A2F2A"
  tab-ruby-wash: "#F4DEDA"
  tab-cobalt: "#2F5C8A"
  tab-cobalt-ink: "#244C74"
  tab-cobalt-wash: "#DDE7F1"
  tab-moss: "#3D7A5C"
  tab-moss-ink: "#2B5F46"
  tab-moss-wash: "#DCEBE2"
  tab-clay: "#B97A3A"
  tab-clay-wash: "#F2E4D3"
  intensity-low: "#5F8F79"
  intensity-moderate: "#B88019"
  intensity-high: "#A3403A"
  pen: "#2E4DA3"
  stamp: "#34506B"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Ubuntu, sans-serif"
    fontSize: "52px"
    fontWeight: 640
    lineHeight: 1.05
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 92"
  file-title:
    fontFamily: "Bricolage Grotesque, Ubuntu, sans-serif"
    fontSize: "56px"
    fontWeight: 640
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 92"
  headline:
    fontFamily: "Bricolage Grotesque, Ubuntu, sans-serif"
    fontSize: "21px"
    fontWeight: 640
    lineHeight: "28px"
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 92"
  title:
    fontFamily: "Bricolage Grotesque, Ubuntu, sans-serif"
    fontSize: "17px"
    fontWeight: 640
    lineHeight: "24px"
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 92"
  lede:
    fontFamily: "Ubuntu, Heebo, Cairo, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "28px"
  body:
    fontFamily: "Ubuntu, Heebo, Cairo, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Ubuntu, Heebo, Cairo, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  figure:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: "-0.01em"
    fontFeature: "'tnum' 1, 'zero' 1"
  stamp:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.08em"
    fontFeature: "'tnum' 1"
rounded:
  hairline: "3px"
  stamp: "6px"
  tab-label: "7px"
  button-sm: "9px"
  field: "10px"
  button-md: "11px"
  tile: "12px"
  block: "14px"
  folder: "16px"
  panel: "18px"
  sheet: "20px"
  full: "9999px"
spacing:
  hair: "3px"
  tight: "8px"
  group: "20px"
  folder: "28px"
  panel: "32px"
  section: "48px"
components:
  action-ink:
    backgroundColor: "{colors.pressboard}"
    textColor: "{colors.pressboard-ink}"
    rounded: "{rounded.button-md}"
    height: "40px"
    padding: "0 16px"
  action-ink-hover:
    backgroundColor: "{colors.pressboard-raised}"
  action-outline:
    backgroundColor: "{colors.sheet-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button-md}"
    height: "40px"
    padding: "0 16px"
  action-quiet-small:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.button-sm}"
    height: "32px"
    padding: "0 12px"
  tab-label-gold:
    backgroundColor: "{colors.tab-gold-wash}"
    textColor: "{colors.tab-gold-ink}"
    rounded: "{rounded.tab-label}"
    height: "24px"
    padding: "0 8px"
  tab-label-cobalt:
    backgroundColor: "{colors.tab-cobalt-wash}"
    textColor: "{colors.tab-cobalt-ink}"
    rounded: "{rounded.tab-label}"
    height: "24px"
    padding: "0 8px"
  tab-label-moss:
    backgroundColor: "{colors.tab-moss-wash}"
    textColor: "{colors.tab-moss-ink}"
    rounded: "{rounded.tab-label}"
    height: "24px"
    padding: "0 8px"
  count-action:
    backgroundColor: "{colors.tab-gold}"
    textColor: "{colors.pressboard-deep}"
    rounded: "{rounded.full}"
    height: "20px"
    padding: "0 6px"
  monogram:
    backgroundColor: "{colors.pressboard}"
    textColor: "{colors.pressboard-ink}"
    rounded: "{rounded.tile}"
    size: "44px"
  folder-front:
    backgroundColor: "{colors.sheet-raised}"
    rounded: "{rounded.folder}"
    padding: "{spacing.folder}"
  file-panel:
    backgroundColor: "{colors.sheet-raised}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  field-box:
    backgroundColor: "{colors.sheet-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "40px"
    padding: "0 12px"
  rail-tab-active:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    height: "44px"
  rail-tab:
    textColor: "{colors.pressboard-ink-muted}"
    height: "44px"
---

# Design System: Stability Tracker Therapist Workspace

## Overview

**Creative North Star: "The Case File"**

The therapist works at a desk. A deep forest-green pressboard frames the whole workspace: the rail, the drawer, and the margins around the reading surface. On top of it lies one cool, bright sheet of paper stock (never cream) that carries all reading. Each child is a folder. The desk shows which folders need the therapist and why. Opening a folder lifts it out of the stack into the full file, and the file's index tabs flip between its sections.

The world is dense and honest, not decorative. Numbers sit on a strict grid in tabular mono. Each child's fortnight appears as an event barcode with one bar per logged event. Dates are rubber-stamped. The therapist's own review shows up as ballpoint ink: a tick for reviewed and a loose loop for flagged. Status is carried by index-tab inks, and gold is rationed so it always means "this needs you". The build rejects the white KPI-tile dashboard with a generic sidebar.

The interface works the same in all three languages. English runs LTR, and Hebrew and Arabic run RTL. The rail moves to the right, joined tabs mirror their fillets, and directional glyphs flip.

**Key Characteristics:**
- Pressboard frame, sheet-stock reading surface, both with a faint fibre texture
- Index-tab color semantics with gold reserved for therapist action
- Tabular mono figures and tilted rubber stamps for dates and "now"
- Pen marks (tick and loop) as the therapist's review language
- Paper-weight motion: exponential ease-out, no bounce, content visible by default

## Colors

### Primary
- **Forest Pressboard** (pressboard): the workspace ground and the ink of primary actions ("Open file", "Reply"). Its deep and raised steps give the rail depth and hover states. Its line step is the only divider on the board.
- **Pressboard Inks** (pressboard-ink, -muted, -faint): text on the board. Muted is for inactive rail tabs and secondary lines, and faint is for group headings and the sample-data stamp.

### Secondary (index-tab inks)
- **Sunrise Gold** (tab-gold, with gold-ink text and gold-wash ground): needs the therapist's action. Examples are files awaiting review, families waiting on a reply, unreviewed counts, the next session, and the "since last session" band in the barcode.
- **Ruby** (tab-ruby, ruby-ink, ruby-wash): high intensity and skipped routine steps.
- **Cobalt** (tab-cobalt, cobalt-ink, cobalt-wash): information, such as "session today" and observation notes.
- **Moss** (tab-moss, moss-ink, moss-wash): steady status, goals, plans, and completed stamps.
- **Clay** (tab-clay, clay-wash): a quiet neutral-warm tone. Its wash takes secondary ink text.

### Tertiary (marks)
- **Ballpoint Blue** (pen): the therapist's hand. It covers pen ticks, pen loops, caret color, focus on sheet stock, and pen-toned stamps.
- **Stamp Slate** (stamp): rubber-stamped dates and "now" markers.
- **Intensity** (intensity-low, -moderate, -high): the bars of the event barcode and the intensity mark. They are chosen to reach 3:1 against the sheet.

### Neutral
- **Sheet Stock** (sheet, sheet-raised, sheet-sunk): sheet is the reading surface. Raised is for folders, panels, fields, and the active tab. Sunk is for back folders, inactive tabs, and hover wells.
- **Rules** (sheet-rule, sheet-rule-strong): hairlines, field rings, and dashed rules.
- **Inks** (ink, ink-secondary, ink-muted): text hierarchy on the sheet.

**The Gold Means You Rule.** Gold appears only where the therapist must act. Never use it for decoration, brand emphasis, or a primary button. Primary actions are forest pressboard ink.

**The Wash-and-Ink Rule.** A tab tone appears either as a wash with its matching ink text, or as a solid dot or bar. Solid gold never carries text except for the count badge, which uses pressboard-deep text.

**The Ruby Is Intensity Rule.** Ruby marks high intensity and skipped steps. It is not a generic error red for chrome.

## Typography

**Display Font:** Bricolage Grotesque at width 92 and weight 640, falling back to Ubuntu. Hebrew uses Heebo 800 and Arabic uses Cairo 800.
**Body Font:** Ubuntu for English, Heebo for Hebrew, and Cairo for Arabic.
**Label/Mono Font:** Geist Mono for figures, times, and stamps.

**Character:** A slightly condensed, inky grotesque names children and pages like labels on a folder. A plain humanist sans carries the reading, and a mono stamps the record.

### Hierarchy
- **Display** (640, 40px mobile to 52px desktop, 1.05): one page title per sheet, such as the desk greeting or "Correspondence".
- **File Title** (640, 40px to 56px, 1.02): the child's name at the head of an open file. It shares a view transition with the folder name.
- **Headline** (640, 21px, 28px): sheet section headings.
- **Title** (640, 17px, 24px): sub-section headings inside a panel. Folder names use display at 28 to 32px.
- **Lede** (400, 17px, 28px, max 58 to 60ch): the summary line under a page title and the folder's reason line.
- **Body** (400, 14px, 20px): list text and descriptions, with descriptions capped at 60ch.
- **Label** (500, 12px to 12.5px): tab labels, figure captions, and barcode legends.
- **Figure** (Geist Mono 26px, 32px, tabular, slashed zero): counts and durations. Times in lists use the same face at 14px.
- **Stamp** (Geist Mono 500, 10.5px to 12px, 0.08em, uppercase): dates, "now" markers, and the illustrative-data notice.

**The Grid-Locked Numerals Rule.** Every count, time, and duration uses tabular figures in Geist Mono so columns align.

**The Script Swap Rule.** In Hebrew and Arabic, display type switches to Heebo or Cairo at 800 with no width axis. Do not set Latin display faces over RTL scripts.

## Layout

The desktop layout (lg and up) is a two-column frame: a 15.5rem pressboard rail and the sheet. The sheet floats with 12px of pressboard showing on its top, bottom, and end edges, and it scrolls internally. A sticky search bar sits at the top of the sheet and gains a sheet background and hairline once scrolled. Below lg, the rail becomes a drawer that slides in from the start edge, and a slim board header carries the menu, the logo mark, and search.

Content inside the sheet is padded 32px at lg, 24px at sm, and 16px on mobile. Major bands are separated by 48px. The desk and similar pages use a 1.55 : 1 split above xl, with the side column at least 19rem, and stack below it. Groups within a band use a 20px rhythm. Folder faces pad 28px, or 20px on mobile, and file panels pad 32px. Dated lists such as events and notes use a 9rem stamp column beside the content.

**The One Sheet Rule.** All reading happens on the single sheet laid on the board. Do not place reading content directly on pressboard, and do not tile the sheet into floating cards.

## Elevation & Depth

Depth is physical paper. The sheet has a fibre texture and sits on the pressboard with a long, soft drop shadow and a white top-edge highlight. Folders and panels sit on the sheet with a shorter folder shadow. The front folder of a stack lifts higher than the rest. Pressed buttons get a tight press shadow and drop 1px when active. Back folders recede by sinking to sheet-sunk, stepping up 30px each, and scaling down 1.8% per level. The exact shadow strings are in the sidecar.

**The Paper Weight Rule.** Shadows always fall downward with a soft offset and an inset white top edge, as paper would. Do not use glows, hard offset blocks, or colored shadows.

## Shapes

Corners are soft and graduate with size. Barcode bars use 3px, stamps 6px, tab labels 7px, small buttons 9px, fields 10px, medium buttons 11px, inline blocks 14px, folders 16px, file panels 18px, and the sheet 20px (16px on mobile). Index tabs round only their top corners. The active rail tab is joined to the sheet with concave fillets, and those fillets mirror in RTL. The only full circles are count badges, timeline nodes, tone dots, and the therapist's avatar.

**The Tab Joins the Sheet Rule.** An active index tab shares its surface color with the sheet or panel below it, so the tab and its page read as one piece of stock.

## Components

### Actions
- **Shape:** 11px corners at 40px height, or 9px at 32px for small.
- **Ink (primary):** forest pressboard with pressboard-ink text, a press shadow, a raised-board hover, and a 1px drop when active. Use it for "Open file", "Reply", and send.
- **Outline:** sheet-raised with a rule ring that turns strong on hover. Use it for secondary actions beside an ink action.
- **Quiet:** text only with a sunk-sheet hover, for links such as "Full week".
- **Focus:** a 2px outline offset by 2px. It is gold on the board and pen blue on the sheet.

### Tab Labels
Tab labels are 24px pills with 7px corners: a tone wash, a 6px solid tone dot, and 12px medium text in the tone's ink. They state file status: needs review (gold), session today (cobalt), and steady (moss).

### Folder Stack (signature)
Files that need the therapist stack as physical folders. Back folders show only their gold-wash index tabs, and choosing a tab pulls that folder to the front. The front folder is sheet-raised with the lift shadow, and its tab carries a 3px gold top edge. A folder face holds the monogram, the name in display type, the reason line, a 28-day event barcode with the since-session band in gold wash, three figures above a dashed rule, and the ink "Open file" action.

### Index Tabs (file sections)
Index tabs are 44px high with top-rounded 13px corners. The active tab is sheet-raised and joins the panel. Inactive tabs are sunk at 80% opacity. An unreviewed count appears as a gold count badge.

### Event Barcode (signature)
Each day gets one column, and each logged event (up to four) gets one bar. Bar heights are 40%, 70%, and 100% by intensity, in the intensity colors. Empty days show a 3px rule dash, and today is marked with a dot above its column. Bars grow up from the baseline on entry.

### Monogram
A monogram is one pressboard tile with display-face initials and an inset board-line ring. Sizes are 32, 44, and 64px (80px at the head of a file), with corners scaling from 9 to 20px.

### Stamps and Pen Marks
- **Date stamp:** stamp-slate mono in a 1.5px current-color border, tilted -2 to -6 degrees, multiplied onto the paper, and pressed in on entry. Pen and moss tones are allowed for "next session" and done states.
- **Pen tick:** a 32px checkbox showing an uneven ballpoint tick drawn in pen blue. When unchecked it is an empty strong-rule square.
- **Pen loop:** a loose ballpoint ellipse drawn around a flagged item.

### Inputs
- **Boxed field:** sheet-raised with a rule ring and 10px corners. On focus the ring turns pen blue.
- **Line field:** for writing notes. It has a single strong-rule underline with no box, and the underline turns pen blue on focus.

### Navigation (rail)
The rail is pressboard. Tabs are 44px rows with a 20px duotone glyph. Inactive tabs are muted ink and get a raised-board hover. The active tab is a sheet-colored index tab joined to the sheet. Counts are mono pills: gold when they need action, otherwise board-raised. The practice and workspace name sit at the top. The therapist's name, the language switcher, and an illustrative-data stamp sit at the foot.

### Glyphs
Glyphs are custom duotone SVGs on a 24px grid with a 1.6 stroke, round caps and joins, and one tinted plane at 16% current color. Directional glyphs mirror in RTL.

### Motion
Motion follows paper weight. Easing is exponential ease-out (paper ease), and there is no bounce. Sheets settle in, folders rise with a slight tilt, stamps press, pens draw, and bars grow. Opening a file is a shared-element view transition of the monogram and name. Content is visible by default, and motion only adds to it. With reduced motion, animations are removed.

## Do's and Don'ts

### Do:
- **Do** use forest pressboard ink for the primary action on any sheet.
- **Do** reserve gold for items that need the therapist's action, and pair gold wash with gold-ink text.
- **Do** set every number and time in Geist Mono with tabular figures.
- **Do** stamp dates in stamp slate, and mark the therapist's review only with pen ticks and pen loops.
- **Do** draw new icons as 24px duotone glyphs that match the existing set.
- **Do** test every surface in he and ar. That covers the mirrored rail, the joined-tab fillets, and the Heebo or Cairo display faces.

### Don't:
- **Don't** use gold for primary buttons, decoration, or emphasis that asks nothing of the therapist.
- **Don't** use cream or warm paper for the sheet. The stock is cool and bright.
- **Don't** break reading content into floating white KPI tiles on a plain background.
- **Don't** import a generic icon library into the product chrome.
- **Don't** use bounce or elastic easing, and don't hide content until an animation runs.
- **Don't** use uppercase tracked labels as section kickers. The tracked mono stamp is only for dates, "now", and the sample-data notice.
