import { createServerClient, type CookieOptions } from "@supabase/ssr";

import {
  requireSupabasePublicEnvironment,
  type SupabasePublicEnvironment,
} from "./environment";

export interface SupabaseServerCookie {
  readonly name: string;
  readonly value: string;
  readonly options: CookieOptions;
}

export interface SupabaseServerCookieStore {
  getAll(): Array<{ name: string; value: string }>;
  setAll(cookies: SupabaseServerCookie[]): void | Promise<void>;
}

export function createSupabaseServerClient(
  environment: SupabasePublicEnvironment,
  cookieStore: SupabaseServerCookieStore,
) {
  const { url, anonKey } = requireSupabasePublicEnvironment(environment);

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookies) => cookieStore.setAll(cookies),
    },
  });
}
