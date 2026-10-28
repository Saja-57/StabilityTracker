import { StyleSheet } from "react-native";

import { PenMark, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";

import type { RoutineCompletionViewModel } from "../types";

export interface RoutineCompletionMetaProps {
  readonly completion?: RoutineCompletionViewModel;
  /** Draw a small pen tick before the signature. */
  readonly withMark?: boolean;
}

/** The pen signature on a done card: "Tamar 07:04". */
export function RoutineCompletionMeta({
  completion,
  withMark = false,
}: RoutineCompletionMetaProps) {
  const { t } = useLanguage();
  const name = completion?.caregiverDisplayName;
  const time = completion?.completedAt;

  if (!name && !time) {
    return null;
  }

  return (
    <Row gap={6} style={styles.row}>
      {withMark ? <PenMark visible size={18} /> : null}
      <Type
        variant="small"
        color="pen"
        accessibilityLabel={fill(t("routineDay.doneBy"), {
          name: name ?? "",
          time: time ?? "",
        })}
      >
        {isolate(name)}
      </Type>
      {time ? (
        <Type
          variant="figure"
          color="pen"
          style={styles.time}
          accessibilityElementsHidden
        >
          {time}
        </Type>
      ) : null}
    </Row>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 20 },
  time: { fontSize: 13.5 },
});
