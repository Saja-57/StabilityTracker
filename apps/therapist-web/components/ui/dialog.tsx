"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { getIconSize, iconStrokeWidth } from "./icon";
import { cx, focusRing } from "./styles";
import { Text } from "./text";

export interface DialogProps {
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly trigger?: ReactElement;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly closeLabel: string;
  readonly className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  closeLabel,
  className,
}: DialogProps) {
  return (
    <DialogPrimitive.Root
      {...(open === undefined ? {} : { open })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      {trigger ? (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      ) : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[var(--color-overlay-backdrop)] data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <DialogPrimitive.Content
          className={cx(
            "fixed start-1/2 top-1/2 z-50 grid max-h-[min(85dvh,720px)] w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-[var(--radius-large)] border border-[var(--color-border-default)] bg-[var(--color-surface-primary)] p-6 shadow-[var(--shadow-raised)] focus:outline-none rtl:translate-x-1/2",
            className,
          )}
        >
          <header className="grid gap-1 pe-10">
            <DialogPrimitive.Title asChild>
              <Text as="h2" variant="sectionTitle">
                {title}
              </Text>
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description asChild>
                <Text color="secondary">{description}</Text>
              </DialogPrimitive.Description>
            ) : null}
          </header>
          <div>{children}</div>
          {footer ? (
            <footer className="flex flex-wrap justify-end gap-2 border-t border-[var(--color-border-subtle)] pt-4">
              {footer}
            </footer>
          ) : null}
          <DialogPrimitive.Close asChild>
            <button
              type="button"
              aria-label={closeLabel}
              className={cx(
                "absolute end-4 top-4 grid size-9 place-items-center rounded-[var(--radius-small)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-interactive)] hover:text-[var(--color-text-primary)]",
                focusRing,
              )}
            >
              <X
                aria-hidden="true"
                size={getIconSize("medium")}
                strokeWidth={iconStrokeWidth}
              />
            </button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
