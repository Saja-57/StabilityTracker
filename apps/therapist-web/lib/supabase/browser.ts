"use client";

import { createSupabaseBrowserClient } from "@stability/supabase/browser";

let browserClient: ReturnType<typeof createSupabaseBrowserClient> | undefined;

export function getSupabaseBrowserClient() {
  browserClient ??= createSupabaseBrowserClient({
    url: process.env["NEXT_PUBLIC_SUPABASE_URL"],
    anonKey: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  });

  return browserClient;
}
