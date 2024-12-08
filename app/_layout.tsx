import { Slot } from "expo-router";
import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const queryClient = new QueryClient();

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inHomeGroup = segments[0] === "home";

    if (!token && !inAuthGroup && segments[0] !== "") {
      router.replace("/");
    } else if (token && inAuthGroup) {
      router.replace("/home");
    }
  }, [token, segments, router]);
}

export default function RootLayout() {
  useProtectedRoute();

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
          <Stack.Screen name="home/index" />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
