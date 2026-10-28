import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Where the app keeps what a family has done on this device. Screens never
 * talk to it directly; they go through the family store, so swapping this for
 * Supabase later changes one file, not every screen.
 */
export interface KeyValueStore {
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, value: T): Promise<void>;
}

const namespace = "stability:v1:";

export const deviceStore: KeyValueStore = {
  async read<T>(key: string) {
    try {
      const raw = await AsyncStorage.getItem(namespace + key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      // A corrupt or unreadable entry falls back to the sample state.
      return null;
    }
  },
  async write<T>(key: string, value: T) {
    try {
      await AsyncStorage.setItem(namespace + key, JSON.stringify(value));
    } catch {
      // Losing one write is better than crashing mid-meltdown.
    }
  },
};
