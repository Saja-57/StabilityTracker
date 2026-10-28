import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import {
  Action,
  PressCard,
  Row,
  SectionTitle,
  TabLabel,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { ScreenContainer } from "@/components/ui";
import { StackHeader } from "@/features/more/components/stack-header";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, ink, space, surface } from "@/theme/case-file";
import { getDirectionalTextStyle } from "@/theme/direction";

import { AnswerSlip } from "./components/answer-slip";
import type { AskScreenProps } from "./types";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

const settle = LinearTransition.duration(320).easing(paperEase);

type Shown =
  | { kind: "library"; index: number }
  | { kind: "free"; question: string }
  | null;

/**
 * Ask, in preview: scripted answers drawn from Lena's plan and the family's
 * own logs, written up as question slips. Tapping one pins its answer to the
 * door. It never invents advice; anything else goes to Lena.
 */
export function AskScreen({
  library,
  therapistGivenName,
  childGivenName,
  onMessageTherapist,
}: AskScreenProps) {
  const { language, t } = useLanguage();
  const [shown, setShown] = useState<Shown>(null);
  const [draft, setDraft] = useState("");
  const lena = isolate(therapistGivenName);
  const values = { name: lena, child: isolate(childGivenName) };

  const submit = () => {
    const question = draft.trim();
    if (!question) return;
    setShown({ kind: "free", question });
    setDraft("");
  };

  const canSend = draft.trim().length > 0;

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <Animated.View entering={enter(0)}>
        <StackHeader
          title={t("more.ask.title")}
          lede={fill(t("more.ask.lede"), values)}
          aside={<TabLabel tone="cobalt" label={t("more.preview")} />}
        />
      </Animated.View>

      <Animated.View entering={enter(1)} style={styles.section}>
        <SectionTitle title={t("more.ask.suggested")} />
        <Animated.View layout={settle}>
          {library.map((entry, index) => {
            const active = shown?.kind === "library" && shown.index === index;
            return (
              <Animated.View
                key={entry.question}
                layout={settle}
                style={index > 0 ? styles.ruled : null}
              >
                <PressCard
                  accessibilityRole="button"
                  accessibilityState={{ expanded: active }}
                  accessibilityLabel={entry.question}
                  onPress={() =>
                    setShown(active ? null : { kind: "library", index })
                  }
                  pressedScale={0.985}
                  style={styles.question}
                >
                  <Row gap={space.md} align="flex-start">
                    <Type
                      variant={active ? "headline" : "label"}
                      style={styles.flex}
                    >
                      {isolate(entry.question)}
                    </Type>
                    <View style={[styles.chevron, active ? styles.flip : null]}>
                      <Glyph
                        name="chevronDown"
                        color={active ? ink.primary : ink.muted}
                        size={18}
                      />
                    </View>
                  </Row>
                </PressCard>
                {active ? (
                  <View style={styles.answer}>
                    <AnswerSlip
                      answer={isolate(entry.answer)}
                      source={isolate(entry.source)}
                      tilt={index % 2 === 0 ? -0.8 : 0.7}
                    />
                  </View>
                ) : null}
              </Animated.View>
            );
          })}
        </Animated.View>
      </Animated.View>

      <Animated.View entering={enter(2)} layout={settle}>
        <Row gap={space.sm} align="flex-start">
          <Glyph name="shield" color={ink.muted} size={17} />
          <Type variant="small" color="muted" style={styles.flex}>
            {fill(t("more.ask.notice"), values)}
          </Type>
        </Row>
      </Animated.View>

      <Animated.View
        entering={enter(3)}
        layout={settle}
        style={styles.ownSection}
      >
        <Type variant="label" color="secondary" accessibilityRole="header">
          {t("more.ask.own")}
        </Type>
        <Row gap={space.sm} align="flex-end" style={styles.composer}>
          <TextInput
            accessibilityLabel={t("more.ask.own")}
            value={draft}
            onChangeText={setDraft}
            placeholder={fill(t("more.ask.placeholder"), values)}
            placeholderTextColor={ink.muted}
            multiline
            onSubmitEditing={submit}
            style={[styles.input, getDirectionalTextStyle(language)]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("more.ask.send")}
            accessibilityState={{ disabled: !canSend }}
            disabled={!canSend}
            onPress={submit}
            hitSlop={4}
            style={[styles.send, canSend ? styles.sendReady : null]}
          >
            <Glyph
              name="send"
              color={canSend ? cf.pressboard.ink : ink.muted}
              size={18}
            />
          </Pressable>
        </Row>
        <Type variant="caption" color="muted">
          {t("more.ask.composerNote")}
        </Type>
        {shown?.kind === "free" ? (
          <AnswerSlip
            key={shown.question}
            question={isolate(shown.question)}
            answer={fill(t("more.ask.fallback"), values)}
            source={t("more.ask.fallbackSource")}
          >
            <Action
              label={fill(t("more.ask.message"), values)}
              glyph="messages"
              variant="ink"
              onPress={onMessageTherapist}
            />
          </AnswerSlip>
        ) : (
          <Action
            label={fill(t("more.ask.message"), values)}
            glyph="messages"
            variant="quiet"
            onPress={onMessageTherapist}
            style={styles.message}
          />
        )}
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: space.sm },
  ruled: { borderTopColor: surface.rule, borderTopWidth: 1 },
  question: { minHeight: 56, justifyContent: "center", paddingVertical: 16 },
  chevron: { paddingTop: 2 },
  flip: { transform: [{ rotate: "180deg" }] },
  answer: { paddingBottom: space.lg },
  ownSection: { gap: space.sm, paddingTop: space.lg },
  composer: {
    backgroundColor: surface.sunk,
    borderRadius: corner.lg,
    paddingEnd: 6,
    paddingStart: space.md,
    paddingVertical: 6,
  },
  input: {
    color: ink.primary,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 44,
    paddingTop: 11,
    textAlignVertical: "top",
  },
  send: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  sendReady: { backgroundColor: surface.board },
  message: { alignSelf: "flex-start", paddingHorizontal: 0 },
});
