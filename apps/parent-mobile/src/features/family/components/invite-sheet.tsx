import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import {
  Action,
  Paper,
  PressCard,
  Row,
  Stamp,
  paperEase,
} from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { fill, isolate } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, ink, space, surface } from "@/theme/case-file";
import { getDirectionalTextStyle } from "@/theme/direction";

import type { Relation } from "../types";

const relations: readonly Relation[] = [
  "father",
  "mother",
  "grandmother",
  "grandfather",
  "guardian",
];

export type InviteAccess = "full" | "routine";

export interface PendingInvite {
  readonly name: string;
  readonly relation: Relation;
  readonly access: InviteAccess;
}

/**
 * Inviting another caregiver, honestly: the parent fills in who and how much
 * they see, and the request goes to the therapist to confirm. Nothing is sent
 * from this preview.
 */
export function InviteFlow({
  childGivenName,
  therapistGivenName,
  pending,
  onInvite,
  onWithdraw,
}: {
  childGivenName: string;
  therapistGivenName: string;
  pending: readonly PendingInvite[];
  onInvite: (invite: PendingInvite) => void;
  onWithdraw: (name: string) => void;
}) {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [relation, setRelation] = useState<Relation | null>(null);
  const [access, setAccess] = useState<InviteAccess>("routine");
  const ready =
    name.trim().length > 0 && contact.trim().length > 0 && relation !== null;
  const child = isolate(childGivenName);
  const lena = isolate(therapistGivenName);

  const reset = () => {
    setName("");
    setContact("");
    setRelation(null);
    setAccess("routine");
  };

  const submit = () => {
    if (!ready || !relation) return;
    onInvite({ name: name.trim(), relation, access });
    reset();
    setOpen(false);
  };

  const inputStyle = [styles.input, getDirectionalTextStyle(language)];

  return (
    <Animated.View
      layout={LinearTransition.duration(320).easing(paperEase)}
      style={styles.root}
    >
      {pending.map((invite) => (
        <Animated.View
          key={invite.name}
          entering={FadeInDown.duration(420).easing(paperEase)}
        >
          <Paper style={styles.pending}>
            <Row gap={space.md} align="flex-start">
              <View style={styles.pendingIcon}>
                <Glyph
                  name="send"
                  color={cf.tab.cobaltInk}
                  size={20}
                  tint={0.25}
                />
              </View>
              <View style={styles.flex}>
                <Type variant="label">{isolate(invite.name)}</Type>
                <Type variant="small" color="muted">
                  {t(`vocab.relation.${invite.relation}`)}
                  {t("more.listSeparator")}
                  {t(
                    invite.access === "full"
                      ? "more.family.invite.accessFull"
                      : "more.family.invite.accessRoutine",
                  )}
                </Type>
              </View>
            </Row>
            <Stamp
              label={t("more.family.invite.pending")}
              tone="pen"
              tilt={-2}
            />
            <Type variant="small" color="secondary">
              {fill(t("more.family.invite.pendingDetail"), { name: lena })}
            </Type>
            <Action
              label={t("more.family.invite.withdraw")}
              variant="quiet"
              size="small"
              onPress={() => onWithdraw(invite.name)}
              style={styles.quiet}
            />
          </Paper>
        </Animated.View>
      ))}

      {open ? (
        <Animated.View entering={FadeInDown.duration(420).easing(paperEase)}>
          <Paper style={styles.form}>
            <Row style={styles.between}>
              <Type variant="headline" accessibilityRole="header">
                {t("more.family.invite.title")}
              </Type>
              <PressCard
                accessibilityRole="button"
                accessibilityLabel={t("common.close")}
                onPress={() => {
                  reset();
                  setOpen(false);
                }}
                style={styles.close}
              >
                <Glyph name="close" color={ink.secondary} size={20} />
              </PressCard>
            </Row>
            <Type variant="small" color="secondary">
              {fill(t("more.family.invite.lede"), { child, name: lena })}
            </Type>

            <View style={styles.field}>
              <Type variant="label">{t("more.family.invite.name")}</Type>
              <TextInput
                accessibilityLabel={t("more.family.invite.name")}
                value={name}
                onChangeText={setName}
                placeholder={t("more.family.invite.namePlaceholder")}
                placeholderTextColor={ink.muted}
                style={inputStyle}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Type variant="label">{t("more.family.invite.contact")}</Type>
              <TextInput
                accessibilityLabel={t("more.family.invite.contact")}
                value={contact}
                onChangeText={setContact}
                placeholder={t("more.family.invite.contactPlaceholder")}
                placeholderTextColor={ink.muted}
                style={inputStyle}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Type variant="label">{t("more.family.invite.relation")}</Type>
              <Row gap={space.sm} wrap>
                {relations.map((option) => {
                  const active = relation === option;
                  return (
                    <PressCard
                      key={option}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: active }}
                      accessibilityLabel={t(`vocab.relation.${option}`)}
                      onPress={() => setRelation(option)}
                      style={[styles.chip, active ? styles.chipActive : null]}
                    >
                      <Type
                        variant="small"
                        style={{
                          color: active ? cf.pressboard.ink : ink.primary,
                        }}
                      >
                        {t(`vocab.relation.${option}`)}
                      </Type>
                    </PressCard>
                  );
                })}
              </Row>
            </View>

            <View style={styles.field}>
              <Type variant="label">{t("more.family.invite.access")}</Type>
              {(["routine", "full"] as const).map((option) => {
                const active = access === option;
                return (
                  <PressCard
                    key={option}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    accessibilityLabel={t(
                      option === "full"
                        ? "more.family.invite.accessFull"
                        : "more.family.invite.accessRoutine",
                    )}
                    onPress={() => setAccess(option)}
                    style={[styles.option, active ? styles.optionActive : null]}
                  >
                    <Row gap={space.md} align="flex-start">
                      <View
                        style={[
                          styles.radio,
                          active ? styles.radioActive : null,
                        ]}
                      >
                        {active ? <View style={styles.radioDot} /> : null}
                      </View>
                      <View style={styles.flex}>
                        <Type variant="label">
                          {t(
                            option === "full"
                              ? "more.family.invite.accessFull"
                              : "more.family.invite.accessRoutine",
                          )}
                        </Type>
                        <Type variant="small" color="muted">
                          {fill(
                            t(
                              option === "full"
                                ? "more.family.invite.accessFullDetail"
                                : "more.family.invite.accessRoutineDetail",
                            ),
                            { child },
                          )}
                        </Type>
                      </View>
                    </Row>
                  </PressCard>
                );
              })}
            </View>

            <Row gap={space.sm} align="flex-start">
              <Glyph name="shield" color={ink.muted} size={17} />
              <Type variant="caption" color="muted" style={styles.flex}>
                {t("more.family.invite.honest")}
              </Type>
            </Row>

            <Action
              label={t("more.family.invite.send")}
              glyph="send"
              variant="ink"
              disabled={!ready}
              onPress={submit}
            />
            {!ready ? (
              <Animated.View entering={FadeIn.duration(200)}>
                <Type variant="caption" color="muted" style={styles.centerText}>
                  {t("more.family.invite.needs")}
                </Type>
              </Animated.View>
            ) : null}
          </Paper>
        </Animated.View>
      ) : (
        <Action
          label={t("more.family.invite.action")}
          glyph="plus"
          variant="outline"
          onPress={() => setOpen(true)}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { gap: space.md },
  flex: { flex: 1 },
  between: { justifyContent: "space-between" },
  pending: { gap: space.sm, padding: 14 },
  pendingIcon: {
    alignItems: "center",
    backgroundColor: cf.tab.cobaltWash,
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  quiet: { alignSelf: "flex-start", paddingHorizontal: 0 },
  form: { gap: space.lg, padding: 20 },
  close: {
    alignItems: "center",
    backgroundColor: surface.sunk,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  field: { gap: space.sm },
  input: {
    backgroundColor: surface.sunk,
    borderColor: surface.rule,
    borderRadius: corner.md,
    borderWidth: 1,
    color: ink.primary,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  chip: {
    backgroundColor: surface.sunk,
    borderRadius: corner.pill,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  chipActive: { backgroundColor: cf.pressboard.base },
  option: {
    borderColor: surface.rule,
    borderRadius: corner.md,
    borderWidth: 1,
    padding: 14,
  },
  optionActive: {
    backgroundColor: cf.tab.cobaltWash,
    borderColor: cf.tab.cobalt,
  },
  radio: {
    alignItems: "center",
    borderColor: surface.ruleStrong,
    borderRadius: 11,
    borderWidth: 1.5,
    height: 22,
    justifyContent: "center",
    marginTop: 1,
    width: 22,
  },
  radioActive: { borderColor: cf.tab.cobalt },
  radioDot: {
    backgroundColor: cf.tab.cobalt,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  centerText: { textAlign: "center" },
});
