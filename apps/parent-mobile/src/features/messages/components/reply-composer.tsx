import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Action, Row, paperEase } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { fill } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, ink, space, surface } from "@/theme/case-file";
import {
  getDirectionalTextStyle,
  getDirectionalViewStyle,
} from "@/theme/direction";

export interface ReplyComposerProps {
  readonly onClose: () => void;
  readonly onSend: (body: string) => void;
  readonly recipientName: string;
  readonly visible: boolean;
}

/** A bottom sheet with one roomy textarea and Send. */
export function ReplyComposer({
  onClose,
  onSend,
  recipientName,
  visible,
}: ReplyComposerProps) {
  const { language, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState("");
  const ready = draft.trim().length > 0;

  const close = () => {
    setDraft("");
    onClose();
  };

  const send = () => {
    if (!ready) {
      return;
    }
    onSend(draft.trim());
    setDraft("");
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={close}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.root, getDirectionalViewStyle(language)]}
      >
        <Animated.View
          entering={FadeIn.duration(220)}
          style={StyleSheet.absoluteFill}
        >
          <Pressable
            accessibilityLabel={t("inbox.reply.cancel")}
            accessibilityRole="button"
            onPress={close}
            style={styles.backdrop}
          />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.duration(420).easing(paperEase)}
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 12 },
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.copy}>
            <Type variant="title" accessibilityRole="header">
              {fill(t("inbox.reply.title"), { name: recipientName })}
            </Type>
            <Type variant="small" color="muted">
              {fill(t("inbox.reply.hint"), { name: recipientName })}
            </Type>
          </View>
          <TextInput
            accessibilityLabel={t("inbox.reply.placeholder")}
            autoFocus
            multiline
            onChangeText={setDraft}
            placeholder={t("inbox.reply.placeholder")}
            placeholderTextColor={ink.muted}
            selectionColor={cf.pen}
            style={[getDirectionalTextStyle(language), styles.input]}
            textAlignVertical="top"
            value={draft}
          />
          <Row gap={space.sm}>
            <Action
              label={t("inbox.reply.cancel")}
              variant="quiet"
              onPress={close}
            />
            <View style={styles.flex}>
              <Action
                label={t("inbox.reply.send")}
                glyph="send"
                variant="ink"
                size="large"
                disabled={!ready}
                onPress={send}
              />
            </View>
          </Row>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  flex: { flex: 1 },
  backdrop: { backgroundColor: cf.overlay, flex: 1 },
  sheet: {
    backgroundColor: surface.raised,
    borderTopEndRadius: corner.xl,
    borderTopStartRadius: corner.xl,
    boxShadow: cf.shadow.lift,
    gap: space.lg,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    backgroundColor: surface.ruleStrong,
    borderRadius: 3,
    height: 5,
    width: 40,
  },
  copy: { gap: space.xs },
  input: {
    backgroundColor: surface.sunk,
    borderRadius: corner.md,
    color: ink.primary,
    fontSize: 17,
    lineHeight: 25,
    minHeight: 150,
    padding: 16,
  },
});
