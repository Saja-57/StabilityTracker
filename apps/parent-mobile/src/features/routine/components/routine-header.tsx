import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Row, Stamp } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { formatLongDay } from "@/lib/time";
import { useLanguage } from "@/providers/language-provider";
import { space } from "@/theme/case-file";

export interface RoutineHeaderProps {
  /** Context shown opposite the stamp, such as the child chip. */
  readonly aside?: ReactNode;
  /** Progress or other lines under the title. */
  readonly children?: ReactNode;
  /** "YYYY-MM-DD"; defaults to the device's today. */
  readonly date?: string;
}

function deviceToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Title first, then the slate date stamp and the day's progress line. */
export function RoutineHeader({ aside, children, date }: RoutineHeaderProps) {
  const { language, t } = useLanguage();

  return (
    <View style={styles.container}>
      <Type variant="hero" accessibilityRole="header">
        {t("routine.title")}
      </Type>
      <Row style={styles.between}>
        <Stamp
          label={formatLongDay(date ?? deviceToday(), language)}
          tilt={-2}
        />
        {aside}
      </Row>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  between: { justifyContent: "space-between", minHeight: 34 },
});
