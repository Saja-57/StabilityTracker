import { StyleSheet, View } from "react-native";

import { Row } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { isolate } from "@/lib/format";
import { cf, corner, surface } from "@/theme/case-file";

import type { RoutineContextViewModel } from "../types";

export interface RoutineContextCardProps {
  readonly context?: RoutineContextViewModel;
}

/** The child chip pinned beside the date stamp: whose day this is. */
export function RoutineContextCard({ context }: RoutineContextCardProps) {
  const name = context?.childDisplayName;
  if (!name) {
    return null;
  }

  return (
    <Row gap={6} style={styles.chip}>
      <View style={styles.monogram}>
        <Type variant="label" style={styles.initial}>
          {name.slice(0, 1)}
        </Type>
      </View>
      <Type variant="label" numberOfLines={1}>
        {isolate(name)}
      </Type>
      {context.periodLabel ? (
        <Type
          variant="small"
          color="muted"

          numberOfLines={1}
        >
          {isolate(context.periodLabel)}
        </Type>
      ) : null}
    </Row>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: surface.raised,
    borderColor: surface.rule,
    borderRadius: corner.pill,
    borderWidth: 1,
    paddingEnd: 12,
    paddingStart: 4,
    paddingVertical: 4,
  },
  monogram: {
    alignItems: "center",
    backgroundColor: cf.pressboard.base,
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    width: 26,
  },
  initial: { color: cf.pressboard.ink, fontSize: 13 },
});
