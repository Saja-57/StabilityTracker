import type { TranslationKey } from "@stability/i18n";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, ink, surface } from "@/theme/case-file";
import { getDirectionalTextStyle } from "@/theme/direction";

import type { EventLogChoice } from "../types";
import { LogPicture } from "./log-picture";

export type ChipTone = "board" | "moss";

const toneStyle: Record<
  ChipTone,
  { background: string; border: string; ink: string; tint: string }
> = {
  board: {
    background: cf.pressboard.base,
    border: cf.pressboard.base,
    ink: cf.pressboard.ink,
    tint: cf.pressboard.raised,
  },
  moss: {
    background: cf.tab.mossWash,
    border: cf.tab.moss,
    ink: cf.tab.mossInk,
    tint: cf.sheet.raised,
  },
};

/** Large picture chips. Single choice when `selected` is a value, multi when an array. */
export function ChoiceGroup<TValue extends string>({
  options,
  selected,
  onToggle,
  tone = "board",
  label,
}: {
  options: readonly EventLogChoice<TValue>[];
  selected: TValue | null | readonly TValue[];
  onToggle: (value: TValue) => void;
  tone?: ChipTone;
  label: string;
}) {
  const { t } = useLanguage();
  const multi = Array.isArray(selected);
  const isOn = (value: TValue) =>
    multi
      ? (selected as readonly TValue[]).includes(value)
      : selected === value;
  const palette = toneStyle[tone];

  return (
    <Row wrap gap={10} style={styles.group}>
      {options.map((option) => {
        const on = isOn(option.value);
        const text = t(option.labelKey);
        return (
          <PressCard
            key={option.value}
            accessibilityRole={multi ? "checkbox" : "radio"}
            accessibilityState={multi ? { checked: on } : { selected: on }}
            accessibilityLabel={`${label}: ${text}`}
            onPress={() => onToggle(option.value)}
            pressedScale={0.95}
            style={[
              styles.chip,
              option.picture ? styles.chipPicture : null,
              on
                ? {
                    backgroundColor: palette.background,
                    borderColor: palette.border,
                  }
                : styles.chipOff,
            ]}
          >
            <Row gap={8}>
              {option.picture ? (
                <View
                  style={[
                    styles.pictureWell,
                    { backgroundColor: on ? palette.tint : surface.sunk },
                  ]}
                >
                  <LogPicture
                    name={option.picture}
                    size={28}
                    color={
                      on
                        ? tone === "board"
                          ? cf.pressboard.ink
                          : cf.tab.mossInk
                        : cf.pressboard.base
                    }
                    tint={on ? 0.28 : 0.18}
                  />
                </View>
              ) : null}
              <Type
                variant="label"
                style={{ color: on ? palette.ink : ink.primary }}
              >
                {text}
              </Type>
            </Row>
          </PressCard>
        );
      })}
    </Row>
  );
}

/** A collapsed "Add a short note" that opens into a ruled field. */
export function NoteField({
  value,
  onChange,
  placeholderKey,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholderKey: TranslationKey;
}) {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(value.length > 0);

  if (!open) {
    return (
      <PressCard
        accessibilityRole="button"
        accessibilityLabel={t("logFlow.note.add")}
        onPress={() => setOpen(true)}
        style={styles.noteToggle}
      >
        <Row gap={6}>
          <Glyph name="edit" color={ink.secondary} size={18} />
          <Type variant="small" color="secondary">
            {t("logFlow.note.add")}
          </Type>
        </Row>
      </PressCard>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(240)}>
      <TextInput
        accessibilityLabel={t("logFlow.note.label")}
        autoFocus={value.length === 0}
        multiline
        maxLength={240}
        onChangeText={onChange}
        placeholder={t(placeholderKey)}
        placeholderTextColor={ink.muted}
        style={[getDirectionalTextStyle(language), styles.note]}
        value={value}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  group: { alignItems: "flex-start" },
  chip: {
    borderRadius: corner.md,
    borderWidth: 1.5,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipPicture: { paddingStart: 6, paddingEnd: 16, paddingVertical: 6 },
  chipOff: { backgroundColor: surface.raised, borderColor: surface.rule },
  pictureWell: {
    alignItems: "center",
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  noteToggle: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
  },
  note: {
    backgroundColor: surface.raised,
    borderColor: surface.rule,
    borderRadius: corner.md,
    borderWidth: 1,
    color: ink.primary,
    fontSize: 16,
    lineHeight: 22,
    minHeight: 76,
    padding: 14,
    textAlignVertical: "top",
  },
});
