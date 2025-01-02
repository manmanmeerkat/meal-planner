// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { HapticTab } from "../../components/ui/HapticTab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          tabBarIcon: ({ color }) => <HapticTab icon="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes/index" // パスを修正
        options={{
          title: "レシピ",
          tabBarIcon: ({ color }) => (
            <HapticTab icon="book-open" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plans/index" // パスを修正
        options={{
          title: "献立",
          tabBarIcon: ({ color }) => (
            <HapticTab icon="calendar" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
