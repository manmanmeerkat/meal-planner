// app/(tabs)/plans/_layout.tsx
import { Stack } from "expo-router";

export default function PlansLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
    </Stack>
  );
}
