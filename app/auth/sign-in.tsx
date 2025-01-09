// app/auth/sign-in.tsx
import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { ThemedView } from "../../components/ui/ThemedView";
import { ThemedText } from "../../components/ui/ThemedText";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const COLORS = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  background: "#F7F9FC",
  card: "#FFFFFF",
  text: {
    primary: "#2D3748",
    secondary: "#718096",
  },
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      setLoading(true);
      const error = await signIn(email, password);
      if (error) {
        Alert.alert("エラー", error.message);
      } else {
        router.replace("/(tabs)");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>ログイン</ThemedText>
        <ThemedText style={styles.subtitle}>
          アカウントにログインして、レシピを管理しましょう
        </ThemedText>

        <View style={styles.form}>
          <Input
            label="メールアドレス"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="example@email.com"
          />
          <Input
            label="パスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="パスワードを入力"
          />
          <Button
            title={loading ? "ログイン中..." : "ログイン"}
            onPress={handleSignIn}
            disabled={loading}
            style={styles.button}
            variant="primary"
          />
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            アカウントをお持ちでない方は
          </ThemedText>
          <Link href="/auth/sign-up" style={styles.link}>
            新規登録
          </Link>
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
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: COLORS.text.secondary,
  },
  form: {
    gap: 16,
  },
  button: {
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  footerText: {
    color: COLORS.text.secondary,
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
