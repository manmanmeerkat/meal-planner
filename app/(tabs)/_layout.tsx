// app/(tabs)/_layout.tsx
import { Tabs, router } from "expo-router";
import { HapticTab } from "../../components/ui/HapticTab";
import { Pressable } from "react-native";

export default function TabLayout() {
  // タブを押したときのハンドラー
  const handleTabPress = (route: string) => {
    router.push({
      pathname: route === "index" ? "/(tabs)" : "/(tabs)/plans",
      params: { refresh: Date.now().toString() },
    });
  };

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
          headerShown: false, // ここを追加
          tabBarIcon: ({ color }) => <HapticTab icon="home" color={color} />,
          tabBarButton: (props) => (
            <Pressable {...props} onPress={() => handleTabPress("index")} />
          ),
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
          tabBarButton: (props) => (
            <Pressable {...props} onPress={() => handleTabPress("plans")} />
          ),
        }}
      />
    </Tabs>
  );
}
