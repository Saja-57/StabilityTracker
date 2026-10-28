/** Fill "{name}" placeholders in a translated template. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Isolate user or sample content so its own script picks its direction
 * (Unicode first-strong isolate). Use for any data string shown inside
 * translated RTL or LTR layouts; React Native has no <bdi>.
 */
export function isolate(text: string | undefined): string {
  return text ? `⁨${text}⁩` : "";
}
