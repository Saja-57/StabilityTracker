import "server-only";

import { createSupabaseServerClient } from "@stability/supabase/server";
import { cookies } from "next/headers";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    {
      url: process.env["NEXT_PUBLIC_SUPABASE_URL"],
      anonKey: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    },
    {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Middleware will refresh them.
        }
      },
    },
  );
}
