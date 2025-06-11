import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/auth";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(onboarding)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!hasCompletedOnboarding && !inOnboardingGroup) {
      router.replace("/(onboarding)");
    } else if (hasCompletedOnboarding && !isAuthenticated && !inAuthGroup) {
      router.replace("/auth/sign-in");
    } else if (isAuthenticated && (inAuthGroup || inOnboardingGroup)) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, hasCompletedOnboarding, segments, router]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerShown: false,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Stack.Screen
          name="(onboarding)"
          options={{
            headerShown: false,
            headerTitle: "Onboarding",
            title: "Welcome to IdeaBoard",
          }}
        />
        <Stack.Screen name="auth/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="auth/sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="board/[id]"
          options={{
            title: "Board",
            headerBackTitle: "Boards",
          }}
        />
        <Stack.Screen
          name="idea/[id]"
          options={{
            title: "Idea Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="modal/create-board"
          options={{
            presentation: "modal",
            title: "Create New Board",
            headerShadowVisible: true,
          }}
        />
        <Stack.Screen
          name="modal/create-idea"
          options={{
            presentation: "modal",
            title: "Create New Idea",
            headerShadowVisible: true,
          }}
        />
      </Stack>
    </>
  );
}
