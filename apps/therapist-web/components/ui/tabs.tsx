"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

import { cx, focusRing } from "./styles";

export interface TabItem {
  readonly value: string;
  readonly label: ReactNode;
  readonly content: ReactNode;
  readonly disabled?: boolean;
}

export interface TabsProps {
  readonly items: readonly TabItem[];
  readonly defaultValue: string;
  readonly className?: string;
}

export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue}
      className={cx("grid gap-4", className)}
    >
      <TabsPrimitive.List className="inline-flex w-fit max-w-full gap-1 overflow-x-auto rounded-[var(--radius-medium)] border border-[var(--color-border-subtle)] bg-[var(--color-background-subtle)] p-1">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cx(
              "type-button min-h-9 shrink-0 rounded-[var(--radius-small)] px-3 text-[var(--color-text-secondary)] outline-none transition-colors data-[disabled]:opacity-45 data-[state=active]:bg-[var(--color-surface-primary)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-[var(--shadow-subtle)]",
              focusRing,
            )}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className={cx("outline-none", focusRing)}
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
