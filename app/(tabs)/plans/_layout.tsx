// app/(tabs)/plans/_layout.tsx
import { Stack } from "expo-router";

export default function PlansLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "献立カレンダー",
        }}
      />
      <Stack.Screen
        name="[date]"
        options={{
          title: "献立詳細",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "献立作成",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "献立編集",
        }}
      />
    </Stack>
  );
}
