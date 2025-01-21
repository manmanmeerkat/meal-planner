// app/(tabs)/settings.tsx
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/hooks/useAuth";
import { ThemedView } from "@/components/ui/ThemedView";

const COLORS = {
  background: "#F5F7FA",
  card: "#FFFFFF",
  text: "#2D3748",
  textSecondary: "#718096",
  danger: "#FF6B6B",
  border: "#E2E8F0",
};

export default function Settings() {
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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>設定</ThemedText>
      </View>

      {/* アカウント設定セクション */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>アカウント</ThemedText>
        <View style={styles.card}>
          <Pressable
            onPress={() => {
              // プロフィール編集画面へ
            }}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.menuContent}>
              <Ionicons name="person-outline" size={24} color={COLORS.text} />
              <ThemedText style={styles.menuText}>プロフィール</ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.menuContent}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color={COLORS.danger}
              />
              <ThemedText style={[styles.menuText, { color: COLORS.danger }]}>
                サインアウト
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.danger} />
          </Pressable>
        </View>
      </View>

      {/* アプリ設定セクション */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>アプリについて</ThemedText>
        <View style={styles.card}>
          <Pressable
            onPress={() => {
              // 利用規約画面へ
            }}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.menuContent}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={COLORS.text}
              />
              <ThemedText style={styles.menuText}>利用規約</ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            onPress={() => {
              // プライバシーポリシー画面へ
            }}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.menuContent}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={COLORS.text}
              />
              <ThemedText style={styles.menuText}>
                プライバシーポリシー
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  pressed: {
    opacity: 0.7,
  },
});
