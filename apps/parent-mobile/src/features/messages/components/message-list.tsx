import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import { SectionTitle, paperEase } from "@/components/case-file/primitives";
import { space } from "@/theme/case-file";
import { useLanguage } from "@/providers/language-provider";

import type { ParentMessageViewModel } from "../types";
import { MessageListItem } from "./message-list-item";

export interface MessageListProps {
  readonly messages: readonly ParentMessageViewModel[];
  readonly onSelect: (message: ParentMessageViewModel) => void;
  readonly today?: string;
}

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(130 + index * 70)
    .easing(paperEase);

const tilts = [-1.2, 0.9, -0.6];

/** Unread slips first, held on the door; read slips below, lying flat. */
export function MessageList({ messages, onSelect, today }: MessageListProps) {
  const { t } = useLanguage();
  const unread = messages.filter((message) => !message.isRead);
  const read = messages.filter((message) => message.isRead);

  const renderGroup = (
    group: readonly ParentMessageViewModel[],
    offset: number,
    held: boolean,
  ) =>
    group.map((message, index) => (
      <Animated.View
        key={message.id}
        entering={enter(offset + index)}
        layout={LinearTransition.duration(380).easing(paperEase)}
      >
        <MessageListItem
          message={message}
          onPress={onSelect}
          {...(held ? { tilt: tilts[index % tilts.length] ?? 0 } : {})}
          {...(today ? { today } : {})}
        />
      </Animated.View>
    ));

  return (
    <View style={styles.list}>
      {unread.length > 0 ? (
        <View accessibilityRole="list" style={styles.group}>
          <SectionTitle title={t("inbox.section.new")} />
          <View style={styles.held}>{renderGroup(unread, 0, true)}</View>
        </View>
      ) : null}
      {read.length > 0 ? (
        <Animated.View
          accessibilityRole="list"
          layout={LinearTransition.duration(380).easing(paperEase)}
          style={styles.group}
        >
          <SectionTitle title={t("inbox.section.earlier")} />
          <View style={styles.flat}>
            {renderGroup(read, unread.length, false)}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 28 },
  group: { gap: space.md },
  held: { gap: space.xl },
  flat: { gap: space.md },
});
