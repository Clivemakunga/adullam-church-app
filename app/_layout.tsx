import { Redirect, SplashScreen, Stack } from "expo-router";
import { AuthProvider, useAuth } from '../providers/AuthProvider';
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { View } from "react-native";

export default function RootLayout() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      // Hide the splash screen once the session check is complete
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    // Return null or a loading indicator while waiting
    return null;
  }
  return (
    <AuthProvider>
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {session ? <Redirect href="/(tabs)" /> : <Redirect href="/" />}
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </View>
    </AuthProvider>
  );
}