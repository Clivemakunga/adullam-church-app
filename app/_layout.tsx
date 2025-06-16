import { Redirect, SplashScreen, Stack } from "expo-router";
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
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {session ? <Redirect href="/(tabs)" /> : <Redirect href="/" />}
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-profession" options={{ headerShown: false }} />
      <Stack.Screen name="add-believers" options={{ headerShown: false }} />
      <Stack.Screen name="add-visitors" options={{ headerShown: false }} />
      <Stack.Screen name="admin-devotions" options={{ headerShown: false }} />
      <Stack.Screen name="adminHome" options={{ headerShown: false }} />
      <Stack.Screen name="believers" options={{ headerShown: false }} />
      <Stack.Screen name="create-event" options={{ headerShown: false }} />
      <Stack.Screen name="create-prayer-request" options={{ headerShown: false }} />
      <Stack.Screen name="create-professions" options={{ headerShown: false }} />
      <Stack.Screen name="create-reels" options={{ headerShown: false }} />
      <Stack.Screen name="create-sermons" options={{ headerShown: false }} />
      <Stack.Screen name="testimony-wall/create" options={{ headerShown: false }} />
      <Stack.Screen name="departments" options={{ headerShown: false }} />
      <Stack.Screen name="devotions" options={{ headerShown: false }} />
      <Stack.Screen name="manage-events" options={{ headerShown: false }} />
      <Stack.Screen name="ministries" options={{ headerShown: false }} />
      <Stack.Screen name="prayer-requests" options={{ headerShown: false }} />
      <Stack.Screen name="prayers" options={{ headerShown: false }} />
      <Stack.Screen name="professions" options={{ headerShown: false }} />
      <Stack.Screen name="sermon-details" options={{ headerShown: false }} />
      <Stack.Screen name="testimonies" options={{ headerShown: false }} />
      <Stack.Screen name="testimony-wall" options={{ headerShown: false }} />
      <Stack.Screen name="visitors-list" options={{ headerShown: false }} />
    </Stack>
    </View>
  );
}