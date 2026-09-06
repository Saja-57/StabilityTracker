import "react-native-url-polyfill/auto";

import * as SecureStore from "expo-secure-store";
import { createSupabaseMobileClient } from "@stability/supabase/mobile";
import { AppState } from "react-native";

const secureSessionStorage = {
  getItem: (key: string): Promise<string | null> =>
    SecureStore.getItemAsync(key),
  setItem: (key: string, value: string): Promise<void> =>
    SecureStore.setItemAsync(key, value),
  removeItem: (key: string): Promise<void> => SecureStore.deleteItemAsync(key),
};

let mobileClient: ReturnType<typeof createSupabaseMobileClient> | undefined;

export function getSupabaseMobileClient() {
  mobileClient ??= createSupabaseMobileClient(
    {
      url: process.env["EXPO_PUBLIC_SUPABASE_URL"],
      anonKey: process.env["EXPO_PUBLIC_SUPABASE_ANON_KEY"],
    },
    secureSessionStorage,
  );

  return mobileClient;
}

export function registerMobileAuthAutoRefresh(): () => void {
  const client = getSupabaseMobileClient();

  if (AppState.currentState === "active") {
    client.auth.startAutoRefresh();
  }

  const subscription = AppState.addEventListener("change", (state) => {
    if (state === "active") {
      client.auth.startAutoRefresh();
    } else {
      client.auth.stopAutoRefresh();
    }
  });

  return () => {
    subscription.remove();
    client.auth.stopAutoRefresh();
  };
}
