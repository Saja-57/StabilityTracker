import type { GlyphName } from "@/components/icons/glyphs";
import type { SessionMode } from "@/lib/sample-data/types";

export const modeGlyph: Record<SessionMode, GlyphName> = { clinic: "clinic", video: "video", home: "home" };
export const modes: readonly SessionMode[] = ["clinic", "video", "home"];
