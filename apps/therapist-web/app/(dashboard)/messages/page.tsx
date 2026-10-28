import { Suspense } from "react";

import { MessagesView } from "@/features/messages/messages-view";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-[38rem]" aria-busy="true" />}>
      <MessagesView />
    </Suspense>
  );
}
