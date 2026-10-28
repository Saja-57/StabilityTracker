import { Suspense } from "react";

import { FileView } from "@/features/file/file-view";

export default async function ChildDetailPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return (
    <Suspense>
      <FileView childId={childId} />
    </Suspense>
  );
}
