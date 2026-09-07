import type { PropsWithChildren } from "react";

import { DashboardShell } from "@/components/layout";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardShell>{children}</DashboardShell>;
}
