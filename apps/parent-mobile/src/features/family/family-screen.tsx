import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import {
  Paper,
  Row,
  SectionTitle,
  TabLabel,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { Pictogram } from "@/components/icons/pictograms";
import { ScreenContainer } from "@/components/ui";
import { Monogram } from "@/features/more/components/monogram";
import { StackHeader } from "@/features/more/components/stack-header";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, elevation, ink, space, surface } from "@/theme/case-file";

import { InviteFlow, type PendingInvite } from "./components/invite-sheet";
import type { CareRole, FamilyScreenProps } from "./types";

const enter = (index: number) =>
  FadeInDown.duration(520)
    .delay(60 + index * 70)
    .easing(paperEase);

const roleGlyph: Record<CareRole, GlyphName> = {
  therapist: "heart",
  school: "routine",
  pediatrician: "clinic",
};

/** Who Noa is in this plan, who cares for her at home, and who supports the family. */
export function FamilyScreen({
  child,
  caregivers,
  careTeam,
  therapistGivenName,
}: FamilyScreenProps) {
  const { t } = useLanguage();
  const [pending, setPending] = useState<readonly PendingInvite[]>([]);
  const lena = isolate(therapistGivenName);

  return (
    <ScreenContainer scrollProps={{ showsVerticalScrollIndicator: false }}>
      <Animated.View entering={enter(0)}>
        <StackHeader
          title={t("more.family.title")}
          lede={fill(t("more.family.lede"), {
            child: isolate(child.givenName),
          })}
        />
      </Animated.View>

      <Animated.View entering={enter(1)}>
        <View style={styles.profile}>
          <Row gap={space.lg}>
            <Monogram name={child.givenName} size={72} tone="board" />
            <View style={styles.flex}>
              <Type variant="display">{isolate(child.name)}</Type>
              <Type variant="lede" color="secondary">
                {fill(t("more.age"), { age: child.age })}
              </Type>
            </View>
          </Row>
          <Row gap={space.sm} wrap style={styles.focusRow}>
            <Type variant="small" color="secondary">
              {t("more.family.focus")}
            </Type>
            {child.focus.map((area) => (
              <TabLabel
                key={area}
                tone="moss"
                label={t(`vocab.focus.${area}`)}
              />
            ))}
          </Row>
          <View style={styles.goal}>
            <Type variant="title">{isolate(child.goal)}</Type>
            <Row gap={space.sm}>
              <Glyph name="flag" color={cf.tab.mossInk} size={16} tint={0.3} />
              <Type variant="caption" color="moss">
                {fill(t("more.family.goal"), { name: lena })}
              </Type>
            </Row>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={enter(2)} style={styles.section}>
        <SectionTitle title={t("more.family.caregivers")} />
        <Animated.View
          layout={LinearTransition.duration(320).easing(paperEase)}
        >
          <Paper style={styles.list}>
            {caregivers.map((caregiver, index) => (
              <Row
                key={caregiver.name}
                gap={space.md}
                style={[styles.item, index > 0 ? styles.ruled : null]}
              >
                <Monogram
                  name={caregiver.givenName}
                  size={44}
                  tone={caregiver.you ? "moss" : "sheet"}
                />
                <View style={styles.flex}>
                  <Type variant="label">{isolate(caregiver.name)}</Type>
                  <Type variant="small" color="muted">
                    {t(`vocab.relation.${caregiver.relation}`)}
                  </Type>
                </View>
                {caregiver.you ? (
                  <View style={styles.center}>
                    <TabLabel tone="moss" label={t("more.you")} />
                  </View>
                ) : null}
              </Row>
            ))}
          </Paper>
        </Animated.View>
        <InviteFlow
          childGivenName={child.givenName}
          therapistGivenName={therapistGivenName}
          pending={pending}
          onInvite={(invite) =>
            setPending((current) => [
              ...current.filter((entry) => entry.name !== invite.name),
              invite,
            ])
          }
          onWithdraw={(name) =>
            setPending((current) =>
              current.filter((entry) => entry.name !== name),
            )
          }
        />
      </Animated.View>

      <Animated.View entering={enter(3)} style={styles.section}>
        <SectionTitle title={t("more.family.team")} />
        <Paper style={styles.list}>
          {careTeam.map((member, index) => (
            <Row
              key={member.name}
              gap={space.md}
              style={[styles.item, index > 0 ? styles.ruled : null]}
            >
              <View
                style={[
                  styles.roleTile,
                  member.role === "therapist" ? styles.roleTherapist : null,
                ]}
              >
                {member.role === "school" ? (
                  <Pictogram
                    name="school"
                    size={30}
                    color={ink.secondary}
                    tint={0.2}
                  />
                ) : (
                  <Glyph
                    name={roleGlyph[member.role]}
                    color={
                      member.role === "therapist"
                        ? cf.tab.cobaltInk
                        : ink.secondary
                    }
                    size={22}
                    tint={0.25}
                  />
                )}
              </View>
              <View style={styles.flex}>
                <Type variant="label">{isolate(member.name)}</Type>
                <Type variant="small" color="muted">
                  {t(`more.family.role.${member.role}`)}
                  {t("more.listSeparator")}
                  {isolate(member.detail)}
                </Type>
              </View>
            </Row>
          ))}
        </Paper>
        <Type variant="small" color="muted">
          {fill(t("more.family.teamNote"), { name: lena })}
        </Type>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center" },
  section: { gap: space.md },
  profile: {
    backgroundColor: surface.raised,
    borderRadius: corner.xl,
    gap: space.xl,
    padding: 20,
    ...elevation.lift,
  },
  focusRow: { marginTop: -space.sm },
  goal: {
    backgroundColor: cf.tab.mossWash,
    borderRadius: corner.md,
    gap: space.sm,
    padding: space.lg,
  },
  list: { paddingVertical: 0 },
  item: { minHeight: 72, paddingVertical: space.md },
  ruled: { borderTopColor: surface.rule, borderTopWidth: 1 },
  roleTile: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  roleTherapist: { backgroundColor: cf.tab.cobaltWash },
});
