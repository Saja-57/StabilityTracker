import { Cairo_400Regular } from "@expo-google-fonts/cairo/400Regular";
import { Cairo_500Medium } from "@expo-google-fonts/cairo/500Medium";
import { Cairo_700Bold } from "@expo-google-fonts/cairo/700Bold";
import { Heebo_400Regular } from "@expo-google-fonts/heebo/400Regular";
import { Heebo_500Medium } from "@expo-google-fonts/heebo/500Medium";
import { Heebo_700Bold } from "@expo-google-fonts/heebo/700Bold";
import { Ubuntu_400Regular } from "@expo-google-fonts/ubuntu/400Regular";
import { Ubuntu_500Medium } from "@expo-google-fonts/ubuntu/500Medium";
import { Ubuntu_700Bold } from "@expo-google-fonts/ubuntu/700Bold";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@stability/design-tokens";

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
        <StatusBar
          backgroundColor={colors.background.canvas}
          barStyle="dark-content"
        />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background.canvas },
            headerShown: false,
          }}
        />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
