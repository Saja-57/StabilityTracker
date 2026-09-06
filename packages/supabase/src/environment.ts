export interface SupabasePublicEnvironment {
  readonly url: string | undefined;
  readonly anonKey: string | undefined;
}

export interface ResolvedSupabasePublicEnvironment {
  readonly url: string;
  readonly anonKey: string;
}

export function requireSupabasePublicEnvironment(
  environment: SupabasePublicEnvironment,
): ResolvedSupabasePublicEnvironment {
  if (!environment.url) {
    throw new Error("A public Supabase URL is required.");
  }

  if (!environment.anonKey) {
    throw new Error("A public Supabase anonymous key is required.");
  }

  return {
    url: environment.url,
    anonKey: environment.anonKey,
  };
}
