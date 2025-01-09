// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { HapticTab } from "../../components/ui/HapticTab";
import { Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";

export default function TabLayout() {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "サインアウト",
      "本当にサインアウトしますか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "サインアウト",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/auth/sign-in");
            } catch (error) {
              Alert.alert("エラー", "サインアウトに失敗しました。");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerRight: () => (
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => ({
              marginRight: 16,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          </Pressable>
        ),
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
    </Tabs>
  );
}
