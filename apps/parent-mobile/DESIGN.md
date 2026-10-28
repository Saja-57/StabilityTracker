---
name: Stability Tracker Parent App
description: The Case File, family side. The child's case file lives on the fridge door.
colors:
  pressboard-deep: "#132A23"
  pressboard: "#1C362E"
  pressboard-raised: "#26443A"
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
  tab-ruby-ink: "#8A2F2A"
  tab-ruby-wash: "#F4DEDA"
  tab-cobalt-ink: "#244C74"
  tab-cobalt-wash: "#DDE7F1"
  tab-moss-ink: "#2B5F46"
  tab-moss-wash: "#DCEBE2"
  intensity-low: "#5F8F79"
  intensity-moderate: "#B88019"
  intensity-high: "#A3403A"
  pen: "#2E4DA3"
  stamp: "#34506B"
typography:
  hero:
    fontFamily: "Bricolage Grotesque, Heebo, Cairo, sans-serif"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: "42px"
    letterSpacing: "-0.6px"
  display:
    fontFamily: "Bricolage Grotesque, Heebo, Cairo, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "34px"
    letterSpacing: "-0.6px"
  title:
    fontFamily: "Bricolage Grotesque, Heebo, Cairo, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "-0.6px"
  headline:
    fontFamily: "Bricolage Grotesque, Heebo, Cairo, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "24px"
    letterSpacing: "-0.6px"
  lede:
    fontFamily: "Ubuntu, Heebo, Cairo, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "25px"
  body:
    fontFamily: "Ubuntu, Heebo, Cairo, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Ubuntu, Heebo, Cairo, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: "20px"
  small:
    fontFamily: "Ubuntu, Heebo, Cairo, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  caption:
    fontFamily: "Ubuntu, Heebo, Cairo, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: "17px"
  figure:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: "20px"
    fontFeature: "'tnum' 1"
  figure-large:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: "32px"
    fontFeature: "'tnum' 1"
  stamp:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "14px"
    letterSpacing: "1px"
    fontFeature: "'tnum' 1"
rounded:
  slip: "6px"
  stamp: "6px"
  tab-label: "8px"
  sm: "10px"
  tick-box: "12px"
  md: "14px"
  tab-foot: "18px"
  lg: "20px"
  xl: "26px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  gutter: "20px"
  xl: "24px"
  xxl: "32px"
  xxxl: "48px"
components:
  action-ink:
    backgroundColor: "{colors.pressboard}"
    textColor: "{colors.pressboard-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 24px"
  action-ink-large:
    backgroundColor: "{colors.pressboard}"
    textColor: "{colors.pressboard-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "56px"
    padding: "0 24px"
  action-outline:
    backgroundColor: "{colors.sheet-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 24px"
  action-quiet-small:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "38px"
    padding: "0 12px"
  paper:
    backgroundColor: "{colors.sheet-raised}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  paper-sunk:
    backgroundColor: "{colors.sheet-sunk}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  picture-card-now:
    backgroundColor: "{colors.sheet-raised}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  picture-tile:
    backgroundColor: "{colors.tab-moss-wash}"
    rounded: "{rounded.lg}"
    size: "70px"
  pen-tick:
    rounded: "{rounded.tick-box}"
    size: "44px"
  pen-tick-checked:
    backgroundColor: "{colors.tab-cobalt-wash}"
    rounded: "{rounded.tick-box}"
    size: "44px"
  tab-label-gold:
    backgroundColor: "{colors.tab-gold-wash}"
    textColor: "{colors.tab-gold-ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.tab-label}"
    height: "24px"
    padding: "0 8px"
  tab-label-cobalt:
    backgroundColor: "{colors.tab-cobalt-wash}"
    textColor: "{colors.tab-cobalt-ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.tab-label}"
    height: "24px"
    padding: "0 8px"
  tab-label-moss:
    backgroundColor: "{colors.tab-moss-wash}"
    textColor: "{colors.tab-moss-ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.tab-label}"
    height: "24px"
    padding: "0 8px"
  date-stamp:
    textColor: "{colors.stamp}"
    typography: "{typography.stamp}"
    rounded: "{rounded.stamp}"
    padding: "3px 8px"
  magnet:
    backgroundColor: "{colors.pressboard-raised}"
    rounded: "{rounded.pill}"
    size: "26px"
  note-slip:
    backgroundColor: "{colors.sheet-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slip}"
    padding: "22px 20px 20px"
  visit-ticket:
    backgroundColor: "{colors.sheet-raised}"
    rounded: "{rounded.xl}"
    padding: "20px"
  count-badge:
    backgroundColor: "{colors.tab-gold}"
    textColor: "{colors.pressboard-deep}"
    rounded: "{rounded.lg}"
    height: "20px"
    width: "20px"
  tab-bar:
    backgroundColor: "{colors.pressboard}"
    textColor: "{colors.pressboard-ink-muted}"
    typography: "{typography.caption}"
    height: "62px"
  tab-bar-active:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tab-foot}"
    height: "62px"
  log-disc:
    backgroundColor: "{colors.sheet-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "60px"
  log-disc-active:
    backgroundColor: "{colors.pressboard-raised}"
    textColor: "{colors.pressboard-ink}"
    rounded: "{rounded.pill}"
    size: "60px"
