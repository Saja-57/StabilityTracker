"use client";

import { usePathname } from "next/navigation";
import { useState, type PropsWithChildren } from "react";

import { getCurrentNavigationItem } from "./navigation";
import { MobileSidebar } from "./mobile-sidebar";
import { PageContainer } from "./page-container";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function DashboardShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const currentItem = getCurrentNavigationItem(pathname);

  return (
    <div className="min-h-dvh bg-[var(--color-background-canvas)] lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-col">
        <TopBar
          onOpenNavigation={() => setNavigationOpen(true)}
          titleKey={currentItem.labelKey}
        />
        <main className="min-w-0 flex-1">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
      <MobileSidebar onOpenChange={setNavigationOpen} open={navigationOpen} />
    </div>
  );
}
