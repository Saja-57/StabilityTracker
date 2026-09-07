"use client";

import { SidebarContent } from "./sidebar-content";
import { BrandLogo } from "@/components/ui";

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh min-w-0 flex-col gap-8 border-e border-[var(--color-border-subtle)] bg-[var(--color-surface-primary)] p-5 lg:flex">
      <div className="flex min-h-11 items-center">
        <BrandLogo priority size="medium" variant="horizontal" />
      </div>
      <SidebarContent />
    </aside>
  );
}
