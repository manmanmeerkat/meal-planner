// app/auth/sign-up.tsx
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

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("エラー", "全ての項目を入力してください");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("エラー", "パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      Alert.alert("エラー", "パスワードは6文字以上で入力してください");
      return;
    }

    try {
      setLoading(true);
      const error = await signUp(email, password);
      if (error) {
        Alert.alert("エラー", error.message);
      } else {
        Alert.alert(
          "確認メールを送信しました",
          "メールに記載されたリンクをクリックして、登録を完了してください",
          [
            {
              text: "OK",
              onPress: () => router.replace("/auth/sign-in"),
            },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>新規登録</ThemedText>
        <ThemedText style={styles.subtitle}>
          アカウントを作成して、レシピを管理しましょう
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
            placeholder="6文字以上で入力"
          />
          <Input
            label="パスワード（確認）"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="同じパスワードを入力"
          />
          <Button
            title={loading ? "登録中..." : "アカウントを作成"}
            onPress={handleSignUp}
            disabled={loading}
            style={styles.button}
            variant="primary"
          />
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            すでにアカウントをお持ちの方は
          </ThemedText>
          <Link href="/auth/sign-in" style={styles.link}>
            ログイン
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
