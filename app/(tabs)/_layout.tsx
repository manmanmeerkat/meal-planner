import { Tabs } from "expo-router";
import { HapticTab } from "../../components/ui/HapticTab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarLabelStyle: {
          fontSize: 12,
        },
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
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "献立",
          tabBarIcon: ({ color }) => (
            <HapticTab icon="calendar" color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
