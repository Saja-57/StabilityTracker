import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Type } from "@/components/case-file/type";
import { space } from "@/theme/case-file";

/** One question on a log page: a plain heading, an optional hint, the answer. */
export function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Type variant="headline" accessibilityRole="header">
          {title}
        </Type>
        {hint ? (
          <Type variant="small" color="muted">
            {hint}
          </Type>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.md },
  heading: { gap: 2 },
});
