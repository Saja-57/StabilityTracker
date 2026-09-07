import type { TextInputProps } from "./text-input";
import { TextControl } from "./text-input";

export function TextArea(props: TextInputProps) {
  return <TextControl {...props} multiline />;
}
