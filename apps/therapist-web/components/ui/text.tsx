import type { TextColor, TypographyVariant } from "@stability/design-tokens";
import {
  getDirection,
  getFontFamilyForLanguage,
  type SupportedLanguage,
} from "@stability/i18n";
import type { HTMLAttributes } from "react";

import { cx } from "./styles";

type TextElement = "h1" | "h2" | "h3" | "p" | "span" | "label";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  readonly as?: TextElement;
  readonly variant?: TypographyVariant;
  readonly color?: TextColor;
  readonly language?: SupportedLanguage;
}

export function Text({
  as: Component = "p",
  variant = "body",
  color = "primary",
  language,
  className,
  style,
  ...props
}: TextProps) {
  return (
    <Component
      {...props}
      lang={language}
      dir={language ? getDirection(language) : undefined}
      className={cx(`type-${variant}`, className)}
      style={{
        color: `var(--color-text-${color})`,
        ...style,
        ...(language
          ? { fontFamily: getFontFamilyForLanguage(language) }
          : undefined),
      }}
    />
  );
}
