import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type ScrollViewInstance,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import {
  Action,
  PressCard,
  Row,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { ScreenContainer } from "@/components/ui";
import { goBackOrMore } from "@/features/more/components/stack-header";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, ink, space, surface } from "@/theme/case-file";
import { getDirectionalTextStyle } from "@/theme/direction";

import {
  AskError,
  askAi,
  type AskDestination,
  type AskFailure,
  type AskReply,
} from "./ask-client";
import type { AskScreenProps } from "./types";

type Turn =
  | { readonly id: number; readonly role: "user"; readonly content: string }
  | ({ readonly id: number; readonly role: "assistant" } & AskReply);

const rise = FadeInDown.duration(360).easing(paperEase);

/**
 * Ask AI: one calm thread. Three starters while it is empty, short answers,
 * and at most one button that takes the parent to the right place.
 */
export function AskScreen({
  therapistGivenName,
  childGivenName,
  context,
  onNavigate,
  onMessageTherapist,
}: AskScreenProps) {
  const { language, t } = useLanguage();
  const [turns, setTurns] = useState<readonly Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<AskFailure | null>(null);
  const scroll = useRef<ScrollViewInstance>(null);
  const request = useRef<AbortController | null>(null);
  const nextId = useRef(0);
  const values = {
    name: isolate(therapistGivenName),
    child: isolate(childGivenName),
  };

  useEffect(() => () => request.current?.abort(), []);

  const run = async (thread: readonly Turn[]) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setFailure(null);
    const timeout = setTimeout(() => controller.abort(), 50_000);
    try {
      const reply = await askAi(
        {
          language,
          context,
          messages: thread.map((turn) =>
            turn.role === "user"
              ? { role: "user", content: turn.content }
              : { role: "assistant", content: turn.answer },
          ),
        },
        controller.signal,
      );
      setTurns((current) => [
        ...current,
        { id: nextId.current++, role: "assistant", ...reply },
      ]);
    } catch (error) {
      if (request.current !== controller) return;
      setFailure(error instanceof AskError ? error.reason : "unreachable");
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) setPending(false);
    }
  };

  const send = (text: string) => {
    const content = text.trim();
    if (!content || pending) return;
    const thread = [
      ...turns,
      { id: nextId.current++, role: "user" as const, content },
    ];
    setTurns(thread);
    setDraft("");
    void run(thread);
  };

  const restart = () => {
    request.current?.abort();
    request.current = null;
    setTurns([]);
    setPending(false);
    setFailure(null);
    setDraft("");
  };

  const empty = turns.length === 0 && !pending && !failure;
  const canSend = draft.trim().length > 0 && !pending;
  const starters = [
    fill(t("more.ask.starter.next"), values),
    t("more.ask.starter.log"),
    fill(t("more.ask.starter.notes"), values),
  ];

  return (
    <ScreenContainer scrollable={false} contentContainerStyle={styles.screen}>
      <Row style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          hitSlop={6}
          onPress={goBackOrMore}
          style={({ pressed }) => [
            styles.round,
            pressed ? styles.pressed : null,
          ]}
        >
          <Glyph name="arrowBack" color={ink.primary} size={22} />
        </Pressable>
        <Type
          variant="headline"
          accessibilityRole="header"
          style={styles.barTitle}
        >
          {t("more.ask.title")}
        </Type>
        {turns.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("more.ask.newChat")}
            hitSlop={6}
            onPress={restart}
            style={({ pressed }) => [
              styles.round,
              pressed ? styles.pressed : null,
            ]}
          >
            <Glyph name="plus" color={ink.primary} size={22} />
          </Pressable>
        ) : (
          <View style={styles.roundSpacer} />
        )}
      </Row>

      <ScrollView
        ref={scroll}
        style={styles.flex}
        contentContainerStyle={[
          styles.thread,
          empty ? styles.threadEmpty : null,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (!empty) scroll.current?.scrollToEnd({ animated: true });
        }}
      >
        {empty ? (
          <Animated.View entering={rise} style={styles.welcome}>
            <View style={styles.mark}>
              <Glyph name="spark" color={cf.tab.mossInk} size={26} />
            </View>
            <View style={styles.welcomeCopy}>
              <Type variant="display">{t("more.ask.greeting")}</Type>
              <Type variant="lede" color="secondary">
                {fill(t("more.ask.lede"), values)}
              </Type>
            </View>
            <View style={styles.starters}>
              {starters.map((starter, index) => (
                <Animated.View
                  key={starter}
                  entering={FadeInDown.duration(360)
                    .delay(120 + index * 60)
                    .easing(paperEase)}
                >
                  <PressCard
                    accessibilityRole="button"
                    accessibilityLabel={starter}
                    onPress={() => send(starter)}
                    pressedScale={0.985}
                    style={styles.starter}
                  >
                    <Type variant="label" style={styles.flex}>
                      {starter}
                    </Type>
                    <Glyph name="arrow" color={ink.muted} size={18} />
                  </PressCard>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ) : (
          turns.map((turn) =>
            turn.role === "user" ? (
              <Animated.View key={turn.id} entering={rise} style={styles.mine}>
                <Type variant="body" style={styles.mineText} selectable>
                  {turn.content}
                </Type>
              </Animated.View>
            ) : (
              <Answer
                key={turn.id}
                reply={turn}
                therapistLabel={fill(t("more.ask.message"), values)}
                onNavigate={onNavigate}
                onMessageTherapist={onMessageTherapist}
              />
            ),
          )
        )}

        {pending ? <Thinking label={t("more.ask.thinking")} /> : null}

        {failure ? (
          <Animated.View
            entering={FadeIn.duration(240)}
            style={styles.failure}
            accessibilityLiveRegion="polite"
          >
            <Type variant="small" color="secondary" style={styles.flex}>
              {t(
                failure === "not_configured"
                  ? "more.ask.notConfigured"
                  : "more.ask.error",
              )}
            </Type>
            {turns.at(-1)?.role === "user" ? (
              <Action
                label={t("more.ask.retry")}
                variant="outline"
                size="small"
                onPress={() => void run(turns)}
              />
            ) : null}
          </Animated.View>
        ) : null}
      </ScrollView>

      <View style={styles.dock}>
        <Row gap={space.sm} align="flex-end" style={styles.composer}>
          <TextInput
            accessibilityLabel={t("more.ask.placeholder")}
            value={draft}
            onChangeText={setDraft}
            placeholder={t("more.ask.placeholder")}
            placeholderTextColor={ink.muted}
            multiline
            maxLength={1000}
            style={[styles.input, getDirectionalTextStyle(language)]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("more.ask.send")}
            accessibilityState={{ disabled: !canSend }}
            disabled={!canSend}
            onPress={() => send(draft)}
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
        {empty ? (
          <Type variant="caption" color="muted" style={styles.footnote}>
            {fill(t("more.ask.footnote"), values)}
          </Type>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

function Answer({
  reply,
  therapistLabel,
  onNavigate,
  onMessageTherapist,
}: {
  reply: AskReply;
  therapistLabel: string;
  onNavigate: (destination: AskDestination) => void;
  onMessageTherapist: () => void;
}) {
  const { t } = useLanguage();
  return (
    <Animated.View
      entering={rise}
      style={styles.answer}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.answerMark}>
        <Glyph name="spark" color={cf.tab.mossInk} size={16} />
      </View>
      <View style={[styles.flex, styles.answerBody]}>
        <Type variant="body" selectable>
          {reply.answer}
        </Type>
        {reply.action || reply.askTherapist ? (
          <Row wrap gap={space.sm}>
            {reply.action ? (
              <Action
                label={t(`more.ask.go.${reply.action}`)}
                trailingGlyph="chevron"
                variant="ink"
                size="small"
                onPress={() => onNavigate(reply.action as AskDestination)}
              />
            ) : null}
            {reply.askTherapist ? (
              <Action
                label={therapistLabel}
                glyph="messages"
                variant="outline"
                size="small"
                onPress={onMessageTherapist}
              />
            ) : null}
          </Row>
        ) : null}
      </View>
    </Animated.View>
  );
}

function Thinking({ label }: { label: string }) {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={styles.answer}
      accessible
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.answerMark}>
        <Glyph name="spark" color={cf.tab.mossInk} size={16} />
      </View>
      <Row gap={5} style={styles.dots}>
        {[0, 1, 2].map((index) => (
          <Dot key={index} index={index} />
        ))}
      </Row>
    </Animated.View>
  );
}

function Dot({ index }: { index: number }) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(0.35);
  useEffect(() => {
    if (reduced) return;
    opacity.set(
      withDelay(
        index * 160,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 360 }),
            withTiming(0.35, { duration: 360 }),
          ),
          -1,
        ),
      ),
    );
  }, [index, opacity, reduced]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { gap: 0, paddingHorizontal: 0 },
  bar: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: space.sm,
    paddingHorizontal: space.gutter,
  },
  barTitle: { flex: 1, textAlign: "center" },
  round: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  roundSpacer: { height: 44, width: 44 },
  pressed: { opacity: 0.7 },
  thread: {
    gap: space.xl,
    paddingBottom: space.lg,
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
  },
  threadEmpty: { flexGrow: 1, justifyContent: "flex-end" },
  welcome: { gap: space.xl },
  mark: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: corner.lg,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  welcomeCopy: { gap: space.sm },
  starters: { gap: space.sm },
  starter: {
    alignItems: "center",
    backgroundColor: surface.raised,
    borderColor: surface.rule,
    borderRadius: corner.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: space.md,
    minHeight: 52,
    paddingHorizontal: space.lg,
    paddingVertical: 14,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: surface.board,
    borderBottomEndRadius: 6,
    borderRadius: corner.lg,
    maxWidth: "84%",
    paddingHorizontal: space.lg,
    paddingVertical: 11,
  },
  mineText: { color: cf.pressboard.ink },
  answer: { flexDirection: "row", gap: space.md },
  answerMark: {
    alignItems: "center",
    backgroundColor: cf.tab.mossWash,
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    marginTop: 1,
    width: 28,
  },
  answerBody: { gap: space.md },
  dots: { alignItems: "center", height: 28 },
  dot: {
    backgroundColor: ink.muted,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  failure: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: corner.md,
    flexDirection: "row",
    gap: space.md,
    padding: space.md,
  },
  dock: {
    borderTopColor: surface.rule,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: space.sm,
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
  },
  composer: {
    backgroundColor: surface.raised,
    borderColor: surface.ruleStrong,
    borderRadius: 26,
    borderWidth: 1,
    paddingEnd: 5,
    paddingStart: space.lg,
    paddingVertical: 5,
  },
  input: {
    color: ink.primary,
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 120,
    minHeight: 42,
    paddingBottom: 10,
    paddingTop: 10,
    textAlignVertical: "top",
  },
  send: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  sendReady: { backgroundColor: surface.board },
  footnote: { textAlign: "center" },
});