---

# Design System: Stability Tracker Parent App

This file extends the Case File world. The normative world lives in `apps/therapist-web/DESIGN.md` and its sidecar. That file owns the palette doctrine, the pressboard and sheet materials, the tab inks, the stamps and pen marks, the glyph grammar, and the motion grammar. This file records only what the parent app adds or changes for a phone. Where the two disagree on a mobile surface, this file wins. Everywhere else, the world file wins.

The color values above are not a fork. They come from the shared `caseFile` export in `@stability/design-tokens`, the same source the therapist workspace uses. They are restated here only so that component tokens can resolve. Never edit them here alone.

## Overview

**Creative North Star: "The Fridge Door"** (inside "The Case File")

The family's side of the case file lives on the fridge door. The cool sheet ground is the enamel. Picture cards are raised sheet tiles in schedule order. The therapist's notes are paper slips held up by a pressboard magnet. Visits are perforated tickets. The app rests on a pressboard board, the tab bar, and the active tab joins the sheet above it. Done things carry a pen-blue ballpoint tick. Dates are slate rubber stamps. Gold appears only for what waits on the parent.

The parent often uses the app one-handed, sometimes during a meltdown. So everything is set larger than on the therapist's desk. Targets are at least 44px, body text is 16px, and one docked action ("Something's happening") is always within thumb reach.

The app works in three languages: en (LTR) and he and ar (RTL). Every row mirrors through the shared direction helpers, and only logical start and end edges are used. Sample family content is illustrative. It is localized through `useFamilyContent`, and any data string placed inside translated text is wrapped in a first-strong isolate (`isolate()`) so mixed-direction runs read correctly.

## Colors

The roles are the world's roles. Mobile adds no new hues.

### Primary
- **Pressboard** is the board: the tab bar, the ink action, the ticket stub, the child monogram, and the border of the NOW card.
- **Pressboard Raised** is the magnet and the active Log disc.

### Neutral
- **Sheet** is the ground of every screen (the fridge enamel) and the fill of the active tab.
- **Sheet Raised** is every tile, slip, ticket, and picture card. **Sheet Sunk** is quiet panels and finished routine steps.
- **Rules** draw dividers, the open pen-tick box (strong rule), and ticket perforations (strong rule, dashed).

### Tab inks
- **Gold** marks what waits on the parent: the unread dot on a magnet, the Messages count badge, and the "waiting" check-in label.
- **Cobalt wash** marks the therapist's adjustments and fills a ticked box behind the pen mark.
- **Moss wash** is the ground for the NOW pictogram and the "done" stamps.
- **Ruby** is never used for shame. On the parent side, intensity colors appear only in the event barcode and recent-moment bars, and they are read as neutral signals.

**The Waiting-On-You Rule.** Gold appears only where the parent owes something: an unread note, an open check-in, or an unread count. Gold never fills a button, a header, or a decoration. The `gold` Action variant exists in code, but no screen uses it, and none should.

**The Pen Is Done Rule.** Pen blue means that something is finished: a tick, or the time a step was done next to who did it. Pen blue is never used for links or emphasis.

