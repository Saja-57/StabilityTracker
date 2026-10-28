import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";

import { PressCard, Row, TabLabel } from "@/components/case-file/primitives";
import { Type } from "@/components/case-file/type";
import { Glyph } from "@/components/icons/glyphs";
import { fill } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";
import { cf, corner, ink, space } from "@/theme/case-file";

import { eventMediaOptions } from "../options";
import type { EventMediaAttachment, EventMediaKind } from "../types";

const newId = () =>
  `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function formatDuration(ms: number | undefined): string {
  const seconds = Math.round((ms ?? 0) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function fromPicker(
  assets: readonly ImagePicker.ImagePickerAsset[],
): EventMediaAttachment[] {
  return assets.map((asset) => ({
    id: newId(),
    kind: asset.type === "video" ? "video" : "photo",
    uri: asset.uri,
    ...(asset.duration ? { durationMs: asset.duration } : {}),
  }));
}

/**
 * Photo, video, voice and gallery. What the parent adds stays on this phone
 * until uploads are connected; nothing leaves the device yet.
 */
export function MediaCaptureActions({
  media,
  onChange,
}: {
  media: readonly EventMediaAttachment[];
  onChange: (media: readonly EventMediaAttachment[]) => void;
}) {
  const { t } = useLanguage();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const [busy, setBusy] = useState(false);
  const recording = recorderState.isRecording;
  const rows = [eventMediaOptions.slice(0, 2), eventMediaOptions.slice(2, 4)];

  const denied = () =>
    Alert.alert(t("eventLog.media.title"), t("eventLog.media.permission"));

  const add = (added: readonly EventMediaAttachment[]) => {
    if (added.length > 0) onChange([...media, ...added]);
  };

  const toggleRecording = async () => {
    if (recording) {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
      if (recorder.uri) {
        add([
          {
            id: newId(),
            kind: "audio",
            uri: recorder.uri,
            durationMs: recorderState.durationMillis,
          },
        ]);
      }
      return;
    }
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) return denied();
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const capture = async (kind: EventMediaKind) => {
    if (kind === "audio") return toggleRecording();
    if (busy || recording) return;
    setBusy(true);
    try {
      if (kind === "gallery") {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return denied();
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images", "videos"],
          allowsMultipleSelection: true,
          quality: 0.7,
        });
        if (!result.canceled) add(fromPicker(result.assets));
        return;
      }
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return denied();
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: [kind === "video" ? "videos" : "images"],
        quality: 0.7,
        videoMaxDuration: 60,
      });
      if (!result.canceled) add(fromPicker(result.assets));
    } catch {
      // The simulator has no camera; say so rather than fail silently.
      denied();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Row style={styles.between}>
        <Type variant="headline" accessibilityRole="header">
          {t("eventLog.media.title")}
        </Type>
        {media.length > 0 ? (
          <TabLabel
            tone="moss"
            label={fill(t("eventLog.media.count"), { count: media.length })}
          />
        ) : null}
      </Row>
      <View style={styles.grid}>
        {rows.map((row, index) => (
          <Row key={index} gap={10}>
            {row.map((option) => {
              const live = option.value === "audio" && recording;
              const label = live
                ? fill(t("eventLog.media.recording"), {
                    time: formatDuration(recorderState.durationMillis),
                  })
                : t(option.labelKey);
              return (
                <PressCard
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  onPress={() => void capture(option.value)}
                  style={[styles.tile, live ? styles.tileLive : null]}
                >
                  <Row gap={10}>
                    <View
                      style={[
                        styles.glyphWell,
                        live ? styles.glyphWellLive : null,
                      ]}
                    >
                      <Glyph
                        name={live ? "close" : option.glyph}
                        color={live ? cf.sheet.base : ink.primary}
                        size={22}
                        tint={0.16}
                      />
                    </View>
                    <Type
                      variant="small"
                      style={styles.flex}
                      numberOfLines={2}
                      accessibilityLiveRegion={live ? "polite" : "none"}
                    >
                      {label}
                    </Type>
                  </Row>
                </PressCard>
              );
            })}
          </Row>
        ))}
      </View>
      {media.length > 0 ? (
        <Row gap={10} wrap>
          {media.map((item) => (
            <View key={item.id} style={styles.thumb}>
              {item.kind === "photo" ? (
                <Image source={{ uri: item.uri }} style={styles.thumbImage} />
              ) : (
                <View style={styles.thumbGlyph}>
                  <Glyph
                    name={item.kind === "video" ? "video" : "mic"}
                    color={ink.primary}
                    size={24}
                    tint={0.16}
                  />
                  <Type variant="caption" color="muted">
                    {formatDuration(item.durationMs)}
                  </Type>
                </View>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("eventLog.media.remove")}
                hitSlop={8}
                onPress={() =>
                  onChange(media.filter((entry) => entry.id !== item.id))
                }
                style={styles.remove}
              >
                <Glyph name="close" color={cf.sheet.base} size={12} />
              </Pressable>
            </View>
          ))}
        </Row>
      ) : null}
      <Type variant="caption" color="muted">
        {t("logFlow.media.later")}
      </Type>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  between: { justifyContent: "space-between" },
  grid: { gap: 10 },
  flex: { flex: 1 },
  tile: {
    backgroundColor: cf.sheet.raised,
    borderColor: cf.sheet.ruleStrong,
    borderRadius: corner.md,
    borderWidth: 1.5,
    flex: 1,
    justifyContent: "center",
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tileLive: { borderColor: ink.stamp },
  glyphWell: {
    alignItems: "center",
    backgroundColor: cf.sheet.sunk,
    borderRadius: 10,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  glyphWellLive: { backgroundColor: ink.stamp },
  thumb: {
    borderColor: cf.sheet.ruleStrong,
    borderRadius: corner.md,
    borderWidth: 1,
    height: 72,
    overflow: "hidden",
    width: 72,
  },
  thumbImage: { height: "100%", width: "100%" },
  thumbGlyph: {
    alignItems: "center",
    backgroundColor: cf.sheet.sunk,
    flex: 1,
    gap: 2,
    justifyContent: "center",
  },
  remove: {
    alignItems: "center",
    backgroundColor: ink.primary,
    borderRadius: 11,
    height: 22,
    justifyContent: "center",
    position: "absolute",
    end: 4,
    top: 4,
    width: 22,
  },
});
