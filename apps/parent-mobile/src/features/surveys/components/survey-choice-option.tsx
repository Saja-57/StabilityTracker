import type { SupportedLanguage } from "@stability/i18n";
import { StyleSheet, View } from "react-native";

import { PenMark, PressCard, Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { isolate } from "@/lib/format";
import { cf, corner, elevation, space, surface } from "@/theme/case-file";

export interface SurveyChoiceOptionProps {
  readonly label: string;
  readonly language?: SupportedLanguage;
  readonly mode: "single" | "multiple";
  readonly onPress: () => void;
  readonly selected: boolean;
}

/** A large choice row on paper; a pen tick lands in the box when chosen. */
export function SurveyChoiceOption({
  label,
  language,
  mode,
  onPress,
  selected,
}: SurveyChoiceOptionProps) {
  return (
    <PressCard
      accessibilityLabel={label}
      accessibilityRole={mode === "single" ? "radio" : "checkbox"}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      pressedScale={0.985}
      style={[styles.option, selected ? styles.selected : null]}
    >
      <Row gap={space.lg}>
        <Type
          variant="headline"
          style={styles.label}
          {...(language ? { language } : {})}
        >
          {isolate(label)}
        </Type>
        <View
          style={[
            styles.box,
            mode === "single" ? styles.round : null,
            selected ? styles.boxOn : styles.boxOff,
          ]}
        >
          <PenMark visible={selected} size={28} />
        </View>
      </Row>
    </PressCard>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: surface.raised,
    borderColor: "transparent",
    borderRadius: corner.md,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 68,
    paddingHorizontal: 18,
    paddingVertical: 12,
    ...elevation.tile,
  },
  selected: { borderColor: surface.board },
  label: { flex: 1, fontSize: 17, lineHeight: 23 },
  box: {
    alignItems: "center",
    borderRadius: 10,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  round: { borderRadius: 18 },
  boxOff: { borderColor: cf.sheet.ruleStrong, borderWidth: 1.5 },
  boxOn: { backgroundColor: cf.tab.cobaltWash },
});
