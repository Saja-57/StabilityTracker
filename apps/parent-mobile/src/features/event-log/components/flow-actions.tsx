import { StyleSheet, View } from "react-native";

import { Action, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { corner, space } from "@/theme/case-file";

/** Back and forward for a log page. A gentle hint replaces any error. */
export function FlowActions({
  backLabel,
  nextLabel,
  onBack,
  onNext,
  canContinue = true,
  hint,
}: {
  backLabel?: string;
  nextLabel: string;
  onBack?: () => void;
  onNext: () => void;
  canContinue?: boolean;
  hint?: string;
}) {
  return (
    <View style={styles.wrap}>
      {!canContinue && hint ? (
        <Type variant="small" color="muted" accessibilityLiveRegion="polite">
          {hint}
        </Type>
      ) : null}
      <Row gap={space.md}>
        {onBack && backLabel ? (
          <Action
            label={backLabel}
            variant="outline"
            size="large"
            onPress={onBack}
            style={styles.back}
          />
        ) : null}
        <View style={styles.flex}>
          <Action
            label={nextLabel}
            trailingGlyph="arrow"
            variant="ink"
            size="large"
            disabled={!canContinue}
            onPress={onNext}
            style={styles.next}
          />
        </View>
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  back: { borderRadius: corner.lg, paddingHorizontal: space.lg },
  next: { borderRadius: corner.lg },
  flex: { flex: 1 },
});
