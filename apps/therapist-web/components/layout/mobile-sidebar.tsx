"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { SidebarContent } from "./sidebar-content";
import { BrandLogo, IconButton } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

export interface MobileSidebarProps {
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const { t } = useLanguage();

  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[var(--color-overlay-backdrop)] lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 start-0 z-50 flex w-[min(88vw,18rem)] flex-col gap-8 overflow-y-auto border-e border-[var(--color-border-default)] bg-[var(--color-surface-primary)] p-5 shadow-[var(--shadow-raised)] outline-none lg:hidden">
          <header className="flex min-h-11 items-center justify-between gap-4">
            <DialogPrimitive.Title asChild>
              <div className="flex items-center">
                <BrandLogo priority size="medium" variant="horizontal" />
              </div>
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <IconButton
                aria-label={t("common.close")}
                icon={X}
                variant="ghost"
              />
            </DialogPrimitive.Close>
          </header>
          <DialogPrimitive.Description className="sr-only">
            {t("shell.navigationDescription")}
          </DialogPrimitive.Description>
          <SidebarContent onNavigate={() => onOpenChange(false)} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
