import {
  isNavigationItemActive,
  type NavigationItemDefinition,
} from "./navigation";
import { SidebarItem } from "./sidebar-item";
import { Text } from "@/components/ui";

export interface NavigationSectionProps {
  readonly activePathname: string;
  readonly items: readonly NavigationItemDefinition[];
  readonly label: string;
  readonly onNavigate?: (() => void) | undefined;
  readonly translate: (key: NavigationItemDefinition["labelKey"]) => string;
}

export function NavigationSection({
  activePathname,
  items,
  label,
  onNavigate,
  translate,
}: NavigationSectionProps) {
  return (
    <section aria-label={label} className="grid gap-2">
      <Text color="muted" variant="caption" className="px-3">
        {label}
      </Text>
      <div className="grid gap-1">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            active={isNavigationItemActive(activePathname, item)}
            item={item}
            label={translate(item.labelKey)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}
