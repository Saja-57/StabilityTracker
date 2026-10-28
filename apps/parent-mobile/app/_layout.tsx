import { Cairo_400Regular } from "@expo-google-fonts/cairo/400Regular";
import { Cairo_500Medium } from "@expo-google-fonts/cairo/500Medium";
import { Cairo_700Bold } from "@expo-google-fonts/cairo/700Bold";
import { Cairo_800ExtraBold } from "@expo-google-fonts/cairo/800ExtraBold";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque/700Bold";
import { BricolageGrotesque_800ExtraBold } from "@expo-google-fonts/bricolage-grotesque/800ExtraBold";
import { GeistMono_400Regular } from "@expo-google-fonts/geist-mono/400Regular";
import { GeistMono_500Medium } from "@expo-google-fonts/geist-mono/500Medium";
import { Heebo_400Regular } from "@expo-google-fonts/heebo/400Regular";
import { Heebo_500Medium } from "@expo-google-fonts/heebo/500Medium";
import { Heebo_700Bold } from "@expo-google-fonts/heebo/700Bold";
import { Heebo_800ExtraBold } from "@expo-google-fonts/heebo/800ExtraBold";
import { Ubuntu_400Regular } from "@expo-google-fonts/ubuntu/400Regular";
import { Ubuntu_500Medium } from "@expo-google-fonts/ubuntu/500Medium";
import { Ubuntu_700Bold } from "@expo-google-fonts/ubuntu/700Bold";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { caseFile } from "@stability/design-tokens";

import { FamilyStoreProvider } from "@/providers/family-store-provider";
import { LanguageProvider } from "@/providers/language-provider";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
    Heebo_400Regular,
    Heebo_500Medium,
    Heebo_700Bold,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_700Bold,
    Heebo_800ExtraBold,
    Cairo_800ExtraBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    GeistMono_400Regular,
    GeistMono_500Medium,
  });

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <FamilyStoreProvider>
          <StatusBar barStyle="dark-content" />
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: caseFile.sheet.base },
              headerShown: false,
            }}
          />
        </FamilyStoreProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
