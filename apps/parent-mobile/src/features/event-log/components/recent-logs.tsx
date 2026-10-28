import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

import {
  Row,
  SectionTitle,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { fill, isolate } from "@/lib/format";
import { daysBetween, formatDay, formatTime } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { space, surface } from "@/theme/case-file";

import {
  eventIntensityLabelKeys,
  eventSupportLabelKeys,
  eventTypeLabelKeys,
} from "../options";
import type { EventLogEntryViewModel } from "../types";
import { IntensityMark } from "./intensity-selector";

/** Recent moments as a quiet ruled list: what, how strong, what helped. */
export function RecentLogs({
  logs,
  now,
}: {
  logs: readonly EventLogEntryViewModel[];
  now: string;
}) {
  const { language, t } = useLanguage();

  const dayLabel = (at: string) => {
    const days = daysBetween(at, now);
    if (days === 0) return t("common.today");
    if (days === 1) return t("common.yesterday");
    return formatDay(at, language);
  };

  return (
    <View style={styles.section}>
      <SectionTitle title={t("logFlow.recent.title")} />
      {logs.length === 0 ? (
        <Type variant="small" color="muted">
          {t("logFlow.recent.empty")}
        </Type>
      ) : (
        <View style={styles.list}>
          {logs.map((log, index) => {
            const type = t(eventTypeLabelKeys[log.type]);
            const intensity = log.intensity
              ? t(eventIntensityLabelKeys[log.intensity])
              : t("logFlow.recent.notRated");
            const helped = log.helped
              ? fill(t("logFlow.recent.helped"), {
                  support: t(eventSupportLabelKeys[log.helped]),
                })
              : null;
            const by = fill(t("logFlow.recent.by"), { name: isolate(log.by) });
            const when = `${dayLabel(log.at)} ${formatTime(log.at, language)}`;
            return (
              <Animated.View
                key={log.id}
                entering={FadeIn.duration(360)}
                layout={LinearTransition.duration(320).easing(paperEase)}
                accessible
                accessibilityLabel={[type, intensity, when, helped, by]
                  .filter(Boolean)
                  .join(". ")}
                style={[
                  styles.row,
                  index < logs.length - 1 ? styles.rule : null,
                ]}
              >
                <Row gap={space.md} align="center">
                  <View style={styles.mark}>
                    <IntensityMark value={log.intensity} size={20} />
                  </View>
                  <View style={styles.text}>
                    <Type variant="label">{type}</Type>
                    <Type variant="small" color="muted" numberOfLines={1}>
                      {helped ? `${helped}, ${by}` : by}
                    </Type>
                  </View>
                  <View style={styles.when}>
                    <Type variant="figure" color="secondary">
                      {formatTime(log.at, language)}
                    </Type>
                    <Type variant="caption" color="muted">
                      {dayLabel(log.at)}
                    </Type>
                  </View>
                </Row>
              </Animated.View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
  list: { borderTopColor: surface.rule, borderTopWidth: 1 },
  row: { paddingVertical: 14 },
  rule: { borderBottomColor: surface.rule, borderBottomWidth: 1 },
  mark: { alignItems: "center", width: 28 },
  text: { flex: 1, gap: 2 },
  when: { alignItems: "flex-end", gap: 0 },
});