## Typography

**Display Font:** Bricolage Grotesque 700 in en. In he and ar, Heebo 800 and Cairo 800 replace it, with tracking reset to 0.
**Body Font:** Ubuntu 400/500 in en. Heebo or Cairo in he and ar, picked by the direction helper.
**Numeral Font:** Geist Mono 500 with tabular figures.

The display face carries four steps: hero (one per screen, the greeting or screen title), display, title (picture-card step names), and headline (section titles). On a phone the ramp is set heavier than the world's variable 640 at width 92, because React Native loads static cuts. That divergence is deliberate and stays on mobile.

**The Numerals-Only Mono Rule.** Geist Mono sets times, counts, and day numbers, and nothing else. It sets those in every language, because the digits are shared.

**The Script's Own Stamp Rule.** Stamps are uppercase, tracked 1px, in Geist Mono only in en. In he and ar a stamp uses the script's own body face with no tracking and no case change. Geist Mono has no Hebrew or Arabic glyphs, and tracking breaks Arabic joining.

**The Heading-First Rule.** A heading leads its block. Metadata such as a tab label, a time, a source line, or a stamp comes after the heading in a row, never above it as a kicker.

## Layout

- The screen gutter is 20px. Sections are separated by 24px, and items inside a section by 12px.
- Home is a vertical schedule. A horizontal pager shows the NOW picture card at full width, with the next card peeking in at its end edge. It bleeds past the gutter with a -20px margin and 10px gaps.
- The routine is a vertical timeline. Done steps sit as sunk tiles with a pen tick. The NOW step hangs from a small pressboard "now" tab.
- The "Something's happening" action docks 14px above the tab bar, inset by the gutter. Scroll content reserves 128px at the bottom so the dock never covers the last item.
- Every row is direction-aware (`Row`). Inline data runs are isolated.

## Elevation & Depth

