import { cx } from "@/components/ui/styles";
import { getChild } from "@/lib/sample-data/fixtures";

const sizes = {
  small: "size-8 text-[12px] rounded-[9px]",
  medium: "size-11 text-[15px] rounded-[12px]",
  large: "size-16 text-[22px] rounded-[16px]",
} as const;

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function FileMonogram({
  childId,
  size = "medium",
  className,
}: {
  childId: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const child = getChild(childId);
  if (!child) return null;
  return (
    <span
      aria-hidden="true"
      className={cx(
        "font-display grid shrink-0 place-items-center bg-board text-board-ink ring-1 ring-inset ring-board-line",
        sizes[size],
        className,
      )}
    >
      {initialsOf(child.name)}
    </span>
  );
}
