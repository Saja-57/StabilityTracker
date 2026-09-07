"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactElement, ReactNode } from "react";

import { cx } from "./styles";

export interface TooltipProps {
  readonly children: ReactElement;
  readonly content: ReactNode;
  readonly side?: "top" | "right" | "bottom" | "left";
  readonly className?: string;
}

export function Tooltip({
  children,
  content,
  side = "top",
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cx(
              "type-caption z-50 max-w-64 rounded-[var(--radius-small)] bg-[var(--color-text-primary)] px-2.5 py-1.5 text-[var(--color-text-inverse)] shadow-[var(--shadow-subtle)] data-[state=closed]:opacity-0 data-[state=delayed-open]:opacity-100",
              className,
            )}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