Mobile uses the world's shadow ladder as React Native `boxShadow`. It adds no new shadow.
- **Tile** (the world's folder shadow) is for resting sheet tiles: paper, peek cards, and tickets on lists.
- **Lift** is for things that stand off the door: the NOW card, the note slips, the open visit ticket, the docked action, and the Log disc.
- **Press** is a hairline contact shadow for the ink action and the magnet.

**The Held-Not-Floating Rule.** A slip that is lifted is always held by something: a magnet, a perforated stub, or the board. Nothing hovers on its own.

## Shapes

- Corners scale with size. Tick boxes are 12px, actions are 14px, tiles and picture tiles are 20px, and the NOW card and visit tickets are 26px.
- Paper slips are the exception. They use tight 6px corners and are tilted by hand, from -1.2 to 0.8 degrees, so they read as cut paper rather than UI cards.
- Visit tickets are perforated. A dashed strong-rule tear line runs between two 22px notches, which are punched through to the sheet ground at the start and end edges.
- Stamps keep 1.5px current-color borders and a -2 to -8 degree tilt. The calendar stamp on a ticket is a tall 80 by 96 (or 52 by 60) slate block.
- The active tab drops from the sheet with 18px bottom corners only.

## Components

### Picture Cards (signature)
Picture cards show the schedule as pictures. The NOW card is sheet-raised with a 2px pressboard border and lift. It holds a 70px moss-wash picture tile, the step in title type, the time range in mono figures, and a "Now" label in cobalt. A pen-tick box sits at its end edge. The next card peeks in at its end edge: time first, pictogram, then the step name.

### Pictograms
Pictograms are authored duotone drawings on a 48px grid. Each has a 2.2 stroke, round caps and joins, and one tinted plane at 20% current color. They are the glyph grammar drawn at fridge-card scale, and they cover schedule steps, event types, and calming supports. Never substitute glyphs, emoji, or stock icons for them.

### Pen Tick (the one done control)
The pen tick is a 44px box with 12px corners and an 8px hit slop. When open, it is an empty 1.5px strong-rule box. When checked, it fills with cobalt wash, and the ballpoint tick draws in pen blue over 420ms.

**The One Tick Rule.** Marking something done always uses the pen tick. That includes routine steps, "what to bring" lists, and the day's tally row. Never use a switch, a filled checkbox, a toggle button, or a "Mark done" button.

### Note Slips and Magnet
Therapist notes, answers, and the check-in are slips. Each is sheet-raised with 6px corners, lift, and a hand tilt. A 26px pressboard-raised magnet pins each slip at the top, with a faint shine. When something is unread, a 12px gold dot sits on the magnet, ringed in sheet-raised.

### Visit Tickets
A visit is a perforated ticket. The top holds a slate calendar stamp, the time in large mono, the visit title in title type, and the place beside a cobalt-wash glyph tile. Below the tear line is the "What to bring" list, with a pen tick on each row. Upcoming visits use a compact ticket: a pressboard stub holds the time in mono, and a sheet body holds the details.

### Actions
Actions are 48px, or 56px when large, with 14px corners and 24px side padding. Small actions are 38px with 12px side padding. Label type is 15px medium. A leading glyph is 20px (17px on small actions).
- **Ink** (pressboard, press shadow) is the primary action on any sheet, and the docked "Something's happening".
- **Outline** (sheet-raised with a 1px rule) sits beside an ink action.
- **Quiet** (text only) is for low-weight links.
- Pressing an action scales it to 0.975 over 120ms and releases it over 260ms on paper ease. Disabled actions sit at 45% opacity.

### Tab Labels and Stamps
Tab labels and stamps follow the world's rules. Tab labels have 8px corners on mobile. The date stamp presses in from 1.3x scale after 180ms, over 360ms. A moss stamp marks "sent" and "saved". The illustrative-data notice is a slate stamp on More and Profile.

### Tab Bar (pressboard board)
The tab bar is a pressboard board with five tabs, each at least 62px tall. Each tab has a 23px glyph, tinted at 14%, in muted board ink, with a caption label below.
- **Active tab:** fills with sheet and drops 18px bottom corners, so it is joined to the screen above it. Its glyph turns pressboard at 22% tint, and its label turns to ink at weight 600.
- **Log disc:** a 60px circle raised 34px above the bar, with a 4px pressboard ring and lift. When active, it becomes board-raised with a sheet ring and board-ink glyph. It is never joined to the sheet.
- **Count badge:** a 20px gold circle with a 2px pressboard ring, at the top end corner of the Messages glyph.

### Event Barcode
The world's barcode carries over: one column per day, with bars at 40%, 70%, and 100% height by intensity. On mobile it shows up to three bars per day, and the days since the last session sit on a sunk band.

### Glyphs
The world's 24px duotone glyphs carry over: 1.6 stroke, one tinted plane, and directional glyphs mirrored in RTL. No lucide or other library icons appear in product chrome.

### Motion
Motion follows the world's paper grammar. Paper ease is the exponential ease-out (0.16, 1, 0.3, 1), and nothing bounces or springs. The signature motion is a tick: the pen draws, the card settles into the done rail, and the next card slides into NOW. Reanimated timings follow the system reduce-motion setting.

## Do's and Don'ts

### Do:
- **Do** put the heading first, then the metadata row: label, time, or stamp.
- **Do** mark every done state with the pen tick.
- **Do** draw new schedule, event, or support pictures as 48px duotone pictograms that match the set.
- **Do** hold every lifted slip with a magnet or a stub, and tilt slips by no more than 1.2 degrees.
- **Do** set stamps in the script's own face, with no tracking, in he and ar.
- **Do** load sample content through `useFamilyContent` and wrap data runs in `isolate()`.
- **Do** keep targets at 44px or more, and keep the "Something's happening" dock clear of content.

### Don't:
- **Don't** use gold for anything that does not wait on the parent.
- **Don't** use the uppercase tracked stamp as a section label or kicker. It is reserved for dates, "now", "sent" and "saved", and the illustrative-data notice.
- **Don't** let intensity color shame the family. Never put ruby on a heading, a button, or a message about a log.
- **Don't** build pastel wellness card grids or a chatbot surface. "Ask" answers are slips, not bubbles.
- **Don't** put Geist Mono on words.
- **Don't** join the Log disc to the sheet. It is raised from the board.
