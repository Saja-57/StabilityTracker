# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (therapist app, `apps/therapist-web`); the parent/caregiver app (`apps/parent-mobile`) is a separate Expo surface.

## Users

Primary (therapist web): pediatric developmental and behavioral clinicians (behavior analysts, occupational therapists, developmental psychologists) who support neurodivergent children, often autistic or with sensory-regulation needs, and their families between sessions. They carry a caseload of many children and work at a desk between or after sessions, reviewing what happened at home since the last visit, deciding what to adjust, and communicating it back to families.

Secondary (parent mobile): parents and caregivers who log events, follow routines, answer surveys, and read therapist guidance, often in stressful moments.

*Inferred from repository evidence (parent app feature set and copy); the user delegated this definition and did not dispute it.*

## Product Purpose

Close the gap between therapy sessions. Families capture what actually happens at home in structured, low-effort form; therapists turn that stream into patterns, adjustments, and guidance. Success for the therapist: walking into each session already knowing what changed, what triggered difficulty, and what helped, without chasing families for updates.

## Positioning

A care loop, not a records system. Parent-side capture is structured in an antecedent, behavior, and response shape (possible trigger, environment, what happened before, observable behavior, duration, what helped, recovery), so the therapist side can surface patterns rather than raw diaries. Guidance flows back as typed messages (recommendation, observation, reminder, routine adjustment) that land directly in the family's daily routine.

## Operating Context

- Parent capture: quick capture or detailed event log; event types are behavioral event, meltdown, sensory overload, other; intensity low, moderate, or high; timing now or earlier.
- Daily routines with steps whose status is upcoming, current, completed, skipped, or delayed, including who completed each step and when.
- Caregiver surveys (single choice, multi choice, scale, text).
- Therapist areas: dashboard, children (caseload and child profile), appointments, messages, reports, insights, notes, settings.

## Capabilities and Constraints

- Monorepo: pnpm and Turborepo. Therapist web uses Next.js App Router (v16), React 19, Tailwind v4, and Radix primitives. Supabase is planned but has no schema yet.
- Trilingual: English (LTR), Hebrew (RTL), and Arabic (RTL). Every surface must mirror correctly and use translation keys from `@stability/i18n`.
- No backend data yet. Therapist screens may be designed against an isolated, clearly labeled sample-data module that is easy to swap for Supabase queries.
- User roles: parent, caregiver, therapist.

## Brand Commitments

- Name: Stability Tracker. Tagline: "Small steps. Brighter days."
- Approved logo artwork lives in `assets/brand/` (app icon, mark, horizontal, stacked): forest-green caregiver-and-child figures with a leaf and a sunrise-gold arc. The current artwork must not be distorted or recolored. The user is open to a refined mark being proposed for approval.
- No emojis anywhere in the product.
- Voice: calm, non-judgmental, and low-pressure toward families ("Start with only what feels manageable"); precise and clinical-adjacent toward therapists.

## Evidence on Hand

Brand artwork in `assets/brand/`. No real clinical data, customers, testimonials, outcomes, or metrics exist; none may be fabricated as real. Sample data must read as illustrative.

## Product Principles

1. Arrive prepared: every therapist view answers "what changed since we last met?"
2. Patterns over logs: aggregate antecedents, behaviors, and what helped; raw entries stay one click away.
3. Respect the family: language about children and caregivers is never alarmist or blaming; intensity is a signal, not a grade.
4. One loop: anything the therapist learns can become guidance or a routine adjustment in place.
5. Trilingual by default: RTL is a first-class layout, not an afterthought.

## Accessibility & Inclusion

WCAG 2.2 AA. Full RTL parity for Hebrew and Arabic. Respect reduced-motion preferences. Clinicians may spend long sessions in the app, so it must stay comfortable for extended reading.
