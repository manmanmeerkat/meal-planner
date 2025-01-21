// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { HapticTab } from "../../components/ui/HapticTab";
import { router } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6B6B", // アプリのメインカラーに変更
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
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
        name="recipes"
        options={{
          title: "レシピ",
          tabBarIcon: ({ color }) => (
            <HapticTab icon="book-open" color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push({
              pathname: "/(tabs)/recipes",
              params: {
                refresh: Date.now().toString(),
              },
            });
          },
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "献立",
          tabBarIcon: ({ color }) => (
            <HapticTab icon="calendar" color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push({
              pathname: "/(tabs)/plans",
              params: {
                refresh: Date.now().toString(),
              },
            });
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          tabBarIcon: ({ color }) => (
            <HapticTab icon="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
